"use client";

import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader } from "@/components/ui/card";
import Spinner from "@/components/spinner";
import { opggSummoner } from "@/types/summoner";
import { getRankColor } from "@/app/utils/rankUtils";

export default function MyPage() {
  const [mySummoner, setMySummoner] = useState<opggSummoner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMySummonerInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetch-mysummoner-info");
      if (!response.ok) {
        throw new Error(`データの取得に失敗しました: HTTP ${response.status}`);
      }
      if (response == null) {
        return;
      }
      const data = await response.json();
      const rankData = await fetchRankInfo(data.summonerName, data.tag);
      setMySummoner({ ...data, rankInfo: rankData || {} });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRankInfo = async (summonerName: string, tag: string) => {
    const response = await fetch(
      `/api/fetch-summoner?gameName=${summonerName}&tagLine=${tag}`
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
    fetchMySummonerInfo();
  }, [fetchMySummonerInfo]);

  return (
    <div className="container mx-auto p-10 space-y-6">
      <h1 className="text-4xl font-semibold">My Page</h1>
      <hr className="border-t-2" />

      {loading ? (
        <Spinner />
      ) : mySummoner ? (
        <Card
          className={`p-4 hover:shadow-lg hover:scale-105 hover:opacity-75 transition ${getRankColor(
            mySummoner.rankInfo?.tier
          )}`}
        >
          <CardHeader className="relative">
            <a
              href={mySummoner.opggUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <div className="flex space-x-2 font-bold text-lg text-white stroke-black stroke-2">
                <p>{mySummoner.summonerName}</p>
                <p>#{mySummoner.tag}</p>
              </div>
              {mySummoner.rankInfo?.tier ? (
                <div
                  className={`flex space-x-2 mt-2 text-sm ${getRankColor(
                    mySummoner.rankInfo?.tier
                  )}`}
                >
                  <p>{mySummoner.rankInfo.tier}</p>
                  <p>{mySummoner.rankInfo.rank}</p>
                  <p>{mySummoner.rankInfo.leaguePoints}LP</p>
                </div>
              ) : (
                <div className="mt-2 text-sm">ランク情報なし</div>
              )}
            </a>
          </CardHeader>
        </Card>
      ) : mySummoner === null ? null : (
        <div>サモナーが登録されていません</div>
      )}
    </div>
  );
}
