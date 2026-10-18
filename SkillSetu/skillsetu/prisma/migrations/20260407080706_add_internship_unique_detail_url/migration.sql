/*
  Warnings:

  - A unique constraint covering the columns `[detailUrl]` on the table `Internship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Internship_detailUrl_key" ON "Internship"("detailUrl");
