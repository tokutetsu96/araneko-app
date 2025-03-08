import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { API_KEY, RIOT_ACCOUNT_API, RIOT_LOL_API } from "@/constants/riotapi";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const sleep = (ms: number | undefined) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const mySummoner = await prisma.mySummoner.findUnique({
      where: { userId },
    });

    const summonerName = mySummoner?.summonerName.trim() ?? "";
    const tag = mySummoner?.tag.trim() ?? "";
    const opggUrl = mySummoner?.opggUrl.trim() ?? "";

    // **1. PUUID を取得**
    const accountResponse = await fetch(
      `${RIOT_ACCOUNT_API}/${encodeURIComponent(
        summonerName
      )}/${encodeURIComponent(tag)}?api_key=${API_KEY}`
    );

    const accountData = await accountResponse.json();

    if (!accountResponse.ok || !accountData.puuid) {
      throw new Error(
        accountData.status?.message || "PUUID の取得に失敗しました"
      );
    }

    const { puuid } = accountData;

    await sleep(500);
    // **2. Summoner ID を取得**
    const summonerResponse = await fetch(
      `${RIOT_LOL_API}/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
    );
    const summonerData = await summonerResponse.json();

    if (!summonerResponse.ok || !summonerData.id) {
      throw new Error(
        summonerData.status?.message || "サモナー情報の取得に失敗しました"
      );
    }

    const { id: summonerId } = summonerData;
    await sleep(500);
    // **3. ランク情報を取得**
    const rankResponse = await fetch(
      `${RIOT_LOL_API}/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`
    );
    const rankData = await rankResponse.json();

    if (!rankResponse.ok || rankData.length === 0) {
      // ランクをプレイしていない場合もあるのでnullを返す
      return NextResponse.json({ summonerData, rankData: null });
    }

    return NextResponse.json({
      opggData: {
        summonerName,
        tag,
        opggUrl,
      },
      summonerData,
      rankData: rankData[0],
    });
  } catch (error) {
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}
