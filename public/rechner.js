import { berechne, JAHRE, parameter, standard, STANDARD } from "./steuern.js";

const euro = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
const prozent = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 });
const datum = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long" });
const komma = (x) => String(x).replace(".", ",");
const tausend = (x) => euro.format(x);
const satz = (x) => `${komma(Math.round(x * 1000) / 10)} %`;

const GRUPPEN = {
  einkommen: "Steuern auf Einkommen",
  sozial: "Sozialabgaben",
  arbeitgeber: "Arbeitgeberanteil",
  konsum: "Steuern auf Konsum",
  abgabe: "Sonstige Abgaben",
};

const ABSCHNITTE = [
  {
    titel: "Einkommen und Haushalt",
    offen: true,
    gruppen: ["einkommen", "sozial", "arbeitgeber"],
    felder: [
      { id: "brutto", label: "Bruttojahresgehalt", einheit: "€/Jahr", step: 1000 },
      { id: "verheiratet", label: "Verheiratet (Zusammenveranlagung)", typ: "check" },
      { id: "bruttoPartner", label: "Bruttojahresgehalt Partner", einheit: "€/Jahr", step: 1000,
        wenn: (e) => e.verheiratet },
      { id: "kinder", label: "Kinder mit Kindergeld", einheit: "Anzahl", step: 1, max: 12 },
      { id: "kirche", label: "Kirchensteuer", typ: "auswahl", optionen: [
        [0, "keine"], [0.08, "8 % (Bayern, Baden-Württemberg)"], [0.09, "9 % (andere Bundesländer)"],
      ] },
      { id: "kvZusatz", label: "Zusatzbeitrag Krankenkasse", einheit: "%", step: 0.1,
        hinweis: (p) => `Durchschnitt ${p.jahr}: ${satz(p.kvZusatz)}` },
      { id: "werbungskosten", label: "Werbungskosten", einheit: "€/Jahr", step: 100,
        hinweis: (p) => `Unter ${tausend(p.werbungskostenPausch)} € gilt der Pauschbetrag.` },
      { id: "kapital", label: "Kapitalerträge", einheit: "€/Jahr", step: 100,
        hinweis: "Zinsen, Dividenden, Kursgewinne" },
      { id: "arbeitgeber", label: "Arbeitgeberanteil zur Sozialversicherung einbeziehen", typ: "check",
        hinweis: "Der Arbeitgeber zahlt diesen Teil zusätzlich zum Brutto. Er ist Teil der Lohnkosten." },
      { id: "abgaben", label: "Sonstige Abgaben einbeziehen (CO₂-Preis, Rundfunkbeitrag)", typ: "check" },
    ],
  },
  {
    titel: "Lebensmittel und Konsum",
    bereiche: ["Ernährung", "Konsum"],
    felder: [
      { id: "lebensmittel", label: "Lebensmittel", einheit: "€/Monat", step: 10, hinweis: "7 % Umsatzsteuer" },
      { id: "getraenke", label: "Getränke ohne Alkohol", einheit: "€/Monat", step: 5,
        hinweis: "Wasser, Saft, Limonade: 19 %" },
      { id: "gastro", label: "Restaurant, Café, Imbiss", einheit: "€/Monat", step: 10,
        hinweis: (p) => `Speisen ${satz(p.ustGastroSpeisen)}, Getränke ${satz(p.ust)}` },
      { id: "konsum19", label: "Kleidung, Technik, Haushalt, Freizeit", einheit: "€/Monat", step: 10,
        hinweis: "19 % Umsatzsteuer" },
      { id: "konsum7", label: "Bücher, Zeitungen, Nahverkehr, Kultur", einheit: "€/Monat", step: 10,
        hinweis: "7 % Umsatzsteuer" },
    ],
  },
  {
    titel: "Wohnen und Energie",
    bereiche: ["Wohnen und Energie"],
    felder: [
      { id: "grundsteuer", label: "Grundsteuer", einheit: "€/Jahr", step: 10,
        hinweis: "Mieter zahlen sie über die Nebenkosten." },
      { id: "stromKwh", label: "Strom", einheit: "kWh/Jahr", step: 100,
        preis: { id: "stromPreis", einheit: "ct/kWh", step: 1 } },
      { id: "gasKwh", label: "Erdgas", einheit: "kWh/Jahr", step: 500,
        preis: { id: "gasPreis", einheit: "ct/kWh", step: 0.5 } },
      { id: "heizoelL", label: "Heizöl", einheit: "l/Jahr", step: 100,
        preis: { id: "heizoelPreis", einheit: "€/l", step: 0.05 } },
      { id: "co2Preis", label: "CO₂-Preis", einheit: "€/t", step: 1,
        hinweis: (p) => p.co2Hinweis },
    ],
  },
  {
    titel: "Mobilität",
    bereiche: ["Mobilität"],
    felder: [
      { id: "benzinL", label: "Benzin", einheit: "l/Monat", step: 5,
        preis: { id: "benzinPreis", einheit: "€/l", step: 0.01 } },
      { id: "dieselL", label: "Diesel", einheit: "l/Monat", step: 5,
        preis: { id: "dieselPreis", einheit: "€/l", step: 0.01 } },
      { id: "kfzSteuer", label: "Kfz-Steuer", einheit: "€/Jahr", step: 10 },
      { id: "fluegeKurz", label: "Flüge in Europa", einheit: "pro Jahr", step: 1,
        hinweis: (p) => `Abflüge aus Deutschland, ${komma(p.luftverkehr.kurz)} € je Flug` },
      { id: "fluegeMittel", label: "Flüge bis 6.000 km", einheit: "pro Jahr", step: 1,
        hinweis: (p) => `${komma(p.luftverkehr.mittel)} € je Abflug` },
      { id: "fluegeLang", label: "Langstreckenflüge", einheit: "pro Jahr", step: 1,
        hinweis: (p) => `${komma(p.luftverkehr.lang)} € je Abflug` },
    ],
  },
  {
    titel: "Zigaretten und Alkohol",
    bereiche: ["Tabak", "Alkohol"],
    felder: [
      { id: "zigaretten", label: "Zigaretten", einheit: "Schachteln/Woche", step: 1,
        preis: { id: "zigarettenPreis", einheit: "€/Schachtel", step: 0.1 } },
      { id: "tabakG", label: "Tabak zum Selbstdrehen", einheit: "g/Woche", step: 10,
        preis: { id: "tabakPreis", einheit: "€/40 g", step: 0.1 } },
      { id: "bier", label: "Bier", einheit: "l/Woche", step: 0.5,
        preis: { id: "bierPreis", einheit: "€/l", step: 0.1 } },
      { id: "wein", label: "Wein (0,75 l)", einheit: "Flaschen/Monat", step: 1,
        preis: { id: "weinPreis", einheit: "€/Flasche", step: 0.5 } },
      { id: "sekt", label: "Sekt (0,75 l)", einheit: "Flaschen/Monat", step: 1,
        preis: { id: "sektPreis", einheit: "€/Flasche", step: 0.5 } },
      { id: "spirituosen", label: "Spirituosen (0,7 l)", einheit: "Flaschen/Monat", step: 1,
        preis: { id: "spirituosenPreis", einheit: "€/Flasche", step: 0.5 } },
      { id: "kaffee", label: "Kaffee", einheit: "kg/Monat", step: 0.25,
        hinweis: "Nur für die Kaffeesteuer. Die Ausgaben zählen zu den Lebensmitteln." },
    ],
  },
  {
    titel: "Versicherungen und Sonstiges",
    bereiche: ["Sonstiges"],
    felder: [
      { id: "versicherungen", label: "Versicherungsbeiträge", einheit: "€/Jahr", step: 50,
        hinweis: "Haftpflicht, Hausrat, Kfz, Rechtsschutz. Ohne Kranken-, Lebens- und Rentenversicherung." },
      { id: "lotto", label: "Lotto und Lotterien", einheit: "€/Monat", step: 5 },
      { id: "hundesteuer", label: "Hundesteuer", einheit: "€/Jahr", step: 10 },
      { id: "rundfunk", label: (p) => `Rundfunkbeitrag (${komma(p.rundfunkMonat)} €/Monat)`, typ: "check" },
    ],
  },
];

