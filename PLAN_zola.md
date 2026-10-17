# Lume → Zola 移行計画

作成日: 2026-10-17

## 目的と方針

現在のスタイル・表示内容・リンク・画像・計測を維持して、静的サイトの生成を
Lume / Deno から Zola に置き換える。既存テーマは導入せず、現在の HTML と CSS を
Tera テンプレートに移植する。

公開先は同じリポジトリの GitHub Pages を継続する。デプロイはビルド環境と
成果物ディレクトリを変更し、現在のドメイン・DNS・HTTPS 設定を維持する。
ホスティングやドメインの移管は今回の移行に含めない。

ローカル実装と検証を完了し、ユーザーレビュー済み（2026-10-17）。
ユーザー導入の Zola 0.23.6 で動作確認済み。承認された公式配布方式で CI を実装済み。
workflow から直接参照する Action は GitHub 公式のみ・完全なコミット SHA で固定。
ユーザー依頼により `migrate-zola` ブランチで PR を作成する。
Works の最新情報を同じ PR に追加してから、ユーザーが main に反映する予定。
本番公開・GitHub / DNS 設定変更は未実施。
検証結果とレビュー方法は [REVIEW_zola.md](REVIEW_zola.md) を参照。
ユーザー許可により旧 Lume 構成・生成物・キャッシュを削除済み。
未使用だった `works.toml` の `[[works]]` とテスト用 `title` も削除し、
画面で使う `[[list]]` を保持した。移行前の実装とデータは Git 履歴から復元する。

## 現状の棚卸し

以下の棚卸しと移植手順は移行前の記録。旧ファイルは掃除済み。
当初はリポジトリと手元の `_site/` を確認した。`_site/` は過去の生成物のため、
実装時には現行ソースの再ビルド結果・本番表示とも比較する。

| 対象 | 現状 | 移行時の扱い |
| --- | --- | --- |
| 生成環境 | Lume 3.2.2、Deno、JSX / Vento | Zola、Tera に置換 |
| トップ | `src/index.page.tsx` → `/` | 個人開発・Works の表示を維持 |
| ブログ一覧 | `src/blogs.page.tsx` → `/blogs/` | 外部記事へのリンク一覧を維持 |
| 共通レイアウト | `src/_includes/layout.tsx`、BodyLayout、Title | 共通テンプレート・部分テンプレートへ |
| スタイル | `src/style.css`、`src/reset.css`、各コンポーネントの CSS | すべて移植。読み込み順・優先順位も比較 |
| データ | `src/posts/` の JSON 3 ファイル | 全フィールドを保持して `data/*.toml` に変換 |
| プロフィール | `src/_assets/profile.png` | 公開パス `/_assets/profile.png` を維持 |
| アイコン | Lume icons プラグイン生成の SVG 3 点 | 同じ SVG を静的ファイルとして保持 |
| favicon | Lume favicon プラグインが生成 | 生成済み ICO / PNG を静的ファイルとして保持 |
| GA4 | `src/_assets/ga4.js`、共通レイアウトのタグ | 測定 ID `G-EDV6N0DZYS` と読込を維持 |
| 著作権年 | ビルド時の現在年 | Tera でもビルド時の現在年を出力 |
| CMS | `_cms.ts` に Lume CMS 設定あり | 利用実態を確認して編集方法を移行 |
| 配信 | `.github/workflows/deploy.yml` | GitHub Actions → Pages の流れを継続 |

### コンテンツを欠落させないための注意点

- 現在の表示件数は Works 4 件、個人開発 1 件、Blogs 4 件。
  移行中に内容が更新された場合は、切替直前のソースを基準に再確認する。
- `works.json` は `title`・`works`・`list` を持ち、現在の画面が参照するのは
  `list`。`works` には異なる説明文もある。移行時はファイル全体を保持し、
  表示は引き続き `list` を使う。重複データの整理は別作業にする。
- Works の `url`・`techs` など、現在表示していないフィールドも保持する。
- JSON → TOML の変換では日本語・改行・URL・省略されているフィールドをそのまま保つ。
  説明文の改行を `<br>` に変えるなどの表示変更は加えない。
