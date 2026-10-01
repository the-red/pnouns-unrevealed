# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

pNouns NFT のリビール前 SVG を、トークン ID を指定して表示するだけの単一ページアプリ。Next.js 13 (Pages Router) + TypeScript。Vercel にデプロイされている (https://pnouns-unrevealed.vercel.app)。

## コマンド

パッケージマネージャは yarn (v1、`yarn.lock`)。Node は 24 系 (`.tool-versions` と `package.json` の `engines`)。Vercel は `engines` を見て Node バージョンを決める。

```sh
yarn dev      # 開発サーバ (localhost:3000)
yarn build    # 本番ビルド
yarn lint     # next lint (next/core-web-vitals)
yarn prettier --check .   # フォーマット確認 (npm script は未定義、*.md は対象外)
```

テストは存在しない。

## 環境変数

`.env.local` に `NEXT_PUBLIC_ALCHEMY_API_KEY` が必要 (Ethereum mainnet の Alchemy RPC 用)。`NEXT_PUBLIC_` 接頭辞のためクライアントバンドルにも埋め込まれる。これは下記のとおりブラウザから直接 RPC を叩く構成上、意図されたもの。

## アーキテクチャ

SVG はオンチェーンで生成される。`pages/api/contract.ts` の `generateSVGDocument(tokenId)` が web3.js でコントラクト `0x2e5C0BD35995ea7e8903C55ba66f28270310498f` の同名 view 関数を呼び、SVG の XML 文字列を返す。

この関数は 2 か所から使われる:

- `pages/index.tsx` — **クライアント側で直接 import** して呼び出し、結果を base64 の data URI にして `<img>` に表示する。API ルートは経由しない。
- `pages/api/images/[tokenId].ts` — 同じ関数をサーバ側で呼び、`image/svg+xml` として返す。トップページの画像をクリックしたときの別タブ表示先。

注意点:

- `pages/api/contract.ts` は `pages/api/` 配下にあるが default export を持たない共有モジュールで、API ルートとして機能するものではない。ブラウザでも動くコードである必要がある。
- スタイルは Bootstrap 5 の CSS (`_app.tsx` で import) とインライン style が中心。見出しフォント `LondrinaSolid` は `public/fonts/` に置かれ `styles/globals.css` で定義されている。

## コードスタイル

Prettier 設定: セミコロンなし、シングルクォート、`printWidth: 120`。ESLint では `react/jsx-no-target-blank` を `allowReferrer: true` で有効化しているため、`target="_blank"` には `rel="noreferrer"` か `rel="noopener"` を付ける。
