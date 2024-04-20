/*
  Warnings:

  - Added the required column `ativo` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "ativo" BOOLEAN NOT NULL;
