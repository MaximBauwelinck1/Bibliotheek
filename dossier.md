# Dossier

> Duid aan welke vakken je volgt en vermeld voor deze vakken de link naar jouw GitHub repository. In het geval je slechts één vak volgt, verwijder alle inhoud omtrent het andere vak uit dit document.
> Lees <https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet> om te weten hoe een Markdown-bestand opgemaakt moet worden.
> Verwijder alle instructies (lijnen die starten met >).

- Student: Maxim Bauwelinck
- Studentennummer: 302041mb
- E-mailadres: <mailto:voornaam.naam@student.hogent.be>
- Demo: <DEMO_LINK_HIER>
- GitHub-repository: https://github.com/HOGENT-frontendweb/frontendweb-2425-MaximBauwelinck1
- Front-end Web Development
  - Online versie: https://frontendweb-2425-maximbauwelinck1-1.onrender.com
- Web Services:
  - Online versie: https://frontendweb-2425-maximbauwelinck1.onrender.com

## Logingegevens

### Lokaal

deze gebruiker heeft als rol user
- e-mailadres: john.doe@example.com
- Wachtwoord: gebruiker1

deze gebruiker heeft als rol admin
- e-mailadres: jane.smith@example.com
- Wachtwoord: admin1

### Online

deze gebruiker heeft als rol user
- e-mailadres: john.doe@example.com
- Wachtwoord: gebruiker1

deze gebruiker heeft als rol admin
- e-mailadres: jane.smith@example.com
- Wachtwoord: admin1


## Projectbeschrijving

> Omschrijf hier duidelijk waarover jouw project gaat. Voeg een domeinmodel (of EERD) toe om jouw entiteiten te verduidelijken.

De applicatie is bedoelt voor een bibliotheek of andere instelling met veel boeken. Je kan hiermee als eerste gewoon de stock beheren van boeken(admin kant).
Daarnaast kan dit ook gebruikt om reservaties te beheren en plannen van deze boeken. Een gebruiker kan de boeken browsen en boeken reserveren. 

## Screenshots

## verloop user
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

## verloop admin
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)

## API calls

> Maak hier een oplijsting van alle API cals in jouw applicatie. Groepeer dit per entiteit. Hieronder een voorbeeld.
> Dit is weinig zinvol indien je enkel Front-end Web Development volgt, verwijder dan deze sectie.
> Indien je als extra Swagger koos, dan voeg je hier een link toe naar jouw online documentatie. Swagger geeft nl. exact (en nog veel meer) wat je hieronder moet schrijven.

### Gebruikers

- `POST /api/gebruikers/passwordForgot`     : om een email te sturen naar de gebruiker voor zijn/haar wachtwoord te resetten(indien email bestaat)
- `POST /api/gebruikers/passwordReset`      : de effectieve request om het wachtwoord te veranderen. Werkt alleen met een geldige token
- `GET /api/gebruikers/:id/reservaties`     : om alle reservaties te krijgen van een bepaalde gebruiker
- `GET /api/gebruikers`                     : alle gebruikers ophalen
- `GET /api/gebruikers/:id`                 : gebruiker met een bepaald id ophalen
- `POST /api/gebruikers`                    : om een nieuwe gebruiker te registreren
- `DEL /api/gebruikers/:id`                 : om een gebruiker te soft deleten
- `PUT /api/gebruikers/:id`                 : om een gebruiker te updaten

### Boeken

- `DEL /api/boeken/:id/beschikbaarkopie`       : delete een beschikbare kopie van een boek
- `GET /api/boeken/kopieen`                          : geeft alle kopieen van alle boeken
- `GET /api/boeken/:id/kopieen`                      : geeft alle kopieen terug van een boek
- `GET api/boeken/:boekId/kopieen/:boekKopieId`      : geeft 1 exemplaar terug dat tot het boek behoort en de juist kopieId heeft
- `GET /api/boeken`                                  : geeft alle boeken terug
- `POST /api/boeken`                                 : om een nieuw boek aan te maken
- `GET /api/boeken/:id`                              : geeft een boek terug met dezelfde id
- `DEL /api/boeken/:id`                              : soft delete een boek
- `PUT /api/boeken/:id`                              : update een boek met id