const form = document.getElementById("eingabe");
let ansicht = "art";

// --- Zustand im URL-Hash ---

function ladeZustand() {
  const params = new URLSearchParams(location.hash.slice(1));
  const zustand = standard(Number(params.get("jahr")) || STANDARD.jahr);
  for (const [key, wert] of params) {
    if (key === "jahr") continue;
    if (!(key in STANDARD)) continue;
    if (typeof STANDARD[key] === "boolean") zustand[key] = wert === "1";
    else if (Number.isFinite(Number(wert))) zustand[key] = Number(wert);
  }
  return zustand;
}

function speichereZustand(zustand) {
  const params = new URLSearchParams();
  const vorgabe = { ...standard(zustand.jahr), jahr: STANDARD.jahr };
  for (const [key, wert] of Object.entries(zustand)) {
    if (wert === vorgabe[key]) continue;
    params.set(key, typeof wert === "boolean" ? (wert ? "1" : "0") : String(wert));
  }
  const hash = params.toString();
  history.replaceState(null, "", hash ? `#${hash}` : location.pathname);
}

function liesFormular() {
  const zustand = {};
  for (const key of Object.keys(STANDARD)) {
    const el = form.elements[key];
    if (!el) continue;
    if (el.type === "checkbox") zustand[key] = el.checked;
    else zustand[key] = Math.max(0, Number(el.value.replace(",", ".")) || 0);
  }
  return zustand;
}

