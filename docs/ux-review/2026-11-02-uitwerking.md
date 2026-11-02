# Uitwerking van het advies — 2 november 2026

Deze wijziging werkt het advies uit op basis van Martijns aanvullende antwoorden. Het oorspronkelijke rapport blijft als momentopname bewaard.

## Bevestigd door Martijn

- Het aanbod is het maken van prototypes voor websites en portalen, het proberen van minder handmatig werk en een eerste stap naar AI als vast onderdeel van de onderneming.
- Vanaf € 500 exclusief btw: een prototype van één afgebakend onderdeel. Binnen twee weken na akkoord een eerste versie en één ronde aanpassen inbegrepen.
- Hosting, beheer en verdere uitwerking voor dagelijks gebruik vallen buiten de prototypeprijs. Martijn verduidelijkte later dat hij soms ook verder kan helpen, afhankelijk van de techniek en de afspraken met ontwikkelaars. Wie wat oppakt en de bijbehorende kosten worden apart afgesproken.
- Een gesprek kan online of bij de ondernemer op de zaak, in heel Nederland.
- Mate en Zuipwijs blijven ingeklapt op Over. Extern klantbewijs volgt later.
- De antwoorden uit de chat worden herschreven in gewone taal, niet letterlijk overgenomen.

## Uitgewerkt per bevinding

| # | Uitwerking |
|---|---|
| 72 | Aanbod als werkend voorbeeld uitgelegd in de eerste tekst; rustige link naar wat je krijgt. |
| 73 | Korte herkenbare labels; oorspronkelijke knelpunten blijven als mailonderwerp behouden. Antwoorden beschrijven voortaan voorbeelden, geen complete productieoplevering. |
| 74 | Eigen werk eerder in beeld en concreter verteld. Een externe opdracht is nog niet beschikbaar; geen klantbewijs verzonnen. |
| 75 | Mailactie en kopieerbaar adres vóór optionele hulpkeuzes; expliciete beginfocus op de mailactie. |
| 76 | Persoonlijke proeven uit Werk gehaald en in een gesloten uitklapdeel op Over gezet. |
| 77 | Vanafprijs, termijn, inbegrepen aanpassen en grenzen van het aanbod op Begin. |
| 78 | Eerste versie onderscheiden van dagelijks gebruik. Start termijn en inbegrepen aanpassing door Martijn bevestigd. De lus is een uitleg van kijken en bijsturen, geen onbeperkte aanpasbelofte. |
| 79 | Over teruggebracht tot relevante achtergrond, ervaring en persoonlijke samenwerking. De grote mailzin is kleiner gezet. |
| 80 | Film opent met de mail die tijd scheelt. De zichtbare knop verklaart ook op telefoon dat het beeld een voorbeeld opent. De uitkomst staat ook buiten de film in tekst. |
| 81 | Rekenhulp vrijwillig uitklapbaar, alle aannames zichtbaar en uitkomst aangeduid als rekenvoorbeeld. Beide invoeren gebruiken hetzelfde bereik. |
| 82 | Martijn werkt de vraag uit; AI helpt bij het maken. In het eigen voorbeeld leest Martijn het antwoord na en stuurt bij. |
| 83 | Eerste scherm compacter en concreet werk vóór de herkenningskiezer. Aanpak zonder grote lege tussenruimte en zonder doorstreepoefening. |
| 84 | Aanpak heet ‘Zo werken we samen’. De vragen komen vóór de verdere uitleg van de werkwijze en overtuiging. Deelbeeld en beschrijving aangepast. |
| 85 | Uitvoering gestart op `main` bij de geslaagde livepublicatie `6fd42aa`. Alle wijzigingen staan op een aparte branch. |

## In het externe design system vast te leggen

De Artifact-bron vereist aanmelden en er is in deze sessie geen lees- of schrijfkoppeling voor. De website-uitwerking is daarom vastgelegd in BRAND_GUIDE en deze PR. Nog over te nemen in de externe bron:

1. Positionering en voorbeelden: het onderscheid tussen een prototype en een beheerd product; heldere uitleg van het aanbod.
2. ContactCard: mailactie en adres eerst, voorbeelden optioneel, beginfocus op de mailactie.
3. KnelpuntKiezer: korte labels voor de website naast de oorspronkelijke positioneringszinnen.
4. Persoonlijke experimenten: vrijwillige verdieping op Over.

Kleur, lettertypen, logo, focusstijl, capsule, leeslijn en de bewegende stip blijven behouden. De gloed en puls gebruiken de bestaande merkcurve; het commentaar bij display is gelijkgetrokken met de lokale regel.

## Nog geen afgerond onderzoek

- Een echte externe opdracht of klantreactie ontbreekt nog, zoals Martijn heeft aangegeven.
- De vijf gebruikerstests uit het advies moeten nog worden uitgevoerd. Een technische controle bewijst niet dat de doelgroep het aanbod begrijpt.
- De juridische en feitelijke beloften op Privacy zijn niet opnieuw getoetst en niet veranderd.

## Publicatie

De bestaande Azure-workflow reageert op een pull request naar `main`. Hij controleert typen en tests, bouwt de routes en publiceert een tijdelijke preview. Mergen naar `main` start vervolgens de livepublicatie. Deze PR wordt niet automatisch gemerged.

## Controle van de uitwerking

- Typecontrole en productiebuild geslaagd. 139 tests geslaagd, drie bestaande tests overgeslagen.
- Alle vijf pagina's en de 404 op 375×812 en 1440×900, in licht en donker geopend en volledig doorgescrold. Eén h1 per pagina en geen horizontale overloop in deze 24 combinaties.
- Op telefoon is de volledige mailactie in beeld bij openen. Beginfocus, Tab naar kopiëren, kopieerbevestiging, optionele keuze met correct mailonderwerp en Escape met focusherstel gecontroleerd. Er is geen mail verstuurd.
- Persoonlijke proeven op Over opengeklapt en zonder horizontale overloop gecontroleerd.
- De bestaande regels voor verminderde beweging zijn in de bron behouden; geen volledige schermlezer- of toegankelijkheidsaudit uitgevoerd.
- Controlebeelden: [Aanpak op telefoon](beelden-2026-11-02/aanpak-telefoon.jpg) en [contact op telefoon](beelden-2026-11-02/contact-telefoon.jpg).
