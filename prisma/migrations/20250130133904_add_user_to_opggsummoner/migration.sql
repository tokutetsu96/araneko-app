-- AlterTable
ALTER TABLE "OpggSummoner" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "OpggSummoner" ADD CONSTRAINT "OpggSummoner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