- Blogs は内部記事本文を持たない外部リンク一覧。外部サイトの記事本文を
  コピーしたり、記事ごとの内部ページを新設したりする必要はない。
- `NoteIcon` はソースにあるが現在のフッターでは未使用。
  移行時も素材を保管し、画面には追加しない。

## 1. 着手前の記録

- [x] 移行用ブランチ `migrate-zola` を作り、移行前コミットと正常な Pages デプロイを記録。
- [x] 現行の `deno task build` と生成物のローカル配信で表示を確認。
  既存環境で起動できない場合は本番表示を記録し、比較用ビルドの復元を先に行う。
- [ ] `/` と `/blogs/` の PC・スマートフォンのスクリーンショットを保存。
- [x] `_site/` のファイル一覧と HTML・CSS・生成画像を比較用に退避。
  退避先は公開対象の `static/` の外にする。
- [x] Pages API で Source、Custom domain、Enforce HTTPS を確認・記録。
  現在の workflow は `main` push で公開する構成。
- [ ] Settings で Environment の保護ルールを確認。
- [ ] DNS 管理画面で現在の apex / www のレコードを記録する。
- [x] ユーザーの旧構成削除許可により、Lume CMS 設定も撤去。更新は TOML 直接編集。

### 本番ドメインの確認

移行前の `_config.ts` は `https://sukemaru.net/`、README は
`https://www.sukemaru.net` を指していた。2026-10-17 に Pages API と HTTP / DNS を
確認し、正規 URL を `https://sukemaru.net/` と確定した。
Pages は Custom domain = `sukemaru.net`、HTTPS 有効、workflow 配信。
www から apex への 301 → 200 を確認。README と Zola 設定も apex に統一済み。
DNS 管理画面の設定保存は本番切替前のユーザー確認として残す。

切替前に次を実行し、最終 URL とステータスを記録する。

```sh
curl -IL https://sukemaru.net/
curl -IL https://www.sukemaru.net/
curl -IL https://sukemaru.net/blogs
curl -IL https://sukemaru.net/blogs/
dig +short sukemaru.net A
dig +short sukemaru.net AAAA
dig +short www.sukemaru.net CNAME
```

Pages に設定済みのドメインと本番の最終転送先を照合し、Zola の `base_url` を
一致させる。今回を機に www 有無を変更しない。`/blogs` の転送も維持する。

## 2. ローカル準備（ユーザー作業）

macOS では以下を実行する。Homebrew 自体が未導入なら先に導入する。

```sh
brew install zola
zola --version
zola --help
```

