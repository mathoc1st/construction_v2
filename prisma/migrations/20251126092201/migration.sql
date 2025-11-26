-- DropForeignKey
ALTER TABLE "Finish" DROP CONSTRAINT "Finish_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_buildingId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finish" ADD CONSTRAINT "Finish_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;
