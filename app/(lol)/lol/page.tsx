"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink, RefreshCw, Plus } from "lucide-react";
import Image from "next/image";
import type { opggSummoner } from "@/types/summoner";
import { getRankColor } from "@/app/utils/rankUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DeleteButton from "@/components/buttons/delete-button";
import AddSummonerForm from "./_components/add-summoner-form";

export default function OPGGListPage() {
  const [summoners, setSummoners] = useState<opggSummoner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 無限レンダリングを防ぐために、useCallbackを使って関数をメモ化
  const fetchSummoners = useCallback(async () => {
    // ローディング開始
    setLoading(true);

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
      // 必ずローディング終了
      setLoading(false);
    }
  }, []);

  // ランク情報を取得する
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

  // 初期表示処理
  useEffect(() => {
    fetchSummoners();
  }, [fetchSummoners]);

  const handleDelete = (id: number) => {
    setSummoners((prevSummoners) =>
      prevSummoners.filter((summoner) => summoner.id !== id)
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSummoners();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleSummonerClick = (opggUrl: string) => {
    window.open(opggUrl, "_blank");
  };

  // ティア画像を取得する関数
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
    return validTiers.includes(normalizedTier)
      ? `/${normalizedTier}.webp`
      : "/UNRANKED.webp";
  };

  const calculateWinRate = (wins: number, losses: number) => {
    const totalGames = wins + losses;
    return totalGames > 0 ? Math.ceil((wins / totalGames) * 100) + "%" : "N/A";
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
          サモナーリスト
        </motion.h1>

        <div className="flex gap-2">
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
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            サモナー追加
          </Button>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <AddSummonerForm
            fetchSummoners={fetchSummoners}
            setError={setError}
            onComplete={() => setShowAddForm(false)}
          />
        </motion.div>
      )}

      {loading && summoners.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SummonerSkeleton key={i} />
          ))}
        </div>
      ) : summoners.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {summoners.map((summoner) => (
            <motion.div
              key={summoner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="absolute top-3 right-3">
                    <DeleteButton id={summoner.id} onDelete={handleDelete} />
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* プロフィール部分 */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getRankColor(
                            summoner.rankInfo?.tier
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
                          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <Image
                              src={getTierImage(summoner.rankInfo?.tier)}
                              alt={summoner.rankInfo?.tier || "Unranked"}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-contain"
                            />
                          </div>
                        </motion.div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold">
                            {summoner.summonerName}
                          </h2>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            #{summoner.tag}
                          </Badge>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          {summoner.rankInfo?.tier ? (
                            <Badge
                              className={`${getRankColor(
                                summoner.rankInfo?.tier
                              )} text-white`}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              {summoner.rankInfo.tier} {summoner.rankInfo.rank}
                            </Badge>
                          ) : (
                            <Badge variant="outline">ランク未設定</Badge>
                          )}

                          {summoner.rankInfo?.leaguePoints && (
                            <span className="text-sm font-medium">
                              {summoner.rankInfo.leaguePoints} LP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 戦績部分 */}
                    {summoner.rankInfo && (
                      <div className="grid grid-cols-3 gap-2">
                        <StatsCard
                          label="勝利数"
                          value={summoner.rankInfo.wins || 0}
                          color="text-emerald-500"
                        />

                        <StatsCard
                          label="敗北数"
                          value={summoner.rankInfo.losses || 0}
                          color="text-rose-500"
                        />

                        <StatsCard
                          label="勝率"
                          value={calculateWinRate(
                            summoner.rankInfo.wins || 0,
                            summoner.rankInfo.losses || 0
                          )}
                          color={
                            calculateWinRate(
                              summoner.rankInfo.wins || 0,
                              summoner.rankInfo.losses || 0
                            ).replace("%", "") >= "55"
                              ? "text-indigo-500"
                              : "text-gray-700"
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSummonerClick(summoner.opggUrl)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      OP.GGで表示
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatsCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex flex-col items-center text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function SummonerSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed border-2 bg-gray-50 dark:bg-gray-800/50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-gray-400 text-5xl">🎮</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            サモナーが登録されていません
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            「サモナー追加」ボタンからLeague of
            Legendsのサモナー情報を登録しましょう。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
