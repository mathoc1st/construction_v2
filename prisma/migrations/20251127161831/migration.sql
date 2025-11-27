/*
  Warnings:

  - The values [WARM,ALL_YEAR,ALL_YEAR_150,ALL_YEAR_200] on the enum `FinishType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FinishType_new" AS ENUM ('COLD', 'WARM_100', 'WARM_150', 'WARM_200');
ALTER TABLE "Finish" ALTER COLUMN "type" TYPE "FinishType_new" USING ("type"::text::"FinishType_new");
ALTER TYPE "FinishType" RENAME TO "FinishType_old";
ALTER TYPE "FinishType_new" RENAME TO "FinishType";
DROP TYPE "public"."FinishType_old";
COMMIT;
