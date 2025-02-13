import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MainFunctions() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">主な機能</h2>
      <hr className="my-2 border-t-2" />
      <Tabs defaultValue="champion-stats" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="champion-stats">
            OPGGサモナーリスト管理
          </TabsTrigger>
          <TabsTrigger value="build-guide">LoL豆知識</TabsTrigger>
        </TabsList>
        <TabsContent value="champion-stats">
          <h3 className="text-xl font-semibold mt-4">OPGGサモナーリスト管理</h3>
          <p className="m-2">
            OPGGのサモナーリストを簡単に管理できます。すぐに確認したいサモナーを登録しておこう！
          </p>
        </TabsContent>
        <TabsContent value="build-guide">
          <h3 className="text-xl font-semibold mt-4">LoL豆知識</h3>
          <p className="m-2">LoLで使える豆知識を掲載しています。</p>
        </TabsContent>
      </Tabs>
    </section>
  );
}
