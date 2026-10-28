# Berechnungsmethoden

Status: Notizen, begonnen am 2026-10-28.

Diese Datei sammelt die Hintergründe zu den Berechnungsmethoden der App. Sie erklärt, welche Annahmen hinter
den Zahlen stehen und an welchen Stellen eine Annahme keine objektive Tatsache ist, sondern eine Frage der
Philosophie.


## Wer zahlt wirklich Steuern?

Wer was wirklich zahlt, ist nicht immer eine objektive Frage. Die Buchhaltung des Staates zeigt nur, wer eine
Steuer formal abführt. Sie zeigt nicht, aus welcher Quelle das Geld letztlich kommt und ob die Person dafür
ein Opfer bringen musste, zum Beispiel einen Arbeitsaufwand für Kunden, die freiwillig zahlen.

Für die App unterscheiden wir deshalb zwei Begriffe:

- **Formale Steuerzahlung**: der Betrag, den eine Person laut Steuerbescheid, Lohnabrechnung oder
  Kassenbon an den Staat abführt.
- **Echte Steuerzahlung**: der Teil davon, der aus Einkommen kommt, das am Markt freiwillig bezahlt wird, und
  nicht selbst aus Steuern oder Pflichtbeiträgen finanziert ist.


### Eindeutige Fälle

#### Angestellter Bäcker

Es ist eine objektive Tatsache, dass ein alleinstehender angestellter Bäcker Steuern zahlt und nicht von
Steuern lebt. Diesen Beruf gibt es seit Tausenden von Jahren, völlig unabhängig von staatlicher Struktur. In
seiner Arbeit ist er komplett von der Bereitschaft seiner Kunden abhängig, freiwillig bei ihm Brot und
Backwaren zu kaufen.

Formale und echte Steuerzahlung sind hier gleich.

#### Sozialhilfeempfänger

Es ist eine objektive Tatsache, dass ein nicht arbeitender Sozialhilfeempfänger komplett von Steuern lebt und
nicht in irgendeinem echten Sinne Steuern zahlt.

- Diese Feststellung ist völlig unabhängig davon, ob man die Bezüge aus den Sozialkassen als berechtigt
  ansieht oder nicht. Man kann eine Person als wirklich hilfsbedürftig erachten und die Zahlungen an sie als
  Frage der Menschenwürde ansehen, ohne sich über die Tatsache zu täuschen, dass diese Person von der
  arbeitenden Bevölkerung abhängig ist.
- Beim Einkauf wird ihm die Mehrwertsteuer berechnet. Das Geld dafür kommt aber nicht letztlich aus seiner
  privaten Kasse, sondern über den Umweg seiner privaten Kasse aus dem Sozialhaushalt des Staates. Das ist
  keine Steuerzahlung in dem Sinne, dass er ein Opfer bringen musste, wie etwa einen Arbeitsaufwand, um die
  Zahlung der Steuer zu ermöglichen. Es ist ein Umstand der Buchhaltung.
- Mit beliebig hohem Aufwand für die Buchhaltung könnte man für Sozialhilfeempfänger an der Kasse eine
  Ausnahme von der Mehrwertsteuer machen und gleichzeitig weniger Sozialhilfe auszahlen. Der Staat würde auf
  der einen Seite weniger auszahlen und auf der anderen Seite weniger einnehmen. Die Zahlung ist also eine
  Fiktion der Buchhaltung, die die Bürokratie vereinfacht, und kein realwirtschaftlicher Vorgang.

Die formale Steuerzahlung ist größer als null, die echte Steuerzahlung ist null. Der Nettobeitrag ist
negativ: die Bezüge abzüglich der formal gezahlten Steuern.


### Weniger eindeutige Fälle: Beamte und öffentlicher Dienst

Bei Beamten und Angestellten im öffentlichen Dienst ist die Antwort weniger eindeutig. Formal zahlen sie
Lohnsteuer. Ihr Gehalt kommt aber aus Steuern
(siehe [berufsgruppen-finanzierung.md](berufsgruppen-finanzierung.md)). Für die Lohnsteuer gilt deshalb
dasselbe Argument wie für die Mehrwertsteuer des Sozialhilfeempfängers: der
Staat zahlt ein Bruttogehalt aus und nimmt einen Teil davon sofort wieder ein. Der Staat könnte ebenso ein
niedrigeres, steuerfreies Gehalt zahlen.

Ob ein Beamter in einem echten Sinne Steuern zahlt, hängt deshalb davon ab, ob seine Arbeit einen Wert
schafft, den die Bürger auch freiwillig bezahlen würden. Diese Frage beantwortet jeder nach der eigenen
Ansicht über die Aufgaben des Staates. Die folgenden Beispiele zeigen die Bandbreite der Ansichten.

