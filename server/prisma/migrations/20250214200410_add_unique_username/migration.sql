/*
  Warnings:

  - You are about to alter the column `username` on the `leaderboard` table. The data in that column could be lost. The data in that column will be cast from `VarChar(25)` to `VarChar(12)`.
  - A unique constraint covering the columns `[username]` on the table `leaderboard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "leaderboard" ALTER COLUMN "username" SET DATA TYPE VARCHAR(12);

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_username_key" ON "leaderboard"("username");
