import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useForm, SubmitHandler } from "react-hook-form";

type AddSummonerProps = {
  fetchSummoners: () => Promise<void>;
  setError: (error: string | null) => void;
};

type FormData = {
  summonerName: string;
  opggUrl: string;
  tag: string;
};

export default function AddSummonerForm({
  fetchSummoners,
  setError,
}: AddSummonerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = !mounted
    ? "bg-transparent"
    : theme === "dark"
    ? "bg-black text-white"
    : "bg-white text-black";

  const handleSubmitSummoner: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/opgg-summoner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("データの登録に失敗しました");
      }

      await fetchSummoners();
      reset();
      setShowForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      <div
        className="cursor-pointer text-lg flex items-center space-x-2"
        onClick={() => setShowForm(!showForm)}
      >
        <span className="font-bold">
          {showForm ? "△ 閉じる" : "▽ 新規登録"}
        </span>
      </div>

      <div
        className={`absolute left-0 w-full shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${bgColor} ${
          showForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form
          onSubmit={handleSubmit(handleSubmitSummoner)}
          className="space-y-6 m-4"
        >
          <div className="flex gap-2">
            <div>
              <Label className="font-bold">サモナー名</Label>
              <Input
                placeholder="例:Farm Merge King"
                className="w-full"
                {...register("summonerName", {
                  required: "※サモナー名は必須です",
                })}
              />
              {errors.summonerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.summonerName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="font-bold">タグ ※＃なしで入力</Label>
              <Input
                placeholder="例:ふぁまきん"
                className="w-full"
                {...register("tag", { required: "※タグは必須です" })}
              />
              {errors.tag && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tag.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="font-bold">OPGG URL</Label>
            <Input
              placeholder="登録したいサモナーのOPGGのURLを貼り付けてください"
              className="w-full"
              {...register("opggUrl", {
                required: "※OPGG URLは必須です",
                pattern: {
                  value: /^https?:\/\/(www\.)?op\.gg\/.+/,
                  message: "※正しいOPGG URLを入力してください",
                },
              })}
            />
            {errors.opggUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.opggUrl.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "登録中..." : "登録"}
          </Button>
        </form>
      </div>
    </div>
  );
}
