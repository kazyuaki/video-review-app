FROM node:24-alpine

WORKDIR /app

# Alpine Linuxで一部のNode.jsパッケージを動かすために使用
RUN apk add --no-cache libc6-compat

# Next.jsの匿名利用統計を無効化
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]