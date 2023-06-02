-- CreateTable
CREATE TABLE `Food` (
    `RecipeId` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `CookTime` VARCHAR(191) NOT NULL,
    `PrepTime` VARCHAR(191) NOT NULL,
    `TotalTime` VARCHAR(191) NOT NULL,
    `RecipeIngredientParts` VARCHAR(191) NOT NULL,
    `Calories` DOUBLE NOT NULL,
    `FatContent` DOUBLE NOT NULL,
    `SaturatedFatContent` DOUBLE NOT NULL,
    `CholesterolContent` DOUBLE NOT NULL,
    `SodiumContent` DOUBLE NOT NULL,
    `CarbohydrateContent` DOUBLE NOT NULL,
    `FiberContent` DOUBLE NOT NULL,
    `SugarContent` DOUBLE NOT NULL,
    `ProteinContent` DOUBLE NOT NULL,
    `RecipeInstructions` VARCHAR(191) NOT NULL,
    `ImageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`RecipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Food_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `breakfastId` INTEGER NOT NULL,
    `lunchId` INTEGER NOT NULL,
    `dinnerId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Food_history` ADD CONSTRAINT `Food_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Food_history` ADD CONSTRAINT `Food_history_breakfastId_fkey` FOREIGN KEY (`breakfastId`) REFERENCES `Food`(`RecipeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Food_history` ADD CONSTRAINT `Food_history_lunchId_fkey` FOREIGN KEY (`lunchId`) REFERENCES `Food`(`RecipeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Food_history` ADD CONSTRAINT `Food_history_dinnerId_fkey` FOREIGN KEY (`dinnerId`) REFERENCES `Food`(`RecipeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
