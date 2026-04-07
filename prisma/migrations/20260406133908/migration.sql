/*
  Warnings:

  - A unique constraint covering the columns `[type,buildingId,deletedAt]` on the table `Finish` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Finish_type_buildingId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Finish_type_buildingId_deletedAt_key" ON "Finish"("type", "buildingId", "deletedAt");
