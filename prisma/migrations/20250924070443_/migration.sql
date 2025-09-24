/*
  Warnings:

  - You are about to drop the column `price` on the `Position` table. All the data in the column will be lost.
  - Added the required column `avgPrice` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Algo_Trading_System_Prototype"."Position" DROP COLUMN "price",
ADD COLUMN     "avgPrice" DOUBLE PRECISION NOT NULL;
