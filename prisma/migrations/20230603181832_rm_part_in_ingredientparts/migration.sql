/*
  Warnings:

  - You are about to drop the column `ingredientParts` on the `Food` table. All the data in the column will be lost.
  - Added the required column `ingredients` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Food` DROP COLUMN `ingredientParts`,
    ADD COLUMN `ingredients` VARCHAR(191) NOT NULL;
