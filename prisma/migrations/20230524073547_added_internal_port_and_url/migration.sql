/*
  Warnings:

  - Added the required column `internalPort` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `port` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "internalPort" INTEGER NOT NULL,
ADD COLUMN     "url" VARCHAR(256),
ALTER COLUMN "port" SET NOT NULL;
