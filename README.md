# Examenopdracht Front-end Web Development & Web Services

> Schrap hierboven eventueel wat niet past

- Student: Maxim Bauwelinck
- Studentennummer: 302041mb
- E-mailadres: <mailto:maxim.bauwelinck@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

> Vul eventueel aan

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
- en dan tot slot om de applicatie te starten voer je het volgende commando uit.
```bash
yarn dev
```








> Schrijf hier hoe we de applicatie starten (.env bestanden aanmaken, commando's om uit te voeren...)

## Testen

> Schrijf hier hoe we de testen uitvoeren (.env bestanden aanmaken, commando's om uit te voeren...)

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
## postgres
- maak vervolgens een ``.env`` bestand aan in de root van het project met de volgende inhoud.
```
NODE_ENV=production
DATABASE_URL="postgres://postgres:root@localhost:5432/bibliotheek"
```
- en maak een ``.env.test`` bestand aan in de root van het project met de volgende inhoud.
```
NODE_ENV=production
DATABASE_URL="postgres://postgres:root@localhost:5432/bibliotheek_test"
```
## mysql
- maak vervolgens een ``.env`` bestand aan in de root van het project met de volgende inhoud.
```
NODE_ENV=production
DATABASE_URL="mysql://root:root@localhost:3306/bibliotheek"
```
- en maak een ``.env.test`` bestand aan in de root van het project met de volgende inhoud.
```
NODE_ENV=production
DATABASE_URL="mysql://root:root@localhost:3306/bibliotheek"
```
## Development
1) Als je het project wilt opzetten voor development purposes voer je het volgende commando uit om de databank op te zetten met de nodige migrations en ook eveneens de seed data te importeren.
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
- om de coverage te kunnen bekijken open je het bestand ``coverage/lcov-report/index.html`` in je browser.
