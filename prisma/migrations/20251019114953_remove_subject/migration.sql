/*
  Warnings:

  - You are about to drop the column `subject` on the `Response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Response" DROP COLUMN "subject",
ADD COLUMN     "imageUrls" TEXT[];
