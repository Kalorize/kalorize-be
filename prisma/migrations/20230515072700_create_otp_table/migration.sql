-- CreateTable
CREATE TABLE `Otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT false,
    `chance` INTEGER NULL,
    `expired` DATETIME(3) NOT NULL,
    `lifetime` DATETIME(3) NULL,

    UNIQUE INDEX `Otp_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