導入後のバージョンを本書・README に記録し、CI でも同じバージョンを明示する。
Homebrew 更新でローカルだけバージョンが変わった際も、CI と差がないか確認する。
Rust / Cargo、Node.js、Deno を Zola 本体のために追加導入する計画はない。
旧サイトとの比較が終わるまでは既存の Deno 環境を残す。
[公式インストール手順](https://www.getzola.org/documentation/getting-started/installation/)

## 3. Zola の構成を追加

既存リポジトリ直下に設定・ディレクトリを手動で追加する。
すでにファイルのある場所へ `zola init --force` を実行しない。

```text
zola.toml
content/
  _index.md
  blogs/
    _index.md
data/
  works.toml
  personalDevelopment.toml
  blogs.toml
templates/
  base.html
  index.html
  blogs.html
  partials/
    nav.html
    profile.html
    footer.html
  components/
    title.html
static/
  reset.css
  style.css
  favicon.ico
  apple-touch-icon.png
  _assets/
    profile.png
    ga4.js
  icons/
    note.svg                 # 未使用素材も保管
    ant/
      github-outlined.svg
      facebook-outlined.svg
      x-outlined.svg
public/                     # 生成物。Git 管理しない
```

- [x] `zola.toml` に確認済みの `base_url` を設定。
- [x] 日本語を既定言語とし、初期移行では Sass・検索・feed を有効化しない。
- [x] sitemap / robots.txt の自動生成について現行との差分を確認し、
  同等性を優先する初回は明示的に無効化する。SEO 改善は後続で扱う。
- [x] `content/_index.md` に `title = "sukemaru|aboutme"` を設定。
- [x] `content/blogs/_index.md` に `title = "sukemaru|blogs"` と
  `template = "blogs.html"` を設定し、`/blogs/index.html` を出力。
- [x] 設定ファイル名は採用する Zola で確認する。現在の公式資料は
  `zola.toml` を使用しており、旧名 `config.toml` はフォールバックとして扱われる。

[公式設定リファレンス](https://www.getzola.org/documentation/getting-started/configuration/)

## 4. データ・テンプレート・アセットの移植

### データと表示処理

- [x] JSON 3 ファイルを、全フィールドと値を保持して `data/*.toml` に変換する。
  `data/` は Zola が自動認識する専用フォルダではなく、このサイト独自の置き場所。
  Tera の `load_data(path="data/works.toml")` などで明示的に読む。
  公開用の `static/` や記事用 `content/` には置かない。
- [x] 一覧は `[[list]]`、既存の別配列 `works` は `[[works]]` として保持する。
  `title` などのルート項目は配列テーブルより前に置く。
- [x] 日付は元の JSON と同じ文字列型（例: `"2025-05-12"`）を維持する。
  TOML の日付型への変更や、欠けている `endDate` の補完は行わない。
- [x] 説明文に複数行文字列を使う場合、先頭・末尾の改行やインデントを
  意図せず追加・削除しない。変換前後をそれぞれパースして、キー・値・型・
  配列順序・件数の一致を確認する。JSON のキー順序や空白の違いは比較対象にしない。
- [x] Works / 個人開発は元の配列順を維持。
- [x] Blogs は `list` を `date` で降順ソート。
  現状の ISO 日付文字列で順序が一致することを確認。
- [x] 日付処理を dayjs から Tera の日付フォーマットへ置換。
  Works は `YYYY.MM`、終了日なしは「現在」、Blogs は `YYYY/MM/DD`。
  `endDate` 自体が存在しない場合にもエラーにならない分岐を用意する。
- [x] Tera のエスケープで日本語・URL・説明文が元と同じ表示になるか確認。
  TOML の文字列を一律 `safe` にせず、テキストとして出力する。

一覧データは手で編集しやすくコメントも書ける TOML に統一する。
現在の Blogs は外部リンク一覧として `data/blogs.toml` で管理し、将来サイト内に
記事本文を持つ場合は、その記事を `content/blogs/*.md` と front matter で管理する。

### レイアウトとスタイル

- [x] `base.html` に head、ナビゲーション、プロフィール、フッター、GA4 を移植。
- [x] トップと Blogs の HTML 要素・class・階層・リンク属性を維持する。
  Title の `<h2 class="head-title">` も Tera 2 コンポーネントで再現。
- [x] `reset.css` を先、`style.css` を後に読む構成を維持。
- [x] `src/style.css` に加えて BodyLayout / Title の CSS も移植する。
  Lume の生成済み `_site/style.css` と照合し、適用順を再現して
  `static/style.css` にまとめる。ルートの CSS だけコピーして完了にしない。
- [x] 背景 `#dcf5f5`、見出し `#008b8b`、余白、プロフィール画像のサイズと角丸、
  フッターのアイコンサイズを比較する。
- [x] 600px のメディアクエリと、長い URL の折り返しを維持。
- [x] CSS の既存簡易 minify はビルド依存から外す。初回は見た目の一致を優先し、
  圧縮によるテキスト差分と実際のスタイル欠落を区別して確認する。

### 画像・アイコン・計測

- [x] `profile.png` と `ga4.js` は公開パスを変えずコピーする。
- [x] 現行ソースを再ビルドして得た favicon、apple-touch-icon、SVG 3 点を
  `static/` に取り込み、Git 管理する。以後 Lume の生成処理は不要にする。
  `_site/` が古い・欠けている場合は、現行のビルド設定から再生成して確定する。
- [x] 未使用の NoteIcon は SVG 素材として保管し、不要と判断するまでは削除しない。
- [x] favicon と apple-touch-icon の `<link>` を `base.html` に明記。
- [x] GitHub / Facebook / X のリンク先と `target` / `rel` を保持。
- [x] GA4 の外部スクリプト、ローカル初期化、測定 ID を移植。
  ページごとに初期化が重複しないことを確認する。
- [x] 著作権年は現在年をビルド時に生成し、表記を維持。

Tera のデータ読み込み・テンプレート構成は
[公式テンプレート資料](https://www.getzola.org/documentation/templates/overview/)
を参照する。

### CMS の扱い

- [x] コンテンツは TOML を直接編集して Git に反映する運用を README に記載。
- [x] ユーザーの削除許可に基づき、旧 Lume CMS 設定 `_cms.ts` を撤去。

## 5. ローカル検証

実装後にリポジトリ直下で実行する。

```sh
zola check
zola build
zola serve --extra-watch-path data
```

通常の開発 URL は `http://127.0.0.1:1111`。
検証は現行 Lume 版と同じブラウザ・同じ画面幅で行う。

- [x] PC 1440px、スマートフォン 390px、600px 前後で `/` と `/blogs/` を比較。
- [x] 文言・件数・並び順・日付・余白・色・改行・フッターに欠落や意図しない差がない。
- [x] `/blogs`、`/blogs/`、ナビからの遷移、直接アクセス、再読み込みを確認。
  最終的な転送は GitHub Pages 公開後にも確認する。
- [x] 画像・SVG・favicon・apple-touch-icon・CSS・JS の HTTP エラーがない。
- [x] ページタイトル、description、viewport、GA4 タグが保持されている。
- [x] 元の JSON と変換後の TOML をパースした結果が全フィールドで一致し、
  データファイルが `public/` に不用意に公開されていない。
- [ ] 生成 HTML の外部リンクも開いて確認する。
  `zola check` はテンプレート内のリンクを検査しないため、TOML 由来のリンクや
  アセットの確認をこれだけで済ませない。
- [ ] 外部リンク検査だけが相手先の制限等で失敗する場合は原因を記録し、
  必要に応じ `zola check --skip-external-links` と手動確認を併用。
- [ ] スクリーンショットを PR に添付し、CSS 差分を確認。

[公式 CLI リファレンス](https://www.getzola.org/documentation/getting-started/cli-usage/)

## 6. デプロイを Zola に変更

既存の `.github/workflows/deploy.yml` を更新する。
GitHub Pages への artifact 配信方式を継続し、`gh-pages` ブランチ方式へ変更しない。
[Zola の GitHub Pages 配信資料](https://www.getzola.org/documentation/deployment/github-pages/)

| 項目 | 現在 | 移行後 |
| --- | --- | --- |
| インストール | `denoland/setup-deno@v2` | Zola をバージョン指定で導入 |
| ビルド | `deno task build` | `zola check` → `zola build` |
| artifact | `_site` | `public` |
| 配信 | `actions/deploy-pages` | 継続 |
| 公開契機 | `main` push | 継続 |
| ドメイン / DNS | 現在の Pages 設定 | 維持 |

### CI 導入方式（ユーザー承認済み）

CI の Action・ツールを新規採用する前に、提供元・取得元・固定バージョン・
検証方法を示してユーザーに確認する。GitHub 公式 `actions/*` と Zola 公式の
配布元を優先する。公式であることだけで安全性を保証するものではない。

`taiki-e/install-action` は第三者が開発する汎用ツール導入 Action。
先の案では Zola 導入に使ったが、ユーザー未確認のため撤回した。
この Action を使った workflow の実行・push はしていない。

2026-10-17 にユーザー承認を得て、次の構成を実装した。

| 処理 | 提供元 / 使用 Action | 扱い |
| --- | --- | --- |
| checkout | GitHub `actions/checkout` | 既存 Action を継続。公式リポジトリの完全なコミット SHA を確認・固定済み |
| Zola 導入 | Zola 公式 `getzola/zola` の Release | v0.23.6 の Linux x86_64 バイナリを直接取得。SHA-256 を固定し、検証後に実行 |
| Pages 準備・成果物・公開 | GitHub `actions/configure-pages` / `actions/upload-pages-artifact` / `actions/deploy-pages` | 既存 Action を継続。公式リポジトリの完全なコミット SHA を確認・固定済み |
| PR 用成果物 | GitHub `actions/upload-artifact` | ユーザー承認後に追加。完全なコミット SHA で固定済み |

Zola 取得元:
`https://github.com/getzola/zola/releases/download/v0.23.6/zola-v0.23.6-x86_64-unknown-linux-gnu.tar.gz`

GitHub の [公式 Release の配布ファイル一覧](https://github.com/getzola/zola/releases/expanded_assets/v0.23.6)
で確認した SHA-256:
`8f5132b3522412d04e395e0b25f6d68613ad272a873e54a2b3ebf664873024a4`

両 workflow は `.github/scripts/install-zola.sh` を呼び出す。
導入処理は Ubuntu x86_64 runner 上で OS 標準の curl / sha256sum / tar を使用。
チェックサムが一致しない場合は展開・実行せず失敗させ、バージョン一致も確認する。
導入先は runner の一時ディレクトリ。ローカル macOS へのインストールは行わない。

```yaml
- name: Install official Zola release
  run: bash .github/scripts/install-zola.sh
```

固定した Action SHA の一覧・確認結果は [REVIEW_zola.md](REVIEW_zola.md) を参照。
公式 Linux 配布アーカイブを一時取得し、固定 SHA-256 との一致と内容を確認済み。
PR の GitHub Actions で Linux 上の導入・check / build が成功済み。
本番デプロイは main へのマージ後に確認する。

- [x] 上記の Action と公式配布バイナリ導入方法についてユーザー確認を得る。
- [x] 了承後に Ubuntu runner、Action の SHA、権限を確定し workflow を実装する。
- [x] ビルド job は `contents: read` のみとし、Pages 書込権限は deploy job に限定。
- [x] `zola check` → `zola build` → `public/` の artifact を配信。
- [x] deploy job に `github-pages` environment と deployment URL を設定。
- [x] Pages の同時公開を避ける concurrency を設定する。
- [x] PR はデプロイせず check / build と成果物の保存だけを行う。
- [x] PR の GitHub Actions で導入・check / build 成功を確認。本番切替は別途確認。

### ドメインを保つための条件

同じリポジトリ・同じ Pages 公開先を使い続ければ、生成ツール変更を理由とする
DNS 変更は通常不要。Settings → Pages の Custom domain と Enforce HTTPS を
維持し、切替時に削除・再登録しない。

カスタム GitHub Actions workflow で公開する場合、`CNAME` ファイルは不要で、
存在していても無視される。ファイルの追加をドメイン維持策とせず、Pages 側の
設定と DNS を確認する。apex / www の転送も設定がそろっているかを確認する。
[GitHub 公式のカスタムドメイン手順](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 7. 本番切替と復旧

1. 比較用スクリーンショット、ローカル検証、PR の CI 成功をそろえる。
2. 移行前のコミット SHA、正常デプロイ、Pages / DNS 設定の記録を確認。
3. Zola 実装と workflow の変更を `main` に取り込み、Pages デプロイ完了を確認。
4. 実際の本番ドメインで `/` と `/blogs/`、www 有無の転送、HTTPS、
   アセット、外部リンクを再確認。キャッシュの影響は強制再読み込みでも確認。
5. GA4 のリアルタイム等で本番アクセスを確認する。
   拡張機能や同意設定による通信ブロックと実装不具合を切り分ける。
6. 問題があれば移行変更を revert し、Lume のソースと workflow をまとめて復元して
   再デプロイする。分割コミットなら関連変更をすべて戻す。
   DNS や Custom domain は動かさない。

過去 workflow の再実行は artifact の保存期限等に左右されるため、
基本の復旧方法は旧ソースと旧 workflow の復元・再ビルドにする。
旧 Lume 版が再ビルドできることも切替前に確認しておく。

## 8. 移行後の整理と完了条件

- [x] ユーザー許可により、旧 `src/`、`_config.ts`、`_cms.ts`、`deno.json` を削除。
  Zola に参照がないことを確認し、移植済みの画像・アイコン・計測と表示データを保持。
- [x] `.gitignore` に `public/` を追加。不要な `_site/`・`_cache/` とその除外設定を削除。
- [x] README を `zola serve` / `zola check` / `zola build`、
  TOML 編集方法、採用バージョン、公開手順、確認済みドメインに更新。
- [x] `AGENTS.md` の Lume 固有の構成・コマンド・検証方法を Zola 用に更新。
  Tera / CSS / TOML の整形方針も記載し、不要な整形ツールは追加しない。
- [x] Zola 用ファイルのみのクリーンな一時ディレクトリで check / build が成功。
- [x] ページ・元の JSON の全データ・画像・スタイル・リンク・計測が引き継がれている。
- [ ] 同じドメインと既存 URL で公開でき、DNS / HTTPS / www 転送に退行がない。
- [ ] `main` push の Zola ビルドから Pages 公開まで成功している。

## 作業時に埋める記録

| 項目 | 値 |
| --- | --- |
| 採用 Zola バージョン | 0.23.6（ローカル・承認済み CI とも固定） |
| 正規の本番 URL / base_url | https://sukemaru.net/（Pages API と HTTP 転送で確認済み） |
| 移行前コミット SHA / 正常デプロイ | `863621d2ab9b28826714318885fed03dd8dfecd3` / [成功した旧デプロイ](https://github.com/sukemaru-injp/lume-profile/actions/runs/23980018327) |
| 比較結果 | `REVIEW_zola.md`。画面画像は会話内で確認、ファイル保存は未実施 |
| 移行後の編集方法 | TOML 直接編集。旧 CMS 設定はユーザー許可により削除済み |
| 本番切替日 / Zola デプロイ | 未実施 |

## 実装時の補足（2026-10-17）

- ローカルレビュー後、ユーザー依頼により `migrate-zola` ブランチで PR 化。
  `data/works.toml` の `[[list]]` 更新を同じブランチへ追加する。
- Zola 0.23 系は Tera 2 を使うため、見出しの共通化にはマクロではなく
  `templates/components/title.html` のコンポーネントを採用した。
  [Tera 2 のコンポーネント資料](https://keats.github.io/tera/#components)
- `zola serve --extra-watch-path data` で TOML の監視を追加し、編集反映を確認済み。
- GA4 は production build 時に含め、serve 時は読み込まない。
- Zola が追加する標準 `404.html` と未使用 `icons/note.svg` を除き、
  既存の公開ファイルのパスを維持。サイト内リンクは `get_url` で生成する。
- PR の GitHub Actions は成功済み。Pages / DNS 設定の変更と本番アクセスでの
  GA4 確認は未実施。旧構成の削除はユーザーレビュー・許可後に実施。

### CI 方針の訂正

2026-10-17、ユーザーから「GitHub Actions のツールは採用前に確認し、
できるだけ GitHub 公式などに近いものを使用する」と指示あり。
第三者製 `taiki-e/install-action` を使用する変更を撤回し、デプロイ workflow は
Git の移行前内容へ復元、追加した PR workflow は削除した。
サイトの Zola 実装・ローカル検証結果は維持。
その後ユーザー承認を得て、上記の GitHub 公式 Action・Zola 公式配布方式で
workflow を実装し、PR CI の成功を確認した。本番切替は main マージ後に確認する。

### 旧構成・未使用データの掃除

ユーザー許可により、旧 `src/`、`_config.ts`、`_cms.ts`、`deno.json`、
Lume の生成先 `_site/` とキャッシュ `_cache/` を削除。
`data/works.toml` は未使用の `[[works]]` とテスト用ルート `title` を削除し、
`[[list]]` の全フィールド・順序を保持した。
掃除前後の Zola 出力 13 ファイルがバイト単位で一致し、表示・アセットに差分がないことを確認済み。
