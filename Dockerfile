FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node index.js ./
COPY --chown=node:node controllers ./controllers
COPY --chown=node:node models ./models
COPY --chown=node:node routes ./routes
ENV NODE_ENV=production PORT=8000
USER node
EXPOSE 8000
CMD ["node", "index.js"]