# Lazy to do staging
# Open port on 1668
# Run on /language-learning-zone

# Tested oven/bun:1.3.9
FROM oven/bun:latest
WORKDIR /app
COPY . .

# Frontend
WORKDIR /app/frontend
RUN bun install

RUN bun run build

WORKDIR /app
# Main
RUN bun install

ENTRYPOINT ["bun"]

CMD ["run", "./src/server.ts"]