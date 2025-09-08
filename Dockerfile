FROM node:24-alpine3.21 AS build

ARG DATABASE_URL
ARG PORT
ARG ALLOWED_ORIGINS
ARG CSRF_SECRET
ARG JWT_SECRET
ARG JWT_REFRESH_SECRET
ARG EMAIL_USER
ARG EMAIL_PASS
ARG PRODUCTION

ENV DATABASE_URL=$DATABASE_URL
ENV PORT=$PORT
ENV ALLOWED_ORIGINS=$ALLOWED_ORIGINS
ENV CSRF_SECRET=$CSRF_SECRET
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
ENV EMAIL_USER=$EMAIL_USER
ENV EMAIL_PASS=$EMAIL_PASS
ENV PRODUCTION=$PRODUCTION

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:24-alpine3.21 AS runner

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
