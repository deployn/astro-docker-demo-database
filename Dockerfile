FROM node:20-alpine AS base

WORKDIR /app

# Nur package.json und package-lock.json kopieren für effizienteres Caching
COPY package.json package-lock.json ./

# Produktionsabhängigkeiten installieren
FROM base AS prod-deps
RUN npm install --omit=dev

# Entwicklungsabhängigkeiten für Build installieren
FROM base AS build-deps
RUN npm install

# Build-Phase
FROM build-deps AS build
COPY . .
RUN npm run build

# Runtime-Phase
FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Umgebungsvariablen setzen
ENV HOST=0.0.0.0
ENV PORT=4321

# Port freigeben
EXPOSE 4321

# Server starten
CMD node ./dist/server/entry.mjs
