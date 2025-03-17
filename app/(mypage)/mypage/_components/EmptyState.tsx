"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const [summonerName, setSummonerName] = useState("");
  const [tag, setTag] = useState("");
  const [opggUrl, setOpggUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!summonerName.trim()) {
      setError("サモナー名を入力してください");
      return;
    }

    if (!tag.trim()) {
      setError("タグを入力してください");
      return;
    }

    if (!opggUrl.trim()) {
      setError("OP.GG URLを入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/register-summoner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summonerName, tag, opggUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "サモナー登録に失敗しました");
      }

      // 登録成功後、ページをリロードして新しいデータを表示
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center"
    >
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">サモナー登録</CardTitle>
          <CardDescription>
            あなたのサモナー情報を登録して、プロフィールを表示しましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "サモナーを登録する"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Riot IDを正確に入力してください
        </CardFooter>
      </Card>
    </motion.div>
  );
}
