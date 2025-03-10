import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // セッションを取得してユーザー認証を確認
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "認証されていません" },
        { status: 401 }
      );
    }

    // リクエストボディからサモナー情報を取得
    const { summonerName, tag, opggUrl } = await request.json();

    if (!summonerName || !tag) {
      return NextResponse.json(
        { message: "サモナー名とタグは必須です" },
        { status: 400 }
      );
    }

    if (!opggUrl) {
      return NextResponse.json(
        { message: "OP.GG URLは必須です" },
        { status: 400 }
      );
    }

    // Riot APIを使用してサモナー情報を検証
    try {
      // Riot APIのベースURL
      const riotApiKey = process.env.RIOT_API_KEY;
      const region = "asia"; // アジアリージョン

      // Riot IDからPUUIDを取得
      const accountResponse = await fetch(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
          summonerName
        )}/${encodeURIComponent(tag)}`,
        {
          headers: {
            "X-Riot-Token": riotApiKey as string,
          },
        }
      );

      if (!accountResponse.ok) {
        return NextResponse.json(
          { message: "指定されたRiot IDが見つかりませんでした" },
          { status: 404 }
        );
      }

      const accountData = await accountResponse.json();
      const puuid = accountData.puuid;

      // PUUIDからサモナー情報を取得
      const summonerResponse = await fetch(
        `https://jp1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        {
          headers: {
            "X-Riot-Token": riotApiKey as string,
          },
        }
      );

      if (!summonerResponse.ok) {
        return NextResponse.json(
          { message: "サモナー情報の取得に失敗しました" },
          { status: 500 }
        );
      }

      const summonerData = await summonerResponse.json();

      // ユーザーのサモナー情報をデータベースに保存または更新
      await prisma.mySummoner.upsert({
        where: {
          userId: session.user.id,
        },
        update: {
          userId: session.user.id,
          summonerName: summonerName,
          tag: tag,
          opggUrl: opggUrl,
        },
        create: {
          userId: session.user.id,
          summonerName: summonerName,
          tag: tag,
          opggUrl: opggUrl,
        },
      });

      return NextResponse.json(
        { message: "サモナー情報が正常に登録されました" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Riot API呼び出しエラー:", error);
      return NextResponse.json(
        { message: "サモナー情報の検証中にエラーが発生しました" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
