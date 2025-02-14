/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `leaderboard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_username_key" ON "leaderboard"("username");
