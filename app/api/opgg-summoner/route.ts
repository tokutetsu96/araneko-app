import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * OPGGListへの登録API
 *
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  try {
    const { summonerName, tag, opggUrl } = await req.json();

    if (!summonerName || !tag || !opggUrl) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    const newSummoner = await prisma.opggSummoner.create({
      data: {
        summonerName,
        tag,
        opggUrl,
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
    const summoners = await prisma.opggSummoner.findMany();
    return NextResponse.json(summoners, { status: 200 });
  } catch (error) {
    console.error("Not found OpggSummoner:", error);
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}
