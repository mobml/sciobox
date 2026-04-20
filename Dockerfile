# ---------- 1. Build frontend ----------
FROM node:20-slim AS frontend
WORKDIR /app

COPY sciobox-web/ .
RUN npm install
RUN npm run build


# ---------- 2. Build backend ----------
FROM golang:1.25-alpine AS backend
WORKDIR /app

COPY backend/ .
RUN go mod download
RUN go build -o app ./cmd


# ---------- 3. Final image ----------
FROM alpine:latest
WORKDIR /app

# copy compiled backend
COPY --from=backend /app/app .

# copy compiled frontend
COPY --from=frontend /app/dist ./dist

# puerto
EXPOSE 3000

# ejecutar
CMD ["./app"]