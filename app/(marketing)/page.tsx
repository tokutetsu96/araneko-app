"use client";

import { useState } from "react";
import { API_BASE_URL } from "../../config/config";

interface RankInfo {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number; // 勝利数
  losses: number; // 敗北数
}

export default function HomePage() {
  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");
  const [rankInfo, setRankInfo] = useState<RankInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getSummonerRank = async () => {
    if (!gameName || !tagLine) {
      setError("サモナー名とタグラインを入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. サモナー情報を取得（PUUID + Summoner ID）
      const summonerResponse = await fetch(
        `${API_BASE_URL}/api/summoner?gameName=${encodeURIComponent(
          gameName
        )}&tagLine=${encodeURIComponent(tagLine)}`
      );

      const summonerData = await summonerResponse.json();

      if (!summonerResponse.ok || !summonerData.summonerId) {
        throw new Error(
          summonerData.error || "サモナー情報の取得に失敗しました"
        );
      }

      const { summonerId } = summonerData;

      // 2. Summoner ID を使ってランク情報を取得
      const rankResponse = await fetch(
        `${API_BASE_URL}/api/rank/${encodeURIComponent(summonerId)}`
      );

      const rankData = await rankResponse.json();

      if (!rankResponse.ok) {
        throw new Error(rankData.error || "ランク情報の取得に失敗しました");
      }

      setRankInfo(rankData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">サモナーのランク情報</h1>

      <div className="mt-4">
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="サモナー名"
          className="border border-gray-300 p-2 rounded-md w-64"
        />
        <input
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value.replace("#", ""))}
          placeholder="タグライン"
          className="border border-gray-300 p-2 rounded-md w-64 ml-2"
        />
        <button
          onClick={getSummonerRank}
          className="bg-blue-500 text-white p-2 ml-2 rounded-md"
        >
          ランク情報を取得
        </button>
      </div>

      {loading && <p>読み込み中...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {rankInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">ランク情報</h2>
          <ul className="list-disc pl-5">
            {rankInfo.map((rank, index) => (
              <li key={index}>
                {rank.tier} {rank.rank} - {rank.leaguePoints} LP
                <br />
                勝利数: {rank.wins} / 敗北数: {rank.losses}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
