-- CreateTable
CREATE TABLE "my_summoners" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "opggUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "my_summoners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "my_summoners_userId_key" ON "my_summoners"("userId");
