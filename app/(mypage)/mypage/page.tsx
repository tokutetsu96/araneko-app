"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Shield, Trophy, Swords, ExternalLink } from "lucide-react";
import type { mySummoner } from "@/types/summoner";
import { getRankColor as getRankColorFromUtils } from "@/app/utils/rankUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/app/(mypage)/mypage/_components/StatsCard";
import { SummonerSkeleton } from "@/app/(mypage)/mypage/_components/SummonerSkeleton";
import { ErrorCard } from "@/app/(mypage)/mypage/_components/ErrorCard";
import { EmptyState } from "@/app/(mypage)/mypage/_components/EmptyState";

export default function MyPage() {
  const [mySummoner, setMySummoner] = useState<mySummoner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMySummonerInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetch-mysummoner-info");
      if (!response.ok) {
        throw new Error(`データの取得に失敗しました: HTTP ${response.status}`);
      }
      const data = await response.json();
      setMySummoner({
        ...data,
        summonerData: data.summonerData,
        rankInfo: data.rankData || {},
      });
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMySummonerInfo();
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    fetchMySummonerInfo();
  }, [fetchMySummonerInfo]);

  const handleSummonerClick = () => {
    if (mySummoner) {
      window.open(mySummoner.opggData.opggUrl, "_blank");
    }
  };

  const calculateWinRate = (wins: number, losses: number) => {
    const totalGames = wins + losses;
    return totalGames > 0 ? Math.ceil((wins / totalGames) * 100) + "%" : "N/A";
  };

  // ティア画像を取得する関数に置き換え
  const getTierImage = (tier: string | undefined) => {
    if (!tier) return "/UNRANKED.webp";

    const validTiers = [
      "IRON",
      "BRONZE",
      "SILVER",
      "GOLD",
      "EMERALD",
      "PLATINUM",
      "DIAMOND",
      "MASTER",
      "GRANDMASTER",
      "CHALLENGER",
    ];

    const normalizedTier = tier.toUpperCase();
    console.log(`/${normalizedTier}.webp`);
    return validTiers.includes(normalizedTier)
      ? `/${normalizedTier}.webp`
      : "/UNRANKED.webp";
  };

  const getRankEmoji = (tier: string | undefined) => {
    if (!tier) return "🔘";

    const tierMap: Record<string, string> = {
      IRON: "🔘",
      BRONZE: "🥉",
      SILVER: "⚪",
      GOLD: "🥇",
      PLATINUM: "💎",
      DIAMOND: "💠",
      MASTER: "👑",
      GRANDMASTER: "🏆",
      CHALLENGER: "🔱",
    };

    return tierMap[tier.toUpperCase()] || "🔘";
  };

  return (
    <div className="container mx-auto p-4 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          サモナープロフィール
        </motion.h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          更新する
        </Button>
      </div>

      <div className="h-px w-full bg-border" />

      {loading && !mySummoner ? (
        <SummonerSkeleton />
      ) : error ? (
        <ErrorCard message={error} onRetry={fetchMySummonerInfo} />
      ) : !mySummoner ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* プロフィール部分 */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${getRankColorFromUtils(
                        mySummoner.rankInfo?.tier
                      )} opacity-20 blur-sm`}
                    ></div>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${mySummoner.summonerData.profileIconId}.png`}
                        alt="Summoner Profile Icon"
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                        <img
                          src={
                            getTierImage(mySummoner.rankInfo?.tier) ||
                            "/placeholder.svg"
                          }
                          alt={mySummoner.rankInfo?.tier || "Unranked"}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">
                        {mySummoner.opggData.summonerName}
                      </h2>
                      <Badge variant="outline" className="text-xs font-normal">
                        #{mySummoner.opggData.tag}
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      {mySummoner.rankInfo?.tier ? (
                        <Badge
                          className={`${getRankColorFromUtils(
                            mySummoner.rankInfo?.tier
                          )} text-white`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {mySummoner.rankInfo.tier} {mySummoner.rankInfo.rank}
                        </Badge>
                      ) : (
                        <Badge variant="outline">ランク未設定</Badge>
                      )}

                      {mySummoner.rankInfo?.leaguePoints && (
                        <span className="text-sm font-medium">
                          {mySummoner.rankInfo.leaguePoints} LP
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 戦績部分 */}
                <div className="flex-1 mt-4 md:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      icon={<Trophy className="h-5 w-5 text-emerald-500" />}
                      label="勝利数"
                      value={mySummoner.rankInfo.wins || 0}
                      color="text-emerald-500"
                    />

                    <StatsCard
                      icon={<Swords className="h-5 w-5 text-rose-500" />}
                      label="敗北数"
                      value={mySummoner.rankInfo.losses || 0}
                      color="text-rose-500"
                    />

                    <StatsCard
                      icon={<div className="text-lg">📊</div>}
                      label="勝率"
                      value={calculateWinRate(
                        mySummoner.rankInfo.wins || 0,
                        mySummoner.rankInfo.losses || 0
                      )}
                      color={
                        calculateWinRate(
                          mySummoner.rankInfo.wins || 0,
                          mySummoner.rankInfo.losses || 0
                        ).replace("%", "") >= "55"
                          ? "text-indigo-500"
                          : "text-gray-700"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSummonerClick}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  OP.GGで表示
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