// --- Formular ---

function el(tag, attrs = {}, ...kinder) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k === "text") node.textContent = v;
    else node.setAttribute(k, v === true ? "" : v);
  }
  node.append(...kinder.filter(Boolean));
  return node;
}

function zahlFeld(id, einheit, step, wert, max) {
  return el("span", { class: "zahl" },
    el("input", { type: "number", name: id, id, value: wert, min: 0, max, step, inputmode: "decimal" }),
    el("span", { class: "einheit", text: einheit }));
}

// Texte können vom Jahr abhängen: dann sind sie Funktionen der Parameter p.
const text = (t, p) => (typeof t === "function" ? t(p) : t);

function baueFeld(f, zustand, p) {
  const hinweis = f.hinweis && el("small", { "data-hinweis": f.id, text: text(f.hinweis, p) });
  if (f.typ === "check") {
    return el("div", { class: "feld check", "data-feld": f.id },
      el("label", {},
        el("input", { type: "checkbox", name: f.id, checked: zustand[f.id] }),
        el("span", { "data-label": f.id, text: text(f.label, p) })),
      hinweis);
  }
  if (f.typ === "auswahl") {
    const select = el("select", { name: f.id, id: f.id });
    for (const [wert, text] of f.optionen) {
      select.append(el("option", { value: wert, selected: zustand[f.id] === wert, text }));
    }
    return el("div", { class: "feld", "data-feld": f.id }, el("label", { for: f.id, text: f.label }), select);
  }
  const zeile = el("div", { class: "zeile" }, zahlFeld(f.id, f.einheit, f.step, zustand[f.id], f.max));
  if (f.preis) {
    const p = f.preis;
    zeile.append(el("span", { class: "zu", text: "zu" }), zahlFeld(p.id, p.einheit, p.step, zustand[p.id]));
  }
  return el("div", { class: f.preis ? "feld paar" : "feld", "data-feld": f.id },
    el("label", { for: f.id, "data-label": f.id, text: text(f.label, p) }), zeile, hinweis);
}

function baueJahrwahl(zustand) {
  const optionen = JAHRE.map((jahr) => el("label", {},
    el("input", { type: "radio", name: "jahr", value: jahr, checked: zustand.jahr === jahr }),
    el("span", { text: parameter(jahr).entwurf ? `${jahr}*` : String(jahr) })));
  return el("div", { class: "jahrwahl", role: "radiogroup", "aria-labelledby": "jahrwahl-titel" },
    el("span", { id: "jahrwahl-titel", text: "Steuerjahr" }),
    el("div", { class: "jahre" }, ...optionen));
}

