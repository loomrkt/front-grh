FROM node:20-alpine as base

RUN apk add --no-cache libc6-compat

WORKDIR /base 

COPY package.json ./

RUN yarn

FROM node:20-alpine as builder

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXTAUTH_SECRET=tLvWSgJpanrxdRmb2mQKcuNzJAzaU6D2n5EEKhkbK4U=
ENV AUTH_SECRET=tLvWSgJpanrxdRmb2mQKcuNzJAzaU6D2n5EEKhkbK4U=
ENV NEXT_PUBLIC_BASE_API_URL=https://back.gemlabconsulting.com/api
ENV NEXT_PUBLIC_BASE_FILE_URL=https://back.gemlabconsulting.com/upload
ENV NEXTAUTH_URL=https://app.gemlabconsulting.com


WORKDIR /build

COPY --from=base /base/node_modules ./node_modules
COPY src ./src
COPY public ./public
COPY package.json ./
COPY eslint.config.mjs ./eslint.config.mjs
COPY tsconfig.json ./tsconfig.json
COPY postcss.config.mjs ./postcss.config.mjs
COPY components.json ./components.json
COPY .env ./

RUN echo -e 'import type { NextConfig } from "next";\n\nconst nextConfig = {\n  eslint: {\n    ignoreDuringBuilds: true,\n  },\n  typescript: {\n    ignoreBuildErrors: true,\n  },\n  output: "standalone",\n  webpack: (config) => {\n    config.resolve.fallback = {\n      canvas: false,\n    };\n    return config;\n  },\n};\n\nmodule.exports = nextConfig;' > ./next.config.ts


RUN yarn build

FROM node:20-alpine AS runner

EXPOSE 3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /build/public ./public
COPY --from=builder --chown=nextjs:nodejs /build/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
