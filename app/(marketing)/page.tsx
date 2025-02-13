import MotionLabel from "./_components/motion-label";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import WhatsNew from "./_components/whats-new";
import MainFunctions from "./_components/main-functions";
import { DEVELOPER_X } from "@/constants/developper-info";

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
      {/* 最新情報 */}
      <WhatsNew />

      {/* 主な機能 */}
      <MainFunctions />

      <section>
        <h2 className="text-2xl font-semibold">SummonerListの使い方</h2>
        <hr className="my-2 border-t-2" />
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="step-1">
            <AccordionTrigger>ステップ 1: 新規登録を選択</AccordionTrigger>
            <AccordionContent>
              新規登録選択後、入力フォームが表示されます。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="step-2">
            <AccordionTrigger>ステップ 2: 情報を入力</AccordionTrigger>
            <AccordionContent>
              必要な情報（サモナー名、タグ、OPGGのURL）を入力します。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="step-3">
            <AccordionTrigger>ステップ 3: 登録</AccordionTrigger>
            <AccordionContent>
              登録ボタンを選択して、サモナーを登録します。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">お問い合わせ</h2>
        <hr className="my-2 border-t-2" />
        <p className="mt-4">
          ご質問、フィードバック、または機能リクエストがありましたら、以下の方法でお問い合わせください
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 mt-4">
          <Button variant="outline">
            <a href={DEVELOPER_X} target="_blank" rel="noopener noreferrer">
              X
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
