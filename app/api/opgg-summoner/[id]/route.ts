import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;

    const { params } = routeContextSchema.parse({ params: resolvedParams });

    await prisma.opggSummoner.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "削除に成功しました" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "削除に失敗しました" },
      { status: 500 }
    );
  }
}
