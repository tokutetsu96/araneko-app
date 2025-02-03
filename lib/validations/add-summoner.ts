import { z } from "zod";

export const addSummonerSchema = z.object({
  summonerName: z.string().min(1, "※サモナー名は必須です"),
  tag: z.string().min(1, "※タグは必須です"),
  opggUrl: z
    .string()
    .min(1, "※OPGG URLは必須です")
    .regex(
      /^https?:\/\/(www\.)?op\.gg\/.+/,
      "※正しいOPGG URLを入力してください"
    ),
});

export type addSummonerSchemaType = z.infer<typeof addSummonerSchema>;
