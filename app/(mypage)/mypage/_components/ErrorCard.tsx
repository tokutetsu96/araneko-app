"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  // サモナーが登録されていないエラーかどうかを確認
  const isSummonerNotRegistered = message === "サモナーが登録されていません";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center"
    >
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラーが発生しました</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {isSummonerNotRegistered && (
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              サモナー情報を登録して、プロフィールを表示しましょう。下の「登録画面を表示」ボタンをクリックしてください。
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>

          {isSummonerNotRegistered && (
            <Button size="sm" onClick={() => onRetry()}>
              登録画面を表示
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
