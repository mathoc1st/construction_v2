/*
  Warnings:

  - You are about to drop the column `area` on the `Building` table. All the data in the column will be lost.
  - Added the required column `length` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "area",
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
