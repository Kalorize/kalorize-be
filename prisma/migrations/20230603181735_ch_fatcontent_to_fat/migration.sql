/*
  Warnings:

  - You are about to drop the column `fatContent` on the `Food` table. All the data in the column will be lost.
  - Added the required column `fat` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Food` DROP COLUMN `fatContent`,
    ADD COLUMN `fat` DOUBLE NOT NULL;
