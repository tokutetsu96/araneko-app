import MotionLabel from "./_components/motion-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <MotionLabel />

      <section>
        <h1 className="text-4xl font-semibold">ようこそ</h1>
        <hr className="my-2 border-t-2" />
        <p className="text-lg mt-4">
          このサイトは、AraNekoが個人で開発したLoL向けの便利ツールサイトです。今後もLoLに関する便利な機能を追加していく予定です。
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">最新情報</h2>
        <hr className="my-2 border-t-2" />
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>新機能: チャンピオン統計ツールが追加されました（2023/06/15）</li>
          <li>アップデート: UIの改善とバグ修正を行いました（2023/06/10）</li>
          <li>お知らせ: サイトのベータ版をリリースしました（2023/06/01）</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">主な機能</h2>
        <hr className="my-2 border-t-2" />
        <Tabs defaultValue="champion-stats" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="champion-stats">チャンピオン統計</TabsTrigger>
            <TabsTrigger value="build-guide">ビルドガイド</TabsTrigger>
            <TabsTrigger value="match-history">マッチ履歴</TabsTrigger>
            <TabsTrigger value="ranking">ランキング</TabsTrigger>
          </TabsList>
          <TabsContent value="champion-stats">
            <h3 className="text-xl font-semibold mt-4">チャンピオン統計</h3>
            <p className="mt-2">
              各チャンピオンの勝率、ピック率、バン率などの詳細な統計情報を提供します。
            </p>
          </TabsContent>
          <TabsContent value="build-guide">
            <h3 className="text-xl font-semibold mt-4">ビルドガイド</h3>
            <p className="mt-2">
              人気のあるビルドやプロプレイヤーのビルドを簡単に確認できます。
            </p>
          </TabsContent>
          <TabsContent value="match-history">
            <h3 className="text-xl font-semibold mt-4">マッチ履歴</h3>
            <p className="mt-2">
              直近のマッチ履歴を分析し、パフォーマンスの改善点を提案します。
            </p>
          </TabsContent>
          <TabsContent value="ranking">
            <h3 className="text-xl font-semibold mt-4">ランキング</h3>
            <p className="mt-2">
              地域ごとのトッププレイヤーランキングを確認できます。
            </p>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">使い方</h2>
        <hr className="my-2 border-t-2" />
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="step-1">
            <AccordionTrigger>ステップ 1: 機能を選択</AccordionTrigger>
            <AccordionContent>
              ナビゲーションメニューから利用したい機能を選択します。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="step-2">
            <AccordionTrigger>ステップ 2: 情報を入力</AccordionTrigger>
            <AccordionContent>
              必要な情報（サモナー名、チャンピオン名など）を入力します。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="step-3">
            <AccordionTrigger>ステップ 3: 結果を活用</AccordionTrigger>
            <AccordionContent>
              結果を分析し、ゲームプレイの改善に活用してください。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">お問い合わせ</h2>
        <hr className="my-2 border-t-2" />
        <p className="mt-4">
          ご質問、フィードバック、または機能リクエストがありましたら、以下の方法でお問い合わせください：
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 mt-4">
          <Button variant="outline">
            <a href="mailto:support@araneko-loltools.com">Eメール</a>
          </Button>
          <Button variant="outline">
            <a
              href="https://twitter.com/AraNekoLoLTools"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </Button>
          <Button variant="outline">
            <a
              href="https://github.com/araneko/lol-tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
