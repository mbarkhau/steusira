import { berechne } from "./steuern.js";
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

const EINKOMMEN_ZEILEN = [
  ["netto", "Netto (Arbeitnehmer)"],
  ["brutto", "Brutto (Arbeitnehmer)"],
  ["ag", "Brutto (Arbeitgeber)"],
];

const form = document.getElementById("fragebogen");
const schritte = [...form.querySelectorAll(".schritt")];
const fragen = schritte.filter((s) => s.dataset.schritt !== "ergebnis");
const segmente = document.getElementById("segmente");
const zurueck = document.getElementById("zurueck");

const antwort = {
  verheiratet: null, kinder: null, kirche: null, kv: null, land: null, raucher: null,
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
const schachteln = () => (antwort.raucher === "ja" ? liesZahl(form.elements.schachteln.value) ?? 0 : 0);

function lage() {
  return {
    verheiratet: antwort.verheiratet === "ja",
    kinder: kinderAnzahl(),
    kirche: antwort.kirche === "ja" ? kirchensatz(antwort.land) : 0,
  };
}

// --- Aufbau ---

for (let i = 0; i < fragen.length; i++) segmente.append(document.createElement("li"));

document.getElementById("laender").append(...LAENDER.map(([kurz, name]) => {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.wert = kurz;
  b.textContent = name;
  return b;
}));

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

  [...segmente.children].forEach((li, i) => {
    li.className = i < index ? "erledigt" : i === index ? "aktiv" : "";
  });
  const fortschritt = document.getElementById("fortschritt");
  fortschritt.setAttribute("aria-valuenow", String(Math.min(index + 1, fragen.length)));
  document.getElementById("schritt-text").textContent = fertig ? "Fertig" : `Schritt ${index + 1} von ${fragen.length}`;
  zurueck.style.visibility = index === 0 ? "hidden" : "visible";

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
  if (name === "wohnraum") return form.elements.flaeche.focus();
  if (name === "ergebnis") return document.getElementById("zum-rechner").focus();
  const gewaehlt = schritt.querySelector(`.wahl button[data-wert="${antwort[name]}"]`);
  (gewaehlt ?? schritt.querySelector(".wahl [data-vorgabe]") ?? schritt.querySelector("button"))?.focus();
}

const weiter = () => zeige(Math.min(aktuell + 1, schritte.length - 1));

zurueck.addEventListener("click", () => zeige(Math.max(aktuell - 1, 0)));

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
  const name = schritte[aktuell].dataset.schritt;
  if (name === "einkommen" && !antwort.einkommen) return;
  if (name === "kinder" && antwort.kinder === "ja" && !kinderAnzahl()) return form.elements.kinderAnzahl.focus();
  if (schritte[aktuell].querySelector(".folge[hidden]")) return;
  weiter();
});

for (const schritt of schritte) {
  schritt.querySelector(".antworten")?.addEventListener("click", (event) => {
    const ziel = event.target.closest("[data-gehe]");
    if (ziel) zeige(Number(ziel.dataset.gehe));
  });
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
  document.getElementById("einkommen-weiter").disabled = !fest;
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
  const eingabe = { brutto: werte.bruttoJahr, ...l, zigaretten: schachteln() };
  const r = berechne(eingabe);

  document.getElementById("fb-gesamt").textContent = `${euro.format(r.nachKindergeld)} €`;
  document.getElementById("fb-quote").textContent =
    `${prozent.format(r.quote)} des Bruttoeinkommens von ${euro.format(r.einkommen)} € (nach Kindergeld)`;

  const land = LAENDER.find(([kurz]) => kurz === antwort.land)?.[1] ?? "–";
  const jaNein = (x) => (x === "ja" ? "Ja" : "Nein");
  const flaeche = liesZahl(form.elements.flaeche.value);
  const miete = liesEuro(form.elements.kaltmiete.value);
  const zeilen = [
    ["Verheiratet", jaNein(antwort.verheiratet)],
    ["Kinder", antwort.kinder === "ja" ? String(l.kinder) : "Nein"],
    ["Kirchensteuer", antwort.kirche === "ja" ? `Ja (${Math.round(l.kirche * 100)} %)` : "Nein"],
    ["Krankenversicherung", antwort.kv === "privat" ? "Privat" : "Gesetzlich"],
    ["Bundesland", land],
    ["Brutto (Arbeitnehmer)", `${euro.format(werte.bruttoJahr)} € pro Jahr`],
    ["Raucher", antwort.raucher === "ja" ? `${String(schachteln()).replace(".", ",")} Schachteln pro Woche` : "Nein"],
    ["Wohnraum", [flaeche !== null && `${euro.format(flaeche)} m²`, miete !== null && `${euro.format(miete)} € kalt`]
      .filter(Boolean).join(", ") || "–"],
  ];
  const schrittVon = ["verheiratet", "kinder", "kirche", "kv", "land", "einkommen", "raucher", "wohnraum"];
  document.getElementById("antworten").innerHTML = zeilen.map(([dt, dd], i) =>
    `<div><dt>${dt}</dt><dd>${dd}</dd><dd><button type="button" class="aendern" data-gehe="${
      schritte.findIndex((s) => s.dataset.schritt === schrittVon[i])}">ändern</button></dd></div>`).join("");

  const params = new URLSearchParams({ brutto: String(werte.bruttoJahr) });
  if (l.verheiratet) params.set("verheiratet", "1");
  if (l.kinder) params.set("kinder", String(l.kinder));
  if (l.kirche) params.set("kirche", String(l.kirche));
  if (eingabe.zigaretten) params.set("zigaretten", String(eingabe.zigaretten));
  document.getElementById("zum-rechner").href = `/#${params}`;
}

zeige(0);
