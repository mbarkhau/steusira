import { berechne, land } from "./steuern.js";
import { ableiten, FELDER, partner } from "./einkommen.js";

const euro = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
const prozent = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 });

// Reihenfolge der Bundesländer: zwei Spalten, grob von Nord nach Süd
const LAENDER = [
  ["SH", "Schleswig-Holstein"], ["MV", "Mecklenburg-Vorpommern"],
  ["HB", "Bremen"], ["HH", "Hamburg"],
  ["BE", "Berlin"], ["BB", "Brandenburg"],
  ["NI", "Niedersachsen"], ["ST", "Sachsen-Anhalt"],
  ["NW", "Nordrhein-Westfalen"], ["HE", "Hessen"],
  ["TH", "Thüringen"], ["SN", "Sachsen"],
  ["SL", "Saarland"], ["RP", "Rheinland-Pfalz"],
  ["BW", "Baden-Württemberg"], ["BY", "Bayern"],
];
const kirchensatz = (land) => (land === "BW" || land === "BY" ? 0.08 : 0.09);

const BERUFE = {
  selbststaendig: "Selbstständig",
  privat: "Angestellt, Privatwirtschaft",
  sozial: "Angestellt, Gesundheit, Pflege, Soziales",
  oeffentlich: "Angestellt, öffentlicher Dienst",
  beamte: "Beamte, Richter, Soldaten",
  keine: "Nicht erwerbstätig",
};

// Besoldungsordnung A (Laufbahnen), B (Spitzenämter), R (Richter, Staatsanwälte), W (Professoren)
const BESOLDUNG = [
  ...Array.from({ length: 14 }, (_, i) => `A${i + 3}`),
  "B", "R1", "R2", "R3+", "W2", "W3",
];

const EINKOMMEN_ZEILEN = [
  ["netto", "Netto (Arbeitnehmer)"],
  ["brutto", "Brutto (Arbeitnehmer)"],
  ["ag", "Brutto (Arbeitgeber)"],
];

const form = document.getElementById("fragebogen");
const schritte = [...form.querySelectorAll(".schritt")];
// Die Besoldungsgruppe fragt der Fragebogen nur bei Beamten ab.
const aktiv = (s) => s.dataset.schritt !== "besoldung" || antwort.beruf === "beamte";
const fragen = () => schritte.filter((s) => aktiv(s) && s.dataset.schritt !== "ergebnis");
const segmente = document.getElementById("segmente");
const zurueck = document.getElementById("zurueck");
const weiterButton = document.getElementById("weiter");

const antwort = {
  verheiratet: null, kinder: null, kirche: null, kv: null, land: null, beruf: null, besoldung: null, raucher: null,
  einkommen: null, // { feld, wert }: das Feld, das der Nutzer zuletzt bearbeitet hat
};
let aktuell = 0;

// "3.500,50" → 3500.5; leer oder ungültig → null
const liesEuro = (text) => {
  const x = Number(text.replace(/[\s.€]/g, "").replace(",", "."));
  return text.trim() !== "" && Number.isFinite(x) && x >= 0 ? x : null;
};
const liesZahl = (text) => {
  const x = Number(text.trim().replace(",", "."));
  return text.trim() !== "" && Number.isFinite(x) && x >= 0 ? x : null;
};

const kinderAnzahl = () => (antwort.kinder === "ja" ? Math.round(liesZahl(form.elements.kinderAnzahl.value) ?? 0) : 0);
const jahr = (name) => {
  const x = liesZahl(form.elements[name].value);
  return x !== null && Number.isInteger(x) ? x : null;
};
const schachteln = () => (antwort.raucher === "ja" ? liesZahl(form.elements.schachteln.value) ?? 0 : 0);

function lage() {
  return {
    verheiratet: antwort.verheiratet === "ja",
    kinder: kinderAnzahl(),
    kirche: antwort.kirche === "ja" ? kirchensatz(antwort.land) : 0,
  };
}

// --- Aufbau ---

const wahlButton = (wert, text) => {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.wert = wert;
  b.textContent = text;
  return b;
};
document.getElementById("laender").append(...LAENDER.map(([kurz, name]) => wahlButton(kurz, name)));
document.getElementById("besoldung").append(...BESOLDUNG.map((g) => wahlButton(g, g)));

