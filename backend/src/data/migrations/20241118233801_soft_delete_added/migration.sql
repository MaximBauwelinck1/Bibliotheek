/*
  Warnings:

  - Added the required column `actief` to the `Boek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actief` to the `BoekKopie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actief` to the `Gebruiker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boek" ADD COLUMN     "actief" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "BoekKopie" ADD COLUMN     "actief" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Gebruiker" ADD COLUMN     "actief" BOOLEAN NOT NULL;
