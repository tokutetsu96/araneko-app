import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Card className="border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-rose-500 text-5xl">⚠️</div>
          <h3 className="text-xl font-semibold text-rose-700 dark:text-rose-300">
            エラーが発生しました
          </h3>
          <p className="text-rose-600 dark:text-rose-400">{message}</p>
          <Button variant="outline" onClick={onRetry} className="mt-2">
            再試行
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
