# Go公式イメージ（最新版を推奨）
FROM golang:1.21

WORKDIR /app

# go.modをコピーして依存解決（go.sumがなくても対応）
COPY go.mod ./
RUN go mod download || true

# ソースコード全体をコピー
COPY . .

# 依存関係を再取得
RUN go mod tidy

# ポート（例: 8080）を開放
EXPOSE 8080

# サーバー起動
CMD ["go", "run", "main.go"]