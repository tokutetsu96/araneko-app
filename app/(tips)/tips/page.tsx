import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TipsPage() {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-semibold">Tips</h1>
      <hr className="my-2 border-t-2" />
      <div>
        <h2 className="text-2xl font-semibold">■ ミニオンに関する情報</h2>
      </div>
      <section className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>種類</TableHead>
              <TableHead>初回出現時間</TableHead>
              <TableHead>出現間隔</TableHead>
              <TableHead>EXP</TableHead>
              <TableHead>備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* メレーミニオン */}
            <TableRow>
              <TableCell rowSpan={1}>メレー</TableCell>
              <TableCell rowSpan={2}>1:05</TableCell>
              <TableCell rowSpan={2}>30秒</TableCell>
              <TableCell>60.45</TableCell>
              <TableCell></TableCell>
            </TableRow>

            {/* レンジミニオン */}
            <TableRow>
              <TableCell rowSpan={1}>レンジ</TableCell>
              <TableCell>29.76</TableCell>
              <TableCell></TableCell>
            </TableRow>

            {/* キャノンミニオン */}
            <TableRow>
              <TableCell rowSpan={1}>キャノン</TableCell>
              <TableCell>2:05</TableCell>
              <TableCell>
                90秒 <br />
                15分以降は60秒 <br />
                25分以降は30秒
              </TableCell>
              <TableCell>93</TableCell>
              <TableCell></TableCell>
            </TableRow>

            {/* スーパーミニオン */}
            <TableRow>
              <TableCell rowSpan={1}>スーパーミニオン</TableCell>
              <TableCell>インヒビター破壊後</TableCell>
              <TableCell>30秒</TableCell>
              <TableCell>97</TableCell>
              <TableCell>近くのミニオンを強化</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
