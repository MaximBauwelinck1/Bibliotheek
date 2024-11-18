/*
  Warnings:

  - A unique constraint covering the columns `[voornaam,achternaam]` on the table `Auteur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auteur_voornaam_achternaam_key" ON "Auteur"("voornaam", "achternaam");