document.getElementById("einkommen-felder").append(...EINKOMMEN_ZEILEN.map(([art, label]) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `<th scope="row">${label}</th>`;
  for (const zeit of ["Monat", "Jahr"]) {
    const feld = art + zeit;
    const td = document.createElement("td");
    td.innerHTML = `<div class="zahl"><input name="${feld}" inputmode="decimal" aria-label="${label} pro ${zeit}">`
      + `<span class="einheit">€</span></div><small class="schaetzung" data-fuer="${feld}">*Vorläufige Schätzung</small>`;
    tr.append(td);
  }
  return tr;
}));

// --- Navigation ---

function zeige(index) {
  aktuell = index;
  schritte.forEach((s, i) => { s.hidden = i !== index; });
  const schritt = schritte[index];
  const fertig = schritt.dataset.schritt === "ergebnis";

  const liste = fragen();
  const position = fertig ? liste.length : liste.indexOf(schritt);
  // Erledigte Segmente sind Buttons: ein Klick geht zurück zu diesem Schritt.
  segmente.replaceChildren(...liste.map((s, i) => {
    const li = document.createElement("li");
    li.className = i < position ? "erledigt" : i === position ? "aktiv" : "";
    const seg = document.createElement(i < position ? "button" : "span");
    seg.className = "seg";
    if (i < position) {
      seg.type = "button";
      seg.dataset.gehe = String(schritte.indexOf(s));
      seg.title = `Schritt ${i + 1}: ${s.querySelector("h2").textContent}`;
      seg.setAttribute("aria-label", `Zurück zu ${seg.title}`);
    }
    li.append(seg);
    return li;
  }));
  const fortschritt = document.getElementById("fortschritt");
  fortschritt.setAttribute("aria-valuemax", String(liste.length));
  fortschritt.setAttribute("aria-valuenow", String(Math.min(position + 1, liste.length)));
  document.getElementById("schritt-text").textContent = fertig ? "Fertig" : `Schritt ${position + 1} von ${liste.length}`;
  zurueck.style.visibility = index === 0 ? "hidden" : "visible";
  weiterButton.hidden = fertig;
  weiterButton.textContent = schritt.dataset.schritt === "wohnraum" ? "Auswerten" : "Weiter";
  aktualisiereWeiter();

  if (schritt.dataset.schritt === "einkommen") aktualisiereEinkommen();
  if (fertig) zeigeErgebnis();
  fokus(schritt);
}

// Der Fokus liegt auf der gewählten Antwort oder auf der Vorgabe. So genügt die Eingabetaste.
function fokus(schritt) {
  const name = schritt.dataset.schritt;
  const folge = schritt.querySelector(".folge");
  if (folge && !folge.hidden) {
    folge.querySelector("input").select();
    folge.querySelector("input").focus();
    return;
  }
  if (name === "einkommen") return form.elements[antwort.einkommen?.feld ?? "nettoMonat"].focus();
  if (name === "lebenslauf") return form.elements.geburtsjahr.focus();
  if (name === "wohnraum") return form.elements.flaeche.focus();
  if (name === "ergebnis") return document.getElementById("zum-rechner").focus();
  const gewaehlt = schritt.querySelector(`.wahl button[data-wert="${antwort[name]}"]`);
  (gewaehlt ?? schritt.querySelector(".wahl [data-vorgabe]") ?? schritt.querySelector("button"))?.focus();
}

// Nächster oder vorheriger Schritt, der für die bisherigen Antworten gilt
function nachbar(richtung) {
  let i = aktuell + richtung;
  while (schritte[i] && !aktiv(schritte[i])) i += richtung;
  return schritte[i] ? i : aktuell;
}
const weiter = () => zeige(nachbar(1));

