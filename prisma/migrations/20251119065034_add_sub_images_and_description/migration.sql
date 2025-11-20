/*
  Warnings:

  - Added the required column `description` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `subImage2` VARCHAR(191) NULL,
    ADD COLUMN `subImage3` VARCHAR(191) NULL;
