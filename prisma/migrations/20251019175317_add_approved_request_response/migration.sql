-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
