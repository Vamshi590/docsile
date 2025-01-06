/*
  Warnings:

  - A unique constraint covering the columns `[questionId,viewerId,sessionId]` on the table `QuestionViews` will be added. If there are existing duplicate values, this will fail.
  - The required column `sessionId` was added to the `QuestionViews` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "QuestionViews_questionId_viewerId_key";

-- AlterTable
ALTER TABLE "QuestionViews" ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "viewDuration" INTEGER NOT NULL DEFAULT 2;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionViews_questionId_viewerId_sessionId_key" ON "QuestionViews"("questionId", "viewerId", "sessionId");
