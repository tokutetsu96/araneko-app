"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "../../../config/config";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";

type opggSummoner = {
  id: number;
  summonerName: string;
  opggUrl: string;
  tag: string;
};

export default function OPGGListPage() {
  const [summoners, setSummoners] = useState<opggSummoner[]>([]);
  const [summonerName, setSummonerName] = useState("");
  const [opggUrl, setOpggUrl] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const API_ENTRIES_URL = "/api/opgg-summoner";

  // APIからデータを取得
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL + API_ENTRIES_URL);
      if (!response.ok) {
        throw new Error(`データの取得に失敗しました: HTTP ${response.status}`);
      }
      const data = await response.json();
      setSummoners(data);
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

  // 初期データ取得
  useEffect(() => {
    fetchEntries();
  }, []);

  // 登録処理
  const handleAddEntry = async () => {
    if (!summonerName.trim() || !opggUrl.trim() || !tag.trim()) {
      setError("名前とURLを入力してください！");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/opgg-summoner`, {
        // ✅ API_URLを統一
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summonerName, // ✅ キー名をサーバー側と統一
          opggUrl,
          tag,
        }),
      });

      if (!response.ok) {
        throw new Error("データの登録に失敗しました");
      }

      // データの再取得
      await fetchEntries();
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
    <div className="container mx-auto p-10 space-y-6">
      <h1 className="text-4xl font-semibold text-center">OPGG 一覧</h1>

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="cursor-pointer text-lg flex items-center space-x-2"
        onClick={() => setShowForm(!showForm)}
      >
        <span className="font-bold">
          {showForm ? "△ 閉じる" : "▽ 新規登録"}
        </span>
      </div>

      {/* プルダウン形式で表示されるフォーム */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showForm ? "max-h-96" : "max-h-0"
        } mt-4`}
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
            onClick={handleAddEntry}
            disabled={loading}
            className="w-full"
          >
            {loading ? "登録中..." : "登録"}
          </Button>
        </div>
      </div>

      {loading && <Spinner />}

      <div className="space-y-4">
        {summoners.map((summoner) => (
          <Card key={summoner.id} className="p-4 hover:bg-gray-100">
            <CardHeader>
              <a
                href={summoner.opggUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {summoner.summonerName}
              </a>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
