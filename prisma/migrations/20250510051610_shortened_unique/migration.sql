/*
  Warnings:

  - A unique constraint covering the columns `[shortened]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Url_shortened_key" ON "Url"("shortened");
