FROM node:22.14.0-alpine

# ワークディレクトリを設定
WORKDIR /frontend

# 依存関係ファイルのみをコピーし、キャッシュを利用したインストールを高速化
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN yarn install

# すべてのソースコードをコピー
COPY . .

# 開発サーバーのポートを公開
EXPOSE "5173"

# 開発サーバーをホストオプション付きで起動
CMD ["npm", "run", "dev", "--host"]