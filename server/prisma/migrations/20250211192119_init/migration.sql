/*
  Warnings:

  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Leaderboard";

-- CreateTable
CREATE TABLE "leaderboard" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leaderboard_score_idx" ON "leaderboard"("score");
