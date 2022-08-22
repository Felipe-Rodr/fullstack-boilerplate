/*
  Warnings:

  - The primary key for the `player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `Id` column on the `player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "player" DROP CONSTRAINT "player_pkey",
DROP COLUMN "Id",
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD CONSTRAINT "player_pkey" PRIMARY KEY ("Id");
