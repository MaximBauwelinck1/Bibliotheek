# Examenopdracht Front-end Web Development & Web Services

- Student: Maxim Bauwelinck
- Studentennummer: 302041mb
- E-mailadres: <mailto:maxim.bauwelinck@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [Postgresql](https://www.postgresql.org/download/)

Stel dan een wachtwoord in voor de default gebruiker ``postgres`` en noteer deze.

### optioneel

een gratis database GUI om de databank te bekijken
- [pgadmin](https://www.pgadmin.org/download/)
- [Datagrip](https://www.jetbrains.com/datagrip/download/#section=windows) (gratis voor github pro acounts)

## Front-end

## Opstarten 
Al deze commands hebben betrekking tot de front-end en moeten dus in deze folder worden uitegevoerd

``{home}\frontendweb-2425-MaximBauwelinck1\frontend\bibliotheek``

Dit project maakt gebruik van Yarn v2.Dus als eerste moeten we corepack inschakelen.

- open een terminal als administrator en voer volgend commando uit.
```bash
corepack enable
```
- open dan een terminal in de root van het project en voer volgend commando uit. Antwoord met Y
```bash
yarn set version berry
```
- open een terminal en voer nu het volgende commando uit om alle dependencies te installeren.
```bash
yarn install
```
- maak een ``.env`` file aan in de root van het project met volgende inhoud
```
VITE_API_URL='http://localhost:9000/api'
```
- en dan tot slot om de applicatie te starten voer je het volgende commando uit.
```bash
yarn dev
```

## Testen

Voor de testen te kunnen uitvoeren moeten zowel de backend als de front end werken.
open twee terminals en volg de stappen opstarten in zowel de back als frontend

open dan een 3de terminal en voer het volgende commande uit in de directory van de front end
```bash
yarn test
```
selecteer dan E2E testing en vervolgens een browser naar keuze.
klik daarna op een test om deze uit te voeren.
## Back-end

## Opstarten 

Al deze commands hebben betrekking tot de back-end en moeten dus in deze folder worden uitegevoerd

``{home}\frontendweb-2425-MaximBauwelinck1\backend``
- voer in een terminal het volgende commando uit om de laatste versie van yarn te gebruiken.
```bash
yarn set version berry
```
- het volgende commando zal alle dependencies installeren.
```bash
yarn install
```
## .env
- maak vervolgens een ``.env`` bestand aan in de root van het project met de volgende inhoud.
Als je je eigen gmail wilt gebruiken pas dan de EMAIL_USER aan en maak een [app password](https://myaccount.google.com/apppasswords?rapt=AEjHL4PseaCWdtEz9MXbV6GxHCzKCuk49Nd9c-kUwbv9d7kcDXUiZkwm1IdLGUqPsGtBW0mOibHtCd6mdmewjUi7hIH5zJ9jtlyN_YmbStEz4HmIJujBcpY) aan.
Pas dan EMAIL_PASSWORD aan met het app password dat je zonet gemaakt hebt.
```
NODE_ENV=development
DATABASE_URL="postgres://<username>:<password>@localhost:5432/bibliotheek"
AANTAL_KOPIEEN_P_BOEK=5
EMAIL_USER="maximbauwelinck@gmail.com"
EMAIL_PASSWORD="bwci wedh tnaj ftef"
```
- en maak een ``.env.test`` bestand aan in de root van het project met de volgende inhoud.
```
NODE_ENV=testing
DATABASE_URL="postgres://<username>:<password>@localhost:5432/bibliotheek_test"
AANTAL_KOPIEEN_P_BOEK=5
EMAIL_USER="maximbauwelinck@gmail.com"
EMAIL_PASSWORD="bwci wedh tnaj ftef"
```

## Development
1) Als je het project lokaal wilt opzetten voor development purposes voer je het volgende commando uit om de databank op te zetten met de nodige migrations en ook eveneens de seed data te importeren.
```bash
yarn prisma migrate dev
```
## production
1) Als je het project wilt opzetten voor production voer je het volgende commando uit om alleen de databank op te zetten met de nodige migrations.
```bash
yarn prisma migrate deploy
```
2) hierna importeer je de seed data met
```bash
yarn prisma db seed
```

- om de server te starten tot slot gebruik je het volgende commando
```bash
yarn start:dev
```

## Testen

- voor het opzetten van de test databank voer je het volgende commando uit.
```bash
yarn migrate:test
```
- om de testen uit te voeren gerbuik je volgend commando.
```bash
yarn test
```
- om de coverage van de testen te bekijken voer je volgend commando uit
```bash
yarn test:coverage
```
- om het rapport te kunnen bekijken open je het bestand ``backend/coverage/lcov-report/index.html`` in je browser.
