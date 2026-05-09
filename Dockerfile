# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ── Stage 2: Serve (production-only, no dev tooling) ─────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only the built output and the minimal deps needed to run vite preview
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 5174

CMD ["npm", "run", "start"]
