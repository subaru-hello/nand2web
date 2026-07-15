---
name: ship
description: nand2web の検証つき一括デプロイ。「デプロイして」「ship して」「本番反映」と言われたら発火。typecheck → lint → test → deploy（build + prerender + wrangler deploy）を順に実行し、途中で失敗したらそこで止めて結果を報告する。
---

# /ship — 検証つき一括デプロイ（nand2web）

以下を**この順で**実行する。失敗した段階で止め、失敗出力をそのまま見せる（deploy まで進めない）。

```sh
pnpm -r typecheck
biome ci .
pnpm -r test
pnpm deploy   # = pnpm build && pnpm prerender && wrangler deploy
```

## 注意

- `pnpm deploy` が build と prerender を内包している（`package.json` の scripts 参照）。個別に build を先行実行しない
- wrangler の設定は `wrangler.jsonc`。デプロイ先の環境を変える指示があったときだけ `--env` を付ける
- deploy 完了後は wrangler の出力にある URL を報告し、可能なら主要ページの動作確認（HTTP 200）まで行う
- テストが env 依存で落ちる場合は、スキップせずユーザーに判断を仰ぐ（--force での強行はしない）
