/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Url_externalId_key" ON "Url"("externalId");
