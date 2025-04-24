/*
  Warnings:

  - You are about to drop the column `hora` on the `Evento` table. All the data in the column will be lost.
  - Added the required column `hora_fin` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora_ini` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Evento` DROP COLUMN `hora`,
    ADD COLUMN `hora_fin` VARCHAR(191) NOT NULL,
    ADD COLUMN `hora_ini` VARCHAR(191) NOT NULL;
