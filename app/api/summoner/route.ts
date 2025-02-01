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

  const API_KEY = process.env.RIOT_API_KEY;
  const RIOT_ACCOUNT_API =
    "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id";
  const RIOT_LOL_API = "https://jp1.api.riotgames.com/lol"; // JPサーバー用

  try {
    // **1. PUUID を取得**
    const accountResponse = await fetch(
      `${RIOT_ACCOUNT_API}/${encodeURIComponent(gameName)}/${encodeURIComponent(
        tagLine
      )}?api_key=${API_KEY}`
    );
    const accountData = await accountResponse.json();

    if (!accountResponse.ok || !accountData.puuid) {
      console.error("PUUID 取得エラー:", accountData);
      throw new Error(
        accountData.status?.message || "PUUID の取得に失敗しました"
      );
    }

    const { puuid } = accountData;

    await sleep(1000);
    // **2. Summoner ID を取得**
    const summonerResponse = await fetch(
      `${RIOT_LOL_API}/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
    );
    const summonerData = await summonerResponse.json();

    if (!summonerResponse.ok || !summonerData.id) {
      console.error("サモナー情報取得エラー:", summonerData);
      throw new Error(
        summonerData.status?.message || "サモナー情報の取得に失敗しました"
      );
    }

    const { id: summonerId } = summonerData;
    await sleep(1000);
    // **3. ランク情報を取得**
    const rankResponse = await fetch(
      `${RIOT_LOL_API}/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`
    );
    const rankData = await rankResponse.json();

    if (!rankResponse.ok || rankData.length === 0) {
      // ランクをプレイしていない場合もあるのでnullで返す
      return NextResponse.json({ summonerData, rankData: null });
    }

    return NextResponse.json({ summonerData, rankData });
  } catch (error: any) {
    console.error("APIエラー:", error.message);
    return NextResponse.json(
      { error: error.message || "内部サーバーエラー" },
      { status: 500 }
    );
  }
}