### Health

- `GET /api/health/ping`                             : geeft pong terug
- `GET /api/health/details`                          : geeft informatie over de server terug

### Kopieen

- `GET /api/kopieen`                                 : geef alle kopieen terug 
- `POST /api/kopieen`                                : maak een nieuw exemplaar aan
- `GET /api/kopieen/:id`                             : geeft een specifiek exemplaar terug
- `DEL api/kopieen/:id`                              : soft delete een exemplaar
- `PUT /api/kopieen/:id`                             : update een kopie met id

### Reservaties

- `GET /api/reservaties`                                 : geef alle reservaties terug 
- `POST /api/reservaties`                                : maak een nieuwe reservatie aan
- `GET /api/reservaties/:id`                             : geeft een specifieke reservatie terug
- `DEL api/reservaties/:id`                              : zet een reservatie op niet-actief en maak het exemplaar terug vrij
- `PUT /api/reservaties/:id`                             : update een reservatie met id

### sessions

- `POST /api/sessions`                                : geeft een jwt token terug als de user de juist credentials meegeeft

## Behaalde minimumvereisten

> Duid per vak aan welke minimumvereisten je denkt behaald te hebben

### Front-end Web Development

#### Componenten

- [ ] heeft meerdere componenten - dom & slim (naast login/register)
- [ ] applicatie is voldoende complex
- [ ] definieert constanten (variabelen, functies en componenten) buiten de component
- [ ] minstens één form met meerdere velden met validatie (naast login/register)
- [ ] login systeem

#### Routing

- [ ] heeft minstens 2 pagina's (naast login/register)
- [ ] routes worden afgeschermd met authenticatie en autorisatie

#### State management

- [ ] meerdere API calls (naast login/register)
- [ ] degelijke foutmeldingen indien API-call faalt
- [ ] gebruikt useState enkel voor lokale state
- [ ] gebruikt gepast state management voor globale state - indien van toepassing

#### Hooks

- [ ] gebruikt de hooks op de juiste manier

#### Algemeen

- [ ] een aantal niet-triviale én werkende e2e testen
- [ ] minstens één extra technologie
- [ ] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [ ] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [ ] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [ ] de applicatie draait online
- [ ] duidelijke en volledige README.md
- [ ] er werden voldoende (kleine) commits gemaakt
- [ ] volledig en tijdig ingediend dossier

### Web Services

#### Datalaag

- [ ] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [ ] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [ ] heeft migraties - indien van toepassing
- [ ] heeft seeds

#### Repositorylaag

- [ ] definieert één repository per entiteit - indien van toepassing
- [ ] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [ ] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [ ] bevat alle domeinlogica
- [ ] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [ ] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [ ] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [ ] meerdere routes met invoervalidatie
- [ ] meerdere entiteiten met alle CRUD-operaties
- [ ] degelijke foutboodschappen
- [ ] volgt de conventies van een RESTful API
- [ ] bevat geen domeinlogica
- [ ] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [ ] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [ ] er is een minimum aan logging en configuratie voorzien
- [ ] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [ ] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [ ] minstens één extra technologie die we niet gezien hebben in de les
- [ ] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [ ] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [ ] de API draait online
- [ ] duidelijke en volledige README.md
- [ ] er werden voldoende (kleine) commits gemaakt
- [ ] volledig en tijdig ingediend dossier

## Projectstructuur

### Front-end Web Development

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns, hiërarchie van componenten, state...)?

### Web Services

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns...)?

## Extra technologie

### Front-end Web Development

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

### Web Services

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

## Gekende bugs

### Front-end Web Development

> Zijn er gekende bugs?

### Web Services

> Zijn er gekende bugs?

## Reflectie

> Wat vond je van dit project? Wat heb je geleerd? Wat zou je anders doen? Wat vond je goed? Wat vond je minder goed?
> Wat zou je aanpassen aan de cursus? Wat zou je behouden? Wat zou je toevoegen?
