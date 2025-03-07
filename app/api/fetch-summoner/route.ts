import { API_KEY, RIOT_ACCOUNT_API, RIOT_LOL_API } from "@/constants/riotapi";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameName = url.searchParams.get("gameName");
  const tagLine = url.searchParams.get("tagLine");
  const sleep = (ms: number | undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "ゲーム名とタグラインを指定してください" },
      { status: 400 }
    );
  }

  try {
    // **1. PUUID を取得**
    const accountResponse = await fetch(
      `${RIOT_ACCOUNT_API}/${encodeURIComponent(gameName)}/${encodeURIComponent(
        tagLine
      )}?api_key=${API_KEY}`
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

    return NextResponse.json({ summonerData, rankData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "内部サーバーエラー" },
      { status: 500 }
    );
  }
}
