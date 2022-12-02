# Install dependencies only when needed
FROM node:19-alpine AS deps

WORKDIR /app 
COPY package.json package-lock.json ./ 

ENV NODE_TLS_REJECT_UNAUTHORIZED 0
RUN npm config set strict-ssl false
RUN npm i -s --omit=dev

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]