FROM node:20-alpine
WORKDIR /app

COPY package.json ./
# package-lock.json がある場合は npm ci、無い場合は npm install にフォールバック
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

COPY src ./src
COPY tests ./tests

ENV PORT=3000
EXPOSE 3000
CMD ["node","src/server.js"]
