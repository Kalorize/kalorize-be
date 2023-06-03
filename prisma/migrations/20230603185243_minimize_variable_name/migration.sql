/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Reccomendation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Reccomendation_userId_key` ON `Reccomendation`(`userId`);
