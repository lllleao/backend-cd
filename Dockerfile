FROM node:24-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps && \
    npm cache clean --force

COPY . .

RUN npx prisma generate && \
    npm run build


FROM node:24-alpine3.21 AS runner

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
