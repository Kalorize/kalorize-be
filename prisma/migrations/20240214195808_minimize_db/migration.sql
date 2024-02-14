/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `calories` on table `FoodHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `protein` on table `FoodHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Otp` DROP FOREIGN KEY `Otp_userEmail_fkey`;

-- AlterTable
ALTER TABLE `FoodHistory` MODIFY `calories` DOUBLE NOT NULL,
    MODIFY `protein` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `Otp`;