#### Beispiel Polizei

- Wer der Ansicht ist, dass ein Polizist einer sinnvollen Tätigkeit nachgeht, wenn er Räuber, Betrüger und
  Gewalttäter verfolgt, die es in jeder Gesellschaft gibt, kann sagen: diese Leistung würden die Bürger auch
  freiwillig bezahlen, zum Beispiel über private Sicherheitsdienste. Der Polizist erbringt dann einen echten
  Gegenwert und zahlt in diesem Sinne Steuern, ähnlich wie der Bäcker.
- Wer hingegen der Ansicht ist, dass ein Polizist vor allem opferlose Verbrechen verfolgt, wie zum Beispiel
  die Verhaftung von Konsumenten von Rauschmitteln, die der Staat als illegal erklärt, kann sagen: für diese
  Tätigkeit gibt es keine freiwillige Nachfrage. Der Polizist lebt dann in diesem Teil seiner Arbeit von
  Steuern.

In der Praxis liegt die Bewertung meist zwischen diesen Extremen, je nach Anteil der Tätigkeiten.

#### Beispiel Lehrer

Man kann über Lehrer zum Beispiel der Ansicht sein, dass sie:

1. einen wertvollen Beitrag zur Bildung von Kindern leisten, den Eltern auch freiwillig nachfragen würden.
   Dann zahlen sie Steuern.
2. durch Zertifizierung zu einem Signal über den Bildungsstand von Kindern beitragen, das vor allem beim
   Berufseinstieg einen Wert für Jugendliche hat. Dann zahlen sie für diesen Teil ihrer Arbeit Steuern.
3. weniger zur Bildung von Kindern beitragen (die anderweitig viel günstiger und effektiver möglich wäre),
   sondern primär die Kinder beaufsichtigen, damit die Eltern einer Berufstätigkeit nachgehen können. Auch
   für Betreuung gibt es eine freiwillige Nachfrage, aber zu einem niedrigeren Preis als für Bildung. Dann
   zahlen sie nur zu einem Teil Steuern.
4. dazu beitragen, eine niedrig bezahlte Konkurrenz vom Arbeitsmarkt fernzuhalten und so die Löhne für besser
   ausgebildete Personen künstlich hoch zu halten. Für diesen Effekt gibt es keine freiwillige Nachfrage der
   Bürger insgesamt. Dann zahlen sie keine Steuern.
5. im Wesentlichen die Wärter eines offenen Vollzugs für Kinder sind, der primär dem staatlichen Ziel dient,
   die Bevölkerung zur Knechtschaft abzurichten, und den es in einer freien Gesellschaft so niemals geben
   würde. Dann zahlen sie keine Steuern.


### Folgerung für die App

Die App kann diese Frage nicht objektiv entscheiden. Sie soll deshalb die Annahme sichtbar machen und dem
Benutzer die Wahl lassen. Ein möglicher Ansatz (Vorschlag, noch nicht entschieden):

- Jede Berufsgruppe bekommt einen **Marktwertanteil** `f` zwischen 0 und 1. Er gibt an, welcher Anteil der
  Arbeit auch ohne Zwang freiwillig bezahlt würde. Für privat finanzierte Berufe ist `f = 1`, für
  Transferempfänger ohne Arbeit ist `f = 0`. Für öffentlich und semi-öffentlich finanzierte Berufe wählt der
  Benutzer einen Wert oder eine der Ansichten oben.
- Mit dem Bruttoeinkommen `B` aus öffentlichen Mitteln und der formalen Steuerzahlung `T` ergibt sich der
  echte Nettobeitrag:

  ```text
  Nettobeitrag = f * T - (1 - f) * (B - T)
  ```

  Bei `f = 1` entspricht der Nettobeitrag der formalen Steuerzahlung (wie beim Bäcker). Bei `f = 0` ist der
  Nettobeitrag das negative Nettoeinkommen (wie beim Sozialhilfeempfänger).


### Offene Fragen

- Welche Standardwerte für `f` zeigt die App, bevor der Benutzer eine Ansicht wählt?
- Wie behandelt die App Personen mit privatem Einkommen, deren Kunden selbst aus öffentlichen Mitteln
  bezahlt werden (zum Beispiel ein Bäcker, der an Beamte verkauft, oder ein Zulieferer der Bundeswehr)?
- Wie behandelt die App Renten und Pensionen, die auf früheren Beiträgen oder früherer Dienstzeit beruhen?