// Ohne Vorgabe (Bundesland, Besoldungsgruppe) und ohne Einkommen ist "Weiter" erst nach einer Antwort aktiv.
function aktualisiereWeiter() {
  const schritt = schritte[aktuell];
  const name = schritt.dataset.schritt;
  const ohneVorgabe = schritt.querySelector(".wahl") && !schritt.querySelector(".wahl [data-vorgabe]");
  weiterButton.disabled = name === "einkommen" ? !antwort.einkommen : Boolean(ohneVorgabe && !antwort[name]);
}

zurueck.addEventListener("click", () => zeige(nachbar(-1)));
segmente.addEventListener("click", (event) => {
  const ziel = event.target.closest("[data-gehe]");
  if (ziel) zeige(Number(ziel.dataset.gehe));
});

form.addEventListener("click", (event) => {
  const button = event.target.closest(".wahl button");
  if (!button) return;
  const schritt = button.closest(".schritt");
  antwort[schritt.dataset.schritt] = button.dataset.wert;
  for (const b of schritt.querySelectorAll(".wahl button")) b.setAttribute("aria-pressed", String(b === button));
  const folge = schritt.querySelector(".folge");
  if (folge) folge.hidden = !("folge" in button.dataset);
  if (folge && !folge.hidden) fokus(schritt);
  else weiter();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const schritt = schritte[aktuell];
  const name = schritt.dataset.schritt;
  if (name === "ergebnis") return;
  // Ohne Antwort gilt die Vorgabe. Der Klick auf die Vorgabe geht weiter oder öffnet die Folgefrage.
  if (schritt.querySelector(".wahl") && !antwort[name]) return schritt.querySelector(".wahl [data-vorgabe]")?.click();
  if (name === "einkommen" && !antwort.einkommen) return;
  if (name === "kinder" && antwort.kinder === "ja" && !kinderAnzahl()) return form.elements.kinderAnzahl.focus();
  if (name === "lebenslauf" && !pruefeLebenslauf()) return;
  weiter();
});

for (const schritt of schritte) {
  schritt.querySelector(".antworten")?.addEventListener("click", (event) => {
    const ziel = event.target.closest("[data-gehe]");
    if (ziel) zeige(Number(ziel.dataset.gehe));
  });
}

// --- Geburtsjahr und Berufseintritt ---

// Beide Felder sind optional. Ein Wert muss eine Jahreszahl sein, der Berufseintritt liegt nach der Geburt.
function pruefeLebenslauf() {
  const heute = new Date().getFullYear();
  const geboren = jahr("geburtsjahr");
  const eintritt = jahr("berufseintritt");
  const leer = (name) => form.elements[name].value.trim() === "";
  let fehler = null;
  if (!leer("geburtsjahr") && (geboren === null || geboren < 1920 || geboren > heute - 14)) {
    fehler = ["geburtsjahr", `Bitte ein Geburtsjahr zwischen 1920 und ${heute - 14} eingeben.`];
  } else if (!leer("berufseintritt") && (eintritt === null || eintritt < 1930 || eintritt > heute)) {
    fehler = ["berufseintritt", `Bitte ein Jahr zwischen 1930 und ${heute} eingeben.`];
  } else if (geboren !== null && eintritt !== null && eintritt < geboren + 14) {
    fehler = ["berufseintritt", "Der Berufseintritt liegt mindestens 14 Jahre nach dem Geburtsjahr."];
  }
  const hinweis = document.getElementById("lebenslauf-fehler");
  hinweis.hidden = !fehler;
  hinweis.textContent = fehler?.[1] ?? "";
  if (fehler) form.elements[fehler[0]].focus();
  return !fehler;
}

// --- Haushaltseinkommen ---

// Das bearbeitete Feld ist fest. Die anderen Felder sind Schätzungen, ausser dem Gegenstück (mal 12).
function aktualisiereEinkommen() {
  const fest = antwort.einkommen;
  const werte = fest ? ableiten(fest.feld, fest.wert, lage()) : null;
  for (const feld of FELDER) {
    const geschaetzt = Boolean(fest) && feld !== fest.feld && feld !== partner(fest.feld);
    if (feld !== fest?.feld) form.elements[feld].value = werte ? euro.format(werte[feld]) : "";
    form.querySelector(`[data-fuer="${feld}"]`).classList.toggle("an", geschaetzt);
  }
  aktualisiereWeiter();
  document.getElementById("kv-hinweis").hidden = antwort.kv !== "privat";
}

