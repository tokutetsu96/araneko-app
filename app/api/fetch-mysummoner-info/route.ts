import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const mySummoner = await prisma.mySummoner.findUnique({
      where: { userId },
    });

    return NextResponse.json(mySummoner, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}
