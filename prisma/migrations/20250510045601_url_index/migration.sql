/*
  Warnings:

  - Added the required column `shortenedCode` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "shortenedCode" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Url_externalId_idx" ON "Url"("externalId");

-- CreateIndex
CREATE INDEX "Url_shortenedCode_idx" ON "Url"("shortenedCode");