for (const feld of FELDER) {
  form.elements[feld].addEventListener("input", (event) => {
    const wert = liesEuro(event.target.value);
    antwort.einkommen = wert === null ? null : { feld, wert };
    aktualisiereEinkommen();
  });
}

// --- Ergebnis ---

function zeigeErgebnis() {
  const l = lage();
  const werte = ableiten(antwort.einkommen.feld, antwort.einkommen.wert, l);
  const flaeche = liesZahl(form.elements.flaeche.value);
  const eingabe = { brutto: werte.bruttoJahr, ...l, zigaretten: schachteln(), land: antwort.land ?? "DE" };
  // Ohne Angabe gilt die durchschnittliche Wohnfläche je Wohnung im Bundesland.
  eingabe.wohnflaeche = flaeche ?? land(eingabe.land).wohnflaeche;
  const r = berechne(eingabe);

  document.getElementById("fb-gesamt").textContent = `${euro.format(r.nachKindergeld)} €`;
  document.getElementById("fb-quote").textContent =
    `${prozent.format(r.quote)} des Bruttoeinkommens von ${euro.format(r.einkommen)} € (nach Kindergeld)`;

  const land = LAENDER.find(([kurz]) => kurz === antwort.land)?.[1] ?? "–";
  const jaNein = (x) => (x === "ja" ? "Ja" : "Nein");
  const miete = liesEuro(form.elements.kaltmiete.value);
  const geboren = jahr("geburtsjahr");
  const eintritt = jahr("berufseintritt");
  const beruf = BERUFE[antwort.beruf] ?? "–";
  const zeilen = [
    ["verheiratet", "Verheiratet", jaNein(antwort.verheiratet)],
    ["kinder", "Kinder", antwort.kinder === "ja" ? String(l.kinder) : "Nein"],
    ["kirche", "Kirchensteuer", antwort.kirche === "ja" ? `Ja (${Math.round(l.kirche * 100)} %)` : "Nein"],
    ["kv", "Krankenversicherung", antwort.kv === "privat" ? "Privat" : "Gesetzlich"],
    ["land", "Bundesland", land],
    ["beruf", "Berufsgruppe", beruf],
    ...(antwort.beruf === "beamte" ? [["besoldung", "Besoldungsgruppe", antwort.besoldung ?? "–"]] : []),
    ["lebenslauf", "Geburtsjahr", geboren ?? "–"],
    ["lebenslauf", "Berufseintritt", eintritt === null ? "–"
      : `${eintritt} (${Math.max(new Date().getFullYear() - eintritt, 0)} Jahre im Beruf)`],
    ["einkommen", "Brutto (Arbeitnehmer)", `${euro.format(werte.bruttoJahr)} € pro Jahr`],
    ["raucher", "Raucher", antwort.raucher === "ja" ? `${String(schachteln()).replace(".", ",")} Schachteln pro Woche` : "Nein"],
    ["wohnraum", "Wohnraum", [flaeche !== null && `${euro.format(flaeche)} m²`, miete !== null && `${euro.format(miete)} € kalt`]
      .filter(Boolean).join(", ") || "–"],
  ];
  document.getElementById("antworten").innerHTML = zeilen.map(([name, dt, dd]) =>
    `<div><dt>${dt}</dt><dd>${dd}</dd><dd><button type="button" class="aendern" data-gehe="${
      schritte.findIndex((s) => s.dataset.schritt === name)}">ändern</button></dd></div>`).join("");

  const params = new URLSearchParams({ brutto: String(werte.bruttoJahr) });
  if (l.verheiratet) params.set("verheiratet", "1");
  if (l.kinder) params.set("kinder", String(l.kinder));
  if (l.kirche) params.set("kirche", String(l.kirche));
  if (eingabe.zigaretten) params.set("zigaretten", String(eingabe.zigaretten));
  params.set("land", eingabe.land);
  params.set("wohnflaeche", String(eingabe.wohnflaeche));
  document.getElementById("zum-rechner").href = `/#${params}`;
}

zeige(0);
