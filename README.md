# My Profile

Sukemaru のプロフィールサイト。

URL: https://sukemaru.net/

## 開発

Zola **0.23.6** を使用します。GitHub Actions も同じバージョンです。

```sh
brew install zola
zola --version
zola serve --extra-watch-path data
```

http://127.0.0.1:1111/ と http://127.0.0.1:1111/blogs/ で確認できます。
`--extra-watch-path data` は一覧データの編集もライブリロードへ反映するための指定です。
`zola serve` では GA4 を読み込みません。

```sh
zola check
zola build
```

生成先は `public/`。ビルドに Deno / Node.js / Rust の追加導入は不要です。
`zola check` はテンプレートから生成する外部リンクや画像までは検証しないので、
両ページの表示・リンク・画像もブラウザで確認してください。

## コンテンツの編集

| ファイル | 内容 |
| --- | --- |
| `data/works.toml` | 職歴。画面で使うのは `[[list]]` |
| `data/personalDevelopment.toml` | 個人開発一覧 |
| `data/blogs.toml` | 外部記事へのリンク一覧。画面では日付の降順 |
| `content/_index.md` | トップのページタイトル |
| `content/blogs/_index.md` | Blogs のページタイトルとテンプレート指定 |
| `templates/` | Tera 2 のテンプレート・共通コンポーネント |
| `static/style.css`、`static/reset.css` | スタイル |
| `static/_assets/`、`static/icons/` | 画像・スクリプト・アイコン |

一覧を追加する場合は、それぞれの TOML に `[[list]]` を追加します。

```toml
[[list]]
title = "記事タイトル"
date = "2026-10-17"
url = "https://example.com/article"
```

日付は引用符付きの `"YYYY-MM-DD"` にしてください。
職歴の `endDate` は終了していなければ項目ごと省略します（「現在」と表示）。
説明文中の `\n` は保持されますが、表示上は従来どおり通常の空白として扱います。
複数行文字列を使う場合は、不要な先頭・末尾の改行を追加しないようにしてください。

`works.toml` は画面で使う `[[list]]` だけを管理します。
未使用だった旧 `[[works]]` とテスト用の `title` は削除済みです。
`data/` のファイル自体は公開しません。

TOML を編集 → ローカルで表示確認 → PR 作成、の順で更新します。

## 公開

`main` への push で `.github/workflows/deploy.yml` が check / build を行い、
`public/` を GitHub Pages に公開します。PR では検証と成果物保存のみを行います。

CI で直接使う Action は GitHub 公式の `actions/*` のみとし、完全なコミット SHA で固定。
Zola は `.github/scripts/install-zola.sh` が公式 Release の v0.23.6 を取得し、
リポジトリに固定した SHA-256 を検証してから実行します。
この導入方式はユーザー承認済みです。今後の CI ツール追加・取得方法の変更も採用前に確認します。
スクリプトは Ubuntu x86_64 の CI 専用で、macOS で実行する必要はありません。

PR の `zola-preview` artifact は本番 URL を含む生成物の確認用です。
ローカルでの画面確認には `zola serve --extra-watch-path data` を使ってください。

`zola.toml` の `base_url` は `https://sukemaru.net`。
Pages の Custom domain・HTTPS・DNS はそのまま維持します。
測定 ID を変更する場合は `zola.toml` の `extra.ga4_id` と
`static/_assets/ga4.js` の両方を更新してください。

## 移行レビュー

[移行計画と進捗](PLAN_zola.md) / [ローカル検証結果](REVIEW_zola.md)

旧 `src/`、`_config.ts`、`_cms.ts`、`deno.json` は削除済みです。
移行前の実装・データ・配信設定は Git 履歴から参照・復元できます。
