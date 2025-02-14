-- DropIndex
DROP INDEX "leaderboard_username_key";

-- AlterTable
ALTER TABLE "leaderboard" ALTER COLUMN "username" SET DATA TYPE VARCHAR(25);
