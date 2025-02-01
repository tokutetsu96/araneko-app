"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";
import AddSummonerForm from "@/components/add-summoner-form";
import { opggSummoner } from "@/types/summoner";
import { getRankColor } from "@/app/utils/rankUtils";
import DetailButton from "@/components/detail-button";

export default function OPGGListPage() {
  const [summoners, setSummoners] = useState<opggSummoner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummoners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/opgg-summoner");
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

  const handleDelete = (id: number) => {
    setSummoners((prevSummoners) =>
      prevSummoners.filter((summoner) => summoner.id !== id)
    );
  };

  useEffect(() => {
    fetchSummoners();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-10 space-y-6">
      <h1 className="text-4xl font-semibold text-center">Summoner List</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AddSummonerForm fetchSummoners={fetchSummoners} setError={setError} />

      {loading && <Spinner />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summoners.map((summoner) => (
          <Card
            key={summoner.id}
            className={`p-4 hover:shadow-lg hover:scale-105 hover:opacity-75 transition ${getRankColor(
              summoner.rankInfo?.tier
            )}`}
          >
            <CardHeader className="relative">
              <DetailButton id={summoner.id} onDelete={handleDelete} />
              <a
                href={summoner.opggUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <div className="flex space-x-2 font-bold text-lg text-white stroke-black stroke-2">
                  <p>{summoner.summonerName}</p>
                  <p>#{summoner.tag}</p>
                </div>

                {summoner.rankInfo?.tier ? (
                  <div
                    className={`flex space-x-2 mt-2 text-sm ${getRankColor(
                      summoner.rankInfo?.tier
                    )}`}
                  >
                    <p>{summoner.rankInfo.tier}</p>
                    <p>{summoner.rankInfo.rank}</p>
                    <p>{summoner.rankInfo.leaguePoints}LP</p>
                  </div>
                ) : (
                  <div className="mt-2 text-sm">ランク情報なし</div>
                )}
              </a>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
