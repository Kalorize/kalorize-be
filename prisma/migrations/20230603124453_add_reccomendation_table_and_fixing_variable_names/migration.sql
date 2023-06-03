/*
  Warnings:

  - The primary key for the `Food` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Calories` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `CarbohydrateContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `CholesterolContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `CookTime` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `FatContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `FiberContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `ImageUrl` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `PrepTime` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `ProteinContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `RecipeId` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `RecipeIngredientParts` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `RecipeInstructions` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `SaturatedFatContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `SodiumContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `SugarContent` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `TotalTime` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the `Food_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `calories` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbohydrate` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cholesterol` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookTime` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatContent` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiber` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientParts` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturatedFat` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sodium` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sugar` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTime` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Food_history` DROP FOREIGN KEY `Food_history_breakfastId_fkey`;

-- DropForeignKey
ALTER TABLE `Food_history` DROP FOREIGN KEY `Food_history_dinnerId_fkey`;

-- DropForeignKey
ALTER TABLE `Food_history` DROP FOREIGN KEY `Food_history_lunchId_fkey`;

-- DropForeignKey
ALTER TABLE `Food_history` DROP FOREIGN KEY `Food_history_userId_fkey`;

-- AlterTable
ALTER TABLE `Food` DROP PRIMARY KEY,
    DROP COLUMN `Calories`,
    DROP COLUMN `CarbohydrateContent`,
    DROP COLUMN `CholesterolContent`,
    DROP COLUMN `CookTime`,
    DROP COLUMN `FatContent`,
    DROP COLUMN `FiberContent`,
    DROP COLUMN `ImageUrl`,
    DROP COLUMN `Name`,
    DROP COLUMN `PrepTime`,
    DROP COLUMN `ProteinContent`,
    DROP COLUMN `RecipeId`,
    DROP COLUMN `RecipeIngredientParts`,
    DROP COLUMN `RecipeInstructions`,
    DROP COLUMN `SaturatedFatContent`,
    DROP COLUMN `SodiumContent`,
    DROP COLUMN `SugarContent`,
    DROP COLUMN `TotalTime`,
    ADD COLUMN `calories` DOUBLE NOT NULL,
    ADD COLUMN `carbohydrate` DOUBLE NOT NULL,
    ADD COLUMN `cholesterol` DOUBLE NOT NULL,
    ADD COLUMN `cookTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `fatContent` DOUBLE NOT NULL,
    ADD COLUMN `fiber` DOUBLE NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `ingredientParts` VARCHAR(191) NOT NULL,
    ADD COLUMN `instructions` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `prepTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `protein` DOUBLE NOT NULL,
    ADD COLUMN `saturatedFat` DOUBLE NOT NULL,
    ADD COLUMN `sodium` DOUBLE NOT NULL,
    ADD COLUMN `sugar` DOUBLE NOT NULL,
    ADD COLUMN `totalTime` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Food_history`;

-- CreateTable
CREATE TABLE `Reccomendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `protein` DOUBLE NOT NULL,
    `calories` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `breakfastId` INTEGER NOT NULL,
    `lunchId` INTEGER NOT NULL,
    `dinnerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_breakfast_reccomendation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_breakfast_reccomendation_AB_unique`(`A`, `B`),
    INDEX `_breakfast_reccomendation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_lunch_reccomendation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_lunch_reccomendation_AB_unique`(`A`, `B`),
    INDEX `_lunch_reccomendation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_dinner_reccomendation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_dinner_reccomendation_AB_unique`(`A`, `B`),
    INDEX `_dinner_reccomendation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reccomendation` ADD CONSTRAINT `Reccomendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodHistory` ADD CONSTRAINT `FoodHistory_lunchId_fkey` FOREIGN KEY (`lunchId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodHistory` ADD CONSTRAINT `FoodHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodHistory` ADD CONSTRAINT `FoodHistory_breakfastId_fkey` FOREIGN KEY (`breakfastId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodHistory` ADD CONSTRAINT `FoodHistory_dinnerId_fkey` FOREIGN KEY (`dinnerId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_breakfast_reccomendation` ADD CONSTRAINT `_breakfast_reccomendation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_breakfast_reccomendation` ADD CONSTRAINT `_breakfast_reccomendation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reccomendation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_lunch_reccomendation` ADD CONSTRAINT `_lunch_reccomendation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_lunch_reccomendation` ADD CONSTRAINT `_lunch_reccomendation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reccomendation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_dinner_reccomendation` ADD CONSTRAINT `_dinner_reccomendation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_dinner_reccomendation` ADD CONSTRAINT `_dinner_reccomendation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reccomendation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
