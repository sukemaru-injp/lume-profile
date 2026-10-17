# Zola 移行のレビュー

2026-10-17。Zola 0.23.6 で実装・ローカル検証済み。
ユーザーレビュー済み。依頼により `migrate-zola` ブランチで PR 化します。
Works の最新情報を同じ PR に追加した後、ユーザーが main に反映する予定です。
本番公開は未実施です。
ユーザー承認後、GitHub 公式 Action と Zola 公式配布ファイルの直接取得で CI を更新済み。
[PR の CI](https://github.com/sukemaru-injp/lume-profile/actions/runs/39025477025) は成功済み。
本番切替は未実施です。

## 画面の確認

```sh
zola serve --extra-watch-path data
```

- トップ: http://127.0.0.1:1111/
- Blogs: http://127.0.0.1:1111/blogs/

作業中に起動したサーバーが動いていれば、そのまま上記 URL を開けます。
TOML 編集は `data/`、表示・スタイル編集は `templates/` と `static/` です。
レビュー時は両ページの文言・余白・スマートフォン表示・リンク先を確認してください。

## 変更内容

- Lume の JSX / Vento を Tera 2 のテンプレートと共通コンポーネントへ移植。
- JSON 3 ファイルを TOML に変換。移行時に全フィールドを検証した上で、
  ユーザー許可により未使用の旧 `works` 配列とテスト用 `title` を削除。
  表示に使う `list` は全フィールド・順序を保持。
- 元の CSS 3 ファイルを適用順に統合。reset CSS を先に読み込む構成も維持。
- プロフィール画像、SVG、favicon、apple-touch-icon、GA4 JS を静的ファイル化。
  未使用の NoteIcon も SVG として保管。
- 日付形式・終了日なしの「現在」・ブログ日付の降順・著作権年を再現。
- production build の GA4 を維持し、serve では計測スクリプトを省略。
- UTF-8 宣言・日本語の lang・画像の alt を追加。見た目には影響しない変更。
- サイト内 URL は Zola の `get_url` で生成。Blogs のナビは `/blogs/` を指す。
- Zola 標準の `404.html` が追加される。sitemap / robots / feed / 検索は無効。
- Zola 0.23.6 → `public/` → GitHub Pages の workflow と、公開しない PR 検証を実装。
  CI ツールの採用前確認方針と承認済み構成を README / AGENTS に記載。

## 検証結果

| 確認 | 結果 |
| --- | --- |
| 旧 Lume の再ビルド | `deno task build` 成功。11 ファイル生成 |
| Zola の検証・ビルド | `zola check` / `zola build` 成功 |
| 旧環境に依存しないビルド | 設定・content・data・templates・static のみを一時ディレクトリにコピーして check / build 成功 |
| データ変換 | 移行時に元 JSON と TOML の全フィールド一致を検証。その後未使用項目を整理し、表示用 list の全フィールドと順序の一致を再確認 |
| ページ内容 | 両ページの正規化 DOM・文言が一致。追加メタ情報・URL の表現・GA4 の配置差を除外して比較 |
| PC / モバイル比較 | 幅 1440 / 390 / 600 / 601px で両ページを比較。全表示要素の位置・サイズ・主要スタイル・末端テキストが一致 |
| 画像等 | 既存の PNG / ICO / SVG / JS は旧出力とバイト単位で一致。ブラウザの画像読み込みも成功 |
| HTTP | `/`・`/blogs`・`/blogs/` と CSS / JS / 画像 / favicon 全件で 200 |
| データの再読み込み | TOML に一時的に一覧項目を追加して serve の反映を確認し、その後元に復元。Blogs 4 件に戻っていることも確認 |
| GA4 の出力 | production の両ページに読込タグ・初期化スクリプト各 1 回。serve には出力されない |
| 公開範囲 | 出力に TOML / JSON / TSX / Vento が含まれない |
| workflow | YAML と shell の構文確認済み。直接参照する Action が GitHub 公式かつ完全な SHA 固定であること、既定権限が読取のみであることも検証。PR の Zola CI 成功済み |
| ブラウザコンソール | Zola 版に error / warn なし |

比較用の旧 HTML は GitHub Pages と同じ UTF-8 で配信するため、退避コピーにのみ
charset 宣言を補いました。この補完は元ソースや `_site/` には適用していません。
スクリーンショットは会話内で表示確認済み。Chrome ツールの保存先制約により
画像ファイルはリポジトリに保存していません。

## 承認済み CI の取得元と固定値

workflow から直接参照する Action は下記の GitHub 公式 Action のみ。
SHA は各公式リポジトリの API で対象タグから解決して確認した。

| Action | 参照タグ | 固定したコミット SHA |
| --- | --- | --- |
| `actions/checkout` | v6 | `d23441a48e516b6c34aea4fa41551a30e30af803` |
| `actions/configure-pages` | v5 | `983d7736d9b0ae728b81ab479565c72886d7745b` |
| `actions/upload-pages-artifact` | v4 | `7b1f4a764d45c48632c6b24a0339c27f5614fb0b` |
| `actions/deploy-pages` | v4 | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` |
| `actions/upload-artifact` | v4 | `ea165f8d65b6e75b540449e92b4886f43607fa02` |

Zola は [開発元の v0.23.6 Release](https://github.com/getzola/zola/releases/tag/v0.23.6)
から Linux x86_64 用アーカイブを直接取得する。SHA-256 は
[公式配布一覧](https://github.com/getzola/zola/releases/expanded_assets/v0.23.6)
掲載の `8f5132b3522412d04e395e0b25f6d68613ad272a873e54a2b3ebf664873024a4` に固定。
実ファイルを一時ダウンロードし、この値との一致・実行可能な x86_64 ELF の格納を確認した。
macOS 上で Linux バイナリのインストールや実行はしていない。

`.github/scripts/install-zola.sh` は `bash -n` で構文検証済み。
Ubuntu 24.04 の runner で checksum と Zola バージョンを検証してから PATH に追加する。
ビルド・PR 検証は `contents: read`、Pages 書込 / OIDC 権限は deploy job のみ。
Pages 設定を読み取る `configure-pages` も deploy job で実行する。
checkout の認証情報の保持も無効化している。

## ドメイン・復旧の記録

- 移行前コミット: `863621d2ab9b28826714318885fed03dd8dfecd3`
- [成功済みの旧デプロイ](https://github.com/sukemaru-injp/lume-profile/actions/runs/23980018327)
- Pages API: `cname = sukemaru.net`、`https_enforced = true`、`build_type = workflow`
- HTTP: `https://sukemaru.net/` は 200、www は apex へ 301 → 200。
- DNS: apex A は GitHub Pages の 4 アドレス、www CNAME は
  `sukemaru-injp.github.io`。AAAA の回答はなし。
- GitHub / DNS の設定は変更していません。
- 旧出力の比較用コピー: `/private/tmp/lume-zola-baseline-863621d`。
  一時ディレクトリのため長期保管用ではありません。

## レビュー後・本番切替時に残る確認

- [x] ユーザーによるローカル画面のレビュー。
- [ ] ユーザーが `data/works.toml` の `[[list]]` を最新情報に更新し、同じ PR へ追加。
- [x] ユーザーの掃除許可に基づき旧 CMS 設定を削除し、TOML 直接編集へ移行。
- [ ] 本番切替前に DNS 管理画面の設定と Pages environment の保護ルールを確認。
- [x] CI の Action / ツール導入案についてユーザー確認を得て実装。
- [ ] PR の GitHub Actions 成功、必要に応じレビュー画像を添付。
- [ ] `main` への反映後、実際の Pages 公開、www 転送、`/blogs` の転送、HTTPS を確認。
- [ ] 本番アクセスで GA4 の実計測を確認。ローカルではタグ出力までの検証。
- [ ] 外部サイトのリンクを実際に開いて確認。移行前後の URL 一致は確認済みだが、
  すべての外部サイトの応答・ログイン要否までは検証していない。
- [x] ユーザー許可により旧 `src/`・Lume / Deno 設定・生成物・キャッシュを削除。

旧構成は削除済みです。移行前コミットの Git 履歴から比較・復旧できます。
Zola 版の編集対象は `data/*.toml` です。
本番切替後に問題があれば、移行前のソースと workflow をまとめて復元して再公開します。

## Works の更新を同じ PR に追加する方法

ローカルは `migrate-zola` ブランチに切り替え済みです。
`data/works.toml` の `[[list]]` を編集し、画面を確認してから次を実行します。
未使用だった `[[works]]` とテスト用の `title` は削除済みです。

```sh
git branch --show-current
zola check
zola build
git add data/works.toml
git commit -m update
git push
```

push すると同じ PR が更新され、PR 用の check / build が実行されます。
その後 main へマージすると、main push を契機に Pages のデプロイが開始します。
デプロイ完了後に https://sukemaru.net/ の反映を確認してください。

## 旧 Lume 構成の削除

ユーザー許可に基づき `src/`、`_config.ts`、`_cms.ts`、`deno.json`、
ローカルの `_site/`・`_cache/` と不要になった ignore 設定を削除。
`data/works.toml` の旧 `[[works]]` とテスト用ルート `title` も削除した。
掃除前後で表示用 `list` の内容・順序が一致することと、
Zola の全出力 13 ファイルがバイト単位で一致することを確認済み。
旧構成なしで `zola check` / `zola build` も成功。
