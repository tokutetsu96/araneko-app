import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed border-2 bg-gray-50 dark:bg-gray-800/50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-gray-400 text-5xl">🎮</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            サモナーが登録されていません
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            League of
            Legendsのサモナー情報を登録して、プロフィールを表示しましょう。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