function baueFormular(zustand) {
  const p = parameter(zustand.jahr);
  form.append(baueJahrwahl(zustand));
  ABSCHNITTE.forEach((a, i) => {
    const felder = el("div", { class: "felder" }, ...a.felder.map((f) => baueFeld(f, zustand, p)));
    form.append(el("details", { class: "abschnitt", open: a.offen, "data-abschnitt": i },
      el("summary", {}, el("span", { text: a.titel }), el("span", { class: "summe" })),
      felder));
  });
}

// --- Ergebnis ---

function gruppiere(posten, schluessel) {
  const zeilen = new Map();
  for (const p of posten) {
    const name = p[schluessel];
    if (!zeilen.has(name)) zeilen.set(name, { name, summe: 0, teile: {} });
    const z = zeilen.get(name);
    z.summe += p.betrag;
    z.teile[p.gruppe] = (z.teile[p.gruppe] || 0) + p.betrag;
  }
  return [...zeilen.values()].sort((a, b) => b.summe - a.summe);
}

function zeigeBalken(r) {
  const zeilen = gruppiere(r.posten, ansicht);
  const max = Math.max(1, ...zeilen.map((z) => z.summe));
  const liste = document.getElementById("balken");
  liste.replaceChildren(...zeilen.map((z) => {
    const spur = el("span", { class: "spur" });
    for (const g of Object.keys(GRUPPEN)) {
      if (!z.teile[g]) continue;
      spur.append(el("span", { class: `seg g-${g}`, style: `width:${(z.teile[g] / max) * 100}%` }));
    }
    let name = z.name;
    if (ansicht === "bereich" && r.ausgaben[z.name] > 0) {
      name += ` · ${prozent.format(z.summe / r.ausgaben[z.name])} der Ausgaben`;
    }
    return el("li", {},
      el("span", { class: "name", text: name }),
      el("span", { class: "wert", text: `${euro.format(z.summe)} €` }),
      spur);
  }));

  const aktiv = Object.keys(GRUPPEN).filter((g) => r.gruppen[g] > 0);
  document.getElementById("legende").replaceChildren(...aktiv.map((g) =>
    el("li", {}, el("span", { class: `punkt g-${g}` }),
      el("span", { text: `${GRUPPEN[g]}: ${euro.format(r.gruppen[g])} €` }))));
}

function zeigeBilanz(r) {
  const zeilen = [
    ["Bruttoeinkommen", r.einkommen - r.gruppen.arbeitgeber],
    ["Steuern auf Einkommen", -r.gruppen.einkommen],
    ["Sozialabgaben", -r.gruppen.sozial],
  ];
  if (r.kindergeld > 0) zeilen.push(["Kindergeld", r.kindergeld]);
  zeilen.push(["Netto", r.netto, "summe"]);
  zeilen.push(["Erfasste Ausgaben", -r.konsumausgaben]);
  zeilen.push(["Rest für Miete, Sparen und mehr", r.rest, "summe"]);

  const tabelle = document.getElementById("bilanz");
  tabelle.replaceChildren(...zeilen.map(([name, wert, klasse]) =>
    el("tr", { class: klasse },
      el("th", { scope: "row", text: name }),
      el("td", { text: `${euro.format(wert)} €` }))));

  const steuerAufAusgaben = r.gruppen.konsum + r.gruppen.abgabe;
  if (r.konsumausgaben > 0) {
    tabelle.append(el("caption", {
      text: `In den Ausgaben stecken ${euro.format(steuerAufAusgaben)} € Steuern und Abgaben `
        + `(${prozent.format(steuerAufAusgaben / r.konsumausgaben)}).`,
    }));
  }
}

