-- CreateTable
CREATE TABLE "OpggSummoner" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "opggUrl" TEXT NOT NULL,

    CONSTRAINT "OpggSummoner_pkey" PRIMARY KEY ("id")
);
