/*
  Warnings:

  - You are about to drop the column `shortenedCode` on the `Url` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Url_shortenedCode_idx";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortenedCode";

-- CreateIndex
CREATE INDEX "Url_shortened_idx" ON "Url"("shortened");
