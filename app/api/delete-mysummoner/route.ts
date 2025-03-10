import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "認証されていません" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ユーザーのサモナー情報を確認
    const existingSummoner = await prisma.mySummoner.findUnique({
      where: { userId },
    });

    if (!existingSummoner) {
      return NextResponse.json(
        { message: "削除するサモナー情報が見つかりません" },
        { status: 404 }
      );
    }

    // サモナー情報を削除
    await prisma.mySummoner.delete({
      where: { userId },
    });

    return NextResponse.json(
      { message: "サモナー情報が正常に削除されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json(
      { message: "サモナー情報の削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
