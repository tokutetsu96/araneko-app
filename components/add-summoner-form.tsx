import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { API_BASE_URL } from "@/config/config";

type AddSummonerProps = {
  fetchSummoners: () => Promise<void>;
  setError: (error: string | null) => void;
};

export default function AddSummonerForm({
  fetchSummoners,
  setError,
}: AddSummonerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [summonerName, setSummonerName] = useState("");
  const [opggUrl, setOpggUrl] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  // クライアントでマウントされたことを確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント前は透明な背景を適用し、マウント後に適切な背景を設定
  const bgColor = !mounted
    ? "bg-transparent"
    : theme === "dark"
    ? "bg-black text-white"
    : "bg-white text-black";

  const handleAddSummoner = async () => {
    if (!summonerName.trim() || !opggUrl.trim() || !tag.trim()) {
      setError("空白の項目があります");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/opgg-summoner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summonerName,
          opggUrl,
          tag,
        }),
      });

      if (!response.ok) {
        throw new Error("データの登録に失敗しました");
      }

      await fetchSummoners();

      setSummonerName("");
      setOpggUrl("");
      setTag("");
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
        <div className="space-y-6 m-4">
          <div className="flex gap-2">
            <div>
              <Label className="font-bold">サモナー名</Label>
              <Input
                placeholder="例:Farm Merge King"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="font-bold">タグ ※＃なしで入力</Label>
              <Input
                placeholder="例:ふぁまきん"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label className="font-bold">OPGG URL</Label>
            <Input
              placeholder="登録したいサモナーのOPGGのURLを貼り付けてください"
              value={opggUrl}
              onChange={(e) => setOpggUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleAddSummoner}
            disabled={loading}
            className="w-full"
          >
            {loading ? "登録中..." : "登録"}
          </Button>
        </div>
      </div>
    </div>
  );
}
