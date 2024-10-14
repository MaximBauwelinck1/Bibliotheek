/*
  Warnings:

  - Made the column `publicatie_datum` on table `Boek` required. This step will fail if there are existing NULL values in that column.
  - Made the column `beschrijving` on table `Boek` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Boek" ALTER COLUMN "publicatie_datum" SET NOT NULL,
ALTER COLUMN "beschrijving" SET NOT NULL;
