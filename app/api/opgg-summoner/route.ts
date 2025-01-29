import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ POST メソッドを追加
export async function POST(req: Request) {
  try {
    const { summonerName, tag, opggUrl } = await req.json();

    if (!summonerName || !tag || !opggUrl) {
      return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 });
    }

    const newSummoner = await prisma.opggSummoner.create({
      data: { summonerName, tag, opggUrl },
    });

    return NextResponse.json(newSummoner, { status: 201 });
  } catch (error) {
    console.error("Error creating OpggSummoner:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

// ✅ GET メソッドも追加（確認用）
export async function GET() {
  try {
    const summoners = await prisma.opggSummoner.findMany();
    return NextResponse.json(summoners, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}
