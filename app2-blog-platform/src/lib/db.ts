import { PrismaClient } from '@prisma/client'

// Next.js の開発環境では Hot Reload のたびに新しい PrismaClient が生成されてしまう問題を防ぐ
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ポイント: 開発環境で HMR が走るたびに new PrismaClient() が呼ばれると DB 接続が枯渇します。
// globalThis にキャッシュすることで1つのインスタンスを使い回します。
// これは Next.js × Prisma の定番パターンです。