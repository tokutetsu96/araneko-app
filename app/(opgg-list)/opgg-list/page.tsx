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
  rankInfo: RankInfo;
};

type RankInfo = {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

export default function OPGGListPage() {
  const [summoners, setSummoners] = useState<opggSummoner[]>([]);
  const [summonerName, setSummonerName] = useState("");
  const [opggUrl, setOpggUrl] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const API_SUMMONER_URL = "/api/opgg-summoner";

  const fetchSummoners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL + API_SUMMONER_URL);
      if (!response.ok) {
        throw new Error(`データの取得に失敗しました: HTTP ${response.status}`);
      }
      const data = await response.json();
      // サモナー情報を取得した後、ランク情報をRiot APIから取得
      const summonersWithRank = await Promise.all(
        data.map(async (summoner: opggSummoner) => {
          const rankData = await fetchRankInfo(
            summoner.summonerName,
            summoner.tag
          );

          return { ...summoner, rankInfo: rankData || {} };
        })
      );

      setSummoners(summonersWithRank);
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

  const fetchRankInfo = async (summonerName: string, tag: string) => {
    const response = await fetch(
      `/api/summoner?gameName=${summonerName}&tagLine=${tag}`
    );

    if (!response.ok) {
      setError("サモナー情報の取得に失敗しました");
      return null;
    }

    const data = await response.json();
    if (!data.rankData || data.rankData.length === 0) {
      return null;
    }

    return data.rankData[0];
  };

  useEffect(() => {
    fetchSummoners();
  }, []);

  const handleAddSummoner = async () => {
    if (!summonerName.trim() || !opggUrl.trim() || !tag.trim()) {
      setError("名前とURLを入力してください！");
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
    <div className="container mx-auto p-10 space-y-6">
      <h1 className="text-4xl font-semibold text-center">OPGG 一覧</h1>

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
            onClick={handleAddSummoner}
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
          <Card
            key={summoner.id}
            className="p-4 hover:shadow-lg hover:scale-105 transition"
          >
            <CardHeader>
              <a
                href={summoner.opggUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex space-x-2 font-bold">
                  <p>{summoner.summonerName}</p>
                  <p>#{summoner.tag}</p>
                </div>

                {summoner.rankInfo.tier ? (
                  <div className="flex space-x-2 mt-2 text-sm text-gray-500">
                    <p>{summoner.rankInfo.tier}</p>
                    <p>{summoner.rankInfo.rank}</p>
                    <p>{summoner.rankInfo.leaguePoints}LP</p>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500">
                    ランク情報なし
                  </div>
                )}
              </a>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
