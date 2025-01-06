-- CreateTable
CREATE TABLE "QuestionViews" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "viewerId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionViews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionViews_questionId_viewerId_key" ON "QuestionViews"("questionId", "viewerId");

-- AddForeignKey
ALTER TABLE "QuestionViews" ADD CONSTRAINT "QuestionViews_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionViews" ADD CONSTRAINT "QuestionViews_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
