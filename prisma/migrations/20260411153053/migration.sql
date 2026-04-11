/*
  Warnings:

  - You are about to drop the `FinishOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FinishOption" DROP CONSTRAINT "FinishOption_finishId_fkey";

-- AlterTable
ALTER TABLE "Finish" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "FinishOption";
