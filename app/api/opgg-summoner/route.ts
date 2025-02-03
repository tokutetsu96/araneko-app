import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { addSummonerSchema } from "@/lib/validations/add-summoner";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * テーブル"OpggSummoner"へのsummoner登録API
 *
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = addSummonerSchema.parse(json);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!body.summonerName || !body.tag || !body.opggUrl) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }
    const newSummoner = await prisma.opggSummoner.create({
      data: {
        summonerName: body.summonerName,
        tag: body.tag,
        opggUrl: body.opggUrl,
        userId: userId,
      },
    });

    return NextResponse.json(newSummoner, { status: 201 });
  } catch (error) {
    console.error("Error creating OpggSummoner:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * OPGGListの取得API
 *
 * @returns
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const summoners = await prisma.opggSummoner.findMany({
      where: { userId },
    });
    return NextResponse.json(summoners, { status: 200 });
  } catch (error) {
    console.error("Not found OpggSummoner:", error);
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}
