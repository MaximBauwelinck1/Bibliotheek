# Dossier

- Student: Maxim Bauwelinck
- Studentennummer: 302041mb
- E-mailadres: <mailto:voornaam.naam@student.hogent.be>
- Demo: https://hogent.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=a0320b40-5c0c-4115-91b6-b249011b011a
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

deze gebruiker heeft als rol admin (heeft toegang tot dashboard)
- e-mailadres: jane.smith@example.com
- Wachtwoord: admin1

### Online

deze gebruiker heeft als rol user
- e-mailadres: john.doe@example.com
- Wachtwoord: gebruiker1

deze gebruiker heeft als rol admin (heeft toegang tot dashboard)
- e-mailadres: jane.smith@example.com
- Wachtwoord: admin1

Je kan zelf ook een acount aanmaken met een bestaand e-mailadres om gebruik te maken van nodemailer. (Bevestiging mail bij reserveren boek, mail voor wachtwoord te resetten)


## Projectbeschrijving

De applicatie is bedoelt voor een bibliotheek of andere instelling met veel boeken. Je kan hiermee als eerste gewoon de stock beheren van boeken(admin kant).
Daarnaast kan dit ook gebruikt om reservaties te maken en beheren van deze boeken. Een gebruiker kan de boeken browsen en boeken reserveren. 
![alt text](/docs/img/image-211.png)

## Screenshots

## verloop user
![alt text](/docs/img/image-112.png)
![alt text](/docs/img/image.png)
![alt text](/docs/img/image-1.png)
![alt text](/docs/img/image-2.png)
![alt text](/docs/img/image-3.png)

## verloop admin
![alt text](/docs/img/image-4.png)
![alt text](/docs/img/image-5.png)
![alt text](/docs/img/image-6.png)
![alt text](/docs/img/image-111.png)
![alt text](/docs/img/image-113.png)
## API calls

Alle documentatie is gemaakt met swagger, Je kan alle informatie daar vinden.
Zorg er zeker eerst voor dat de backend draait alvorens deze link proberen te bezoeken.

``http://localhost:9000/swagger``

## Behaalde minimumvereisten

### Front-end Web Development

#### Componenten

- [x] heeft meerdere componenten - dom & slim (naast login/register)
- [x] applicatie is voldoende complex
- [x] definieert constanten (variabelen, functies en componenten) buiten de component
- [x] minstens één form met meerdere velden met validatie (naast login/register)
- [x] login systeem

#### Routing

- [x] heeft minstens 2 pagina's (naast login/register)
- [x] routes worden afgeschermd met authenticatie en autorisatie

#### State management

- [x] meerdere API calls (naast login/register)
- [x] degelijke foutmeldingen indien API-call faalt
- [x] gebruikt useState enkel voor lokale state
- [x] gebruikt gepast state management voor globale state - indien van toepassing

#### Hooks

- [x] gebruikt de hooks op de juiste manier

#### Algemeen

- [x] een aantal niet-triviale én werkende e2e testen
- [x] minstens één extra technologie
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de applicatie draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

### Web Services

#### Datalaag

- [x] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [x] heeft migraties - indien van toepassing
- [x] heeft seeds

#### Repositorylaag

- [ ] definieert één repository per entiteit - indien van toepassing
- [ ] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [ ] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [x] bevat alle domeinlogica
- [x] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [x] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [x] meerdere routes met invoervalidatie
- [x] meerdere entiteiten met alle CRUD-operaties
- [x] degelijke foutboodschappen
- [x] volgt de conventies van een RESTful API
- [x] bevat geen domeinlogica
- [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [x] er is een minimum aan logging en configuratie voorzien
- [x] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] minstens één extra technologie die we niet gezien hebben in de les
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de API draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

## Projectstructuur

### Front-end Web Development

Ik heb een normale mappen structuur met in mijn ``src`` folder een ``pages``,``components``,``contexts`` en ``api`` folders met nog een paar extra voor css en foto's. In mijn ``main.jsx`` heb ik bij een route altijd verwezen naar een element uit de ``pages`` folder en niet rechtstreeks naar een component. Omdat ik deze bv meerdere keren zou nodig moeten hebben en zo duplicate code kan vermijden. De ``components`` folder bevat veel herbuikbare UI elementen. Dit is volgens het component-based architecture model zodat de applicatie consistent is. Ik heb twee keer gebruik gemaakt van contexts voor gedeelte state(theme en Auth). Daarnaast heb ik ook veel useState gebruikt voor kleine componenten om bv te filteren. 

### Web Services


Ik heb een normale mappen structuur met in mijn ``src`` folder een ``core``,``data``,``rest``,``service`` en ``types`` folders met nog een extra folder voor mijn utils. In zowel de ``rest`` als ``service`` laag zijn de entiteiten van elkaar afgezonderd. De ``core`` folder bevat veel helper functies die over heel de applicatie gebruikt worden. Ik maak ook gebruik van het middleware pattern, bij een endpoint word er eerst gecontroleerd of de user de juiste permissies heeft dan de request te valideren etc alvorens de endpoint uit te voeren.
## Extra technologie

### Front-end Web Development

#### Chartjs

https://www.chartjs.org/

https://www.npmjs.com/package/chart.js?activeTab=readme

Deze zijn alleen zichtbaar in het dashboard dat enkel toegangkelijk is voor admins. Deze tonen het aantal reservaties de afgelopen week per dag. De andere geeft een overzicht van alle boeken die al gereserveerd zijn geweest en hoe vaak.
![alt text](/docs/img/image-111.png)

#### wachtwoord sterkte indicator

Daarnaast heb ik nog een kleine extra toegevoegd, deze toont hoe sterk het wachtwoord is op basis van lengte, uppercase,lowercase, tekens en getallen. Deze is zichtbaar bij het registreren, wachtwoord veranderen pagina en wachtwoord reset pagina
### Web Services

#### nodemailer

https://www.nodemailer.com/

https://www.npmjs.com/package/nodemailer

Users kunnen hun wachtwoord resetten door op wachtwoord vergeten te klikken en hun e-mailadres in te vullen. Zo kunnen ze in hun email op de link klikken om het wachtwoord te veranderen. Daarnaast krijgen gebruikers ook een bevestiging als ze een boek reserveren met de belangerijkste data opgelijst.

![alt text](/docs/img/image-117.png)
![alt text](/docs/img/image-118.png)

#### swagger 

https://swagger.io/


## Gekende bugs

### Front-end Web Development

De theme toggle werkt niet op elke pagina of maakt het soms slechter door het contrast aan te passen op een slechte manier.

### Web Services

Er zijn geen bugs naar mijn weten.

## Reflectie


Ik vond dit een zeer leerrijk project. Ik heb er zelf veel tijd ingestoken om sommige aspecten volledig na te maken zoals ik ze in mijn gedachten had waardoor ik soms veel tijd verloor.
Ik snap nu de basis van een restful api maken alsook apps maken met React. Ik vond het project over het algemeen zeer fijn en leuk om aan te werken. Ik zou in het begin meer tijd gestoken moeten hebben in mijn react components zo klein mogelijk te houden waardoor ik dubbelde code kon vermijden. Wat nu niet altijd het geval is in mijn project en nu is het teveel om volledig te refactoren. Het Irritantste in dit project vond ik de seed data maken. Omdat ik veel boeken moest hebben voordat mijn applicatie bruikbaar werd.


Ik vond de cursus over het algemeen zeer goed en makkelijk te volgen. Wat ik zeker goed vond is dat alle code grondig werd uitgelegd zodat je wist wat je aan het kopiëren was.
