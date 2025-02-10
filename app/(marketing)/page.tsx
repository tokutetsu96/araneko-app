import MotionLabel from "./_components/motion-label";

export default function Home() {
  return (
    <div className="container">
      <MotionLabel />
      <section>
        <div>
          <h1 className="text-3xl font-bold">ようこそ</h1>
          <hr className="my-2 border-t-2" />
        </div>
        <div>
          <p>
            このサイトは、AraNekoが個人で開発したLoL向けの便利ツールサイトです。今後もLoLに関する便利な機能を追加していく予定です。
          </p>
        </div>
      </section>
    </div>
  );
}