function zeigeErgebnis(r) {
  document.getElementById("gesamt").textContent = `${euro.format(r.nachKindergeld)} €`;
  let sub = `${prozent.format(r.quote)} des Einkommens · ${euro.format(r.nachKindergeld / 12)} € pro Monat`;
  if (r.kindergeld > 0) sub += ` · nach ${euro.format(r.kindergeld)} € Kindergeld`;
  if (r.gruppen.arbeitgeber > 0) sub += " · Einkommen inklusive Arbeitgeberanteil";
  document.getElementById("quote").textContent = sub;

  const tage = document.getElementById("tage");
  if (r.quote > 0 && r.quote < 1) {
    const tag = new Date(r.jahr, 0, 1 + Math.round(r.quote * 365));
    tage.textContent = `Rechnerisch arbeiten Sie bis zum ${datum.format(tag)} nur für Steuern und Abgaben.`;
  } else {
    tage.textContent = r.quote >= 1 ? "Die Steuern und Abgaben sind höher als das Einkommen." : "";
  }

  zeigeBalken(r);
  zeigeBilanz(r);

  ABSCHNITTE.forEach((a, i) => {
    const posten = r.posten.filter((p) => (a.gruppen ? a.gruppen.includes(p.gruppe) : a.bereiche.includes(p.bereich)
      && p.gruppe !== "sozial" && p.gruppe !== "einkommen"));
    const summe = posten.reduce((s, p) => s + p.betrag, 0);
    form.querySelector(`[data-abschnitt="${i}"] .summe`).textContent = summe > 0 ? `${euro.format(summe)} €` : "";
  });

  document.getElementById("leiste").textContent =
    `Steuern und Abgaben: ${euro.format(r.nachKindergeld)} € · ${prozent.format(r.quote)}`;
}

// Texte im Formular und in den Hinweisen für das gewählte Jahr
function zeigeJahr(p) {
  for (const a of ABSCHNITTE) {
    for (const f of a.felder) {
      if (typeof f.label === "function") form.querySelector(`[data-label="${f.id}"]`).textContent = f.label(p);
      if (typeof f.hinweis === "function") form.querySelector(`[data-hinweis="${f.id}"]`).textContent = f.hinweis(p);
    }
  }
  document.getElementById("entwurf").hidden = !p.entwurf;
  document.getElementById("rechtsstand").textContent = p.entwurf
    ? `Rechtsstand ${p.jahr} nach den Gesetzentwürfen, Stand 27. Oktober 2026. Die Werte können sich noch ändern.`
    : `Rechtsstand ${p.jahr}.`;
  document.getElementById("abzug-pausch").textContent = tausend(p.werbungskostenPausch);
  document.getElementById("abzug-kfb").textContent = tausend(p.kinderFreibetrag);
  document.getElementById("gastro-satz").textContent = satz(p.ustGastroSpeisen);
}

// Bei einem Jahreswechsel folgen Felder mit der Vorgabe des alten Jahres der Vorgabe des neuen Jahres.
const JAHRESVORGABEN = ["kvZusatz", "co2Preis"];
let jahr;

function wechsleJahr(zustand) {
  if (jahr !== undefined && zustand.jahr !== jahr) {
    const alt = standard(jahr);
    const neu = standard(zustand.jahr);
    for (const key of JAHRESVORGABEN) {
      if (zustand[key] !== alt[key]) continue;
      zustand[key] = neu[key];
      form.elements[key].value = neu[key];
    }
  }
  if (zustand.jahr !== jahr) zeigeJahr(parameter(zustand.jahr));
  jahr = zustand.jahr;
}

function aktualisiere() {
  const zustand = liesFormular();
  wechsleJahr(zustand);
  for (const a of ABSCHNITTE) {
    for (const f of a.felder) {
      if (!f.wenn) continue;
      form.querySelector(`[data-feld="${f.id}"]`).hidden = !f.wenn(zustand);
    }
  }
  speichereZustand(zustand);
  zeigeErgebnis(berechne(zustand));
}

baueFormular(ladeZustand());
form.addEventListener("input", aktualisiere);
form.addEventListener("change", aktualisiere);

document.querySelectorAll(".tabs button").forEach((b) => {
  b.addEventListener("click", () => {
    ansicht = b.dataset.ansicht;
    document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    aktualisiere();
  });
});

// Auf schmalen Bildschirmen zeigt eine Leiste die Summe, solange das Ergebnis nicht sichtbar ist.
const leiste = document.getElementById("leiste");
new IntersectionObserver(([eintrag]) => {
  leiste.classList.toggle("sichtbar", !eintrag.isIntersecting);
}).observe(document.querySelector(".kpi"));
leiste.addEventListener("click", () => document.getElementById("ergebnis").scrollIntoView({ behavior: "smooth" }));

aktualisiere();
