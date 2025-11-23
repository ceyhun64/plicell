/*
  Warnings:

  - You are about to alter the column `tcno` on the `address` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE `address` MODIFY `tcno` VARCHAR(11) NULL;

-- AlterTable
ALTER TABLE `orderaddress` ADD COLUMN `tcno` VARCHAR(11) NULL;
