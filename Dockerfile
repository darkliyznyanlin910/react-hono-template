# Stage 1: Build
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++ gcc
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

WORKDIR /repo

COPY . .
RUN pnpm install

# Build the project
RUN pnpm build

# Stage 2: Run
FROM node:22-alpine AS runner
WORKDIR /repo

COPY --from=builder /repo/dist /repo/dist

EXPOSE 4000
CMD ["node", "./dist/index.cjs"]