import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SummonerSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700" />
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
