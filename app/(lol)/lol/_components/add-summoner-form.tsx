"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AddSummonerFormProps {
  fetchSummoners: () => Promise<void>;
  setError: (error: string | null) => void;
  onComplete?: () => void;
}

export default function AddSummonerForm({
  fetchSummoners,
  setError,
  onComplete,
}: AddSummonerFormProps) {
  const [summonerName, setSummonerName] = useState("");
  const [tag, setTag] = useState("");
  const [opggUrl, setOpggUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!summonerName || !tag) {
      setError("サモナー名とタグを入力してください");
      return;
    }

    if (!opggUrl) {
      setError("OP.GG URLを入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/opgg-summoner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summonerName,
          tag,
          opggUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "サモナーの追加に失敗しました");
      }

      // フォームをリセット
      setSummonerName("");
      setTag("");
      setOpggUrl("");

      // サモナーリストを再取得
      await fetchSummoners();

      // 完了時のコールバックがあれば実行
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">サモナー追加</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="summonerName">サモナー名</Label>
                <Input
                  id="summonerName"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  placeholder="サモナー名を入力"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">タグ</Label>
                <Input
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="タグを入力（例: JP1）"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="opggUrl">OP.GG URL</Label>
              <Input
                id="opggUrl"
                value={opggUrl}
                onChange={(e) => setOpggUrl(e.target.value)}
                placeholder="https://www.op.gg/summoners/jp/サモナー名-タグ"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  追加中...
                </>
              ) : (
                "追加する"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
