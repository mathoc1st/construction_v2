-- DropForeignKey
ALTER TABLE "FinishOption" DROP CONSTRAINT "FinishOption_finishId_fkey";

-- AddForeignKey
ALTER TABLE "FinishOption" ADD CONSTRAINT "FinishOption_finishId_fkey" FOREIGN KEY ("finishId") REFERENCES "Finish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
