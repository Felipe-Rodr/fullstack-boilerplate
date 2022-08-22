/*
  Warnings:

  - The primary key for the `player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player" DROP CONSTRAINT "player_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "player_pkey" PRIMARY KEY ("id");
