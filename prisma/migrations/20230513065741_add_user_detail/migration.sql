-- AlterTable
ALTER TABLE `User` ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NULL,
    ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `weight` DOUBLE NULL;
