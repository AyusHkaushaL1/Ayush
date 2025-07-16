# -------- Build Stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies early for caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Only copy what's needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
