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
    <div className="container p-10 space-y-6">
      <h1 className="text-4xl font-semibold">Tips</h1>
      <hr className="my-2 border-t-2" />

      <section className="mt-10">
        <div className="my-4">
          <h2 className="text-2xl font-semibold">■ ミニオンに関する情報</h2>
        </div>
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
                <div className="space-y-1">
                  <p>90秒</p>
                  <p>15分以降は60秒</p>
                  <p>25分以降は30秒</p>
                </div>
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
      <section className="mt-10">
        <div className="my-4">
          <h2 className="text-2xl font-semibold">■ ドラゴンに関する情報</h2>
        </div>
        <section>
          <div className="my-4">
            <h2 className="text-xl font-semibold">各ドラゴンの出現と備考</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>種類</TableHead>
                  <TableHead>初回出現時間</TableHead>
                  <TableHead>出現間隔</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell rowSpan={1}>ヘクステックドレイク</TableCell>
                  <TableCell rowSpan={6}>5:00</TableCell>
                  <TableCell rowSpan={6}>5m</TableCell>
                  <TableCell>
                    スキルヘイストが7.5/15/22.5/30、ASが7.5/15/22.5/30%増加
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>ケミテックドレイク</TableCell>
                  <TableCell>
                    行動妨害耐性が5/10/15/20%、体力回復効果とシールド効果が5/10/15/20%増加
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>インファーナルドレイク</TableCell>
                  <TableCell>ADとAPが5/10/15/20%増加</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>マウンテンドレイク</TableCell>
                  <TableCell>ARとMRが8/16/24/32%増加</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>クラウドドレイク</TableCell>
                  <TableCell>
                    スロウ耐性と非戦闘時のMSが7/14/21/28%増加
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>オーシャンドレイク</TableCell>
                  <TableCell>5秒毎に減少HPの2.5/5/7.5/9%を回復</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
        <section className="mt-10">
          <div className="my-4">
            <h2 className="text-xl font-semibold">各ドラゴンソウルの備考</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>種類</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell rowSpan={1}>ヘクステックソウル</TableCell>
                  <TableCell>
                    <div>
                      <p>
                        建物を除く敵への攻撃が電撃を発生させ、対象とその周囲3体までの敵に20-75(Lvに応じて)の確定ダメージと2秒かけて減衰するslowを与える(CD:
                        8s)
                      </p>
                      <p>
                        slow: 近接40% | 遠隔30% +((3%増加AD)
                        +(1%AP)+(0.5%増加HP) )%
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>ケミテックソウル</TableCell>
                  <TableCell>
                    体力が50%未満の場合に、被ダメージを13%軽減し、与ダメージが13%増加する効果を得る
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>インファーナルドレイク</TableCell>
                  <TableCell>
                    建物を除く敵への攻撃が爆発を発生させ、対象とその周囲の全ての敵にアダプティブダメージ(自分の装備によって物理or魔法になるDM)を与える(CD:
                    3s)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>マウンテンソウル</TableCell>
                  <TableCell>
                    <div>
                      <p>5秒間ダメージを受けずにいるとシールドを獲得する</p>
                      <p>
                        シールド耐久値: 200+(18%増加AD)+(13.5%AP)+(13.5%増加HP)
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>クラウドソウル</TableCell>
                  <TableCell>
                    移動速度が15%上昇するアルティメットスキル使用後6秒間は、さらに移動速度が50%上昇する(CD30秒)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1}>オーシャンソウル</TableCell>
                  <TableCell>
                    <div>
                      <p>
                        建物を除く敵にダメージを与えると、4秒かけてHPとマナを回復する
                      </p>
                      <p>
                        対象がミニオンまたはモンスターの場合は効果が30%に減少する
                      </p>
                      <p>
                        回復HP: 200+(36%増加AD)+(22.5%AP)+(9%増加HP) 回復マナ:
                        80+(3.5%最大MN)
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </section>
    </div>
  );
}
