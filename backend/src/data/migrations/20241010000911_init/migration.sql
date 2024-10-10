-- CreateTable
CREATE TABLE "Auteur" (
    "id" UUID NOT NULL,
    "voornaam" VARCHAR(255) NOT NULL,
    "achternaam" VARCHAR(255) NOT NULL,
    "geboortedatum" TIMESTAMP(3) NOT NULL,
    "nationaliteit" VARCHAR(255) NOT NULL,
    "biografie" VARCHAR(255),
    "aangemaakt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgedate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boek" (
    "id" UUID NOT NULL,
    "ISBN" TEXT NOT NULL,
    "titel" VARCHAR(255) NOT NULL,
    "genre" VARCHAR(100) NOT NULL,
    "publicatie_datum" TIMESTAMP(3),
    "taal" VARCHAR(50) NOT NULL,
    "paginas" INTEGER NOT NULL,
    "vrije_kopieen" INTEGER NOT NULL,
    "totale_kopieen" INTEGER NOT NULL,
    "beschrijving" VARCHAR(255),
    "cover_uri" VARCHAR(255),
    "aangemaakt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgedate" TIMESTAMP(3) NOT NULL,
    "auteur_id" UUID NOT NULL,

    CONSTRAINT "Boek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoekKopie" (
    "id" UUID NOT NULL,
    "boek_id" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "extra_informatie" VARCHAR(255),
    "aangemaakt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgedate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoekKopie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gebruiker" (
    "id" UUID NOT NULL,
    "voornaam" VARCHAR(255) NOT NULL,
    "achternaam" VARCHAR(255) NOT NULL,
    "geboortedatum" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "rol" VARCHAR(50) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "aangemaakt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgedate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gebruiker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservatie" (
    "id" UUID NOT NULL,
    "boek_kopie_id" UUID NOT NULL,
    "gebruiker_id" UUID NOT NULL,
    "startdatum" TIMESTAMP(3) NOT NULL,
    "einddatum" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "Reservatie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boek_ISBN_key" ON "Boek"("ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "Gebruiker_email_key" ON "Gebruiker"("email");

-- AddForeignKey
ALTER TABLE "Boek" ADD CONSTRAINT "Boek_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "Auteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoekKopie" ADD CONSTRAINT "BoekKopie_boek_id_fkey" FOREIGN KEY ("boek_id") REFERENCES "Boek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservatie" ADD CONSTRAINT "Reservatie_boek_kopie_id_fkey" FOREIGN KEY ("boek_kopie_id") REFERENCES "BoekKopie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservatie" ADD CONSTRAINT "Reservatie_gebruiker_id_fkey" FOREIGN KEY ("gebruiker_id") REFERENCES "Gebruiker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
