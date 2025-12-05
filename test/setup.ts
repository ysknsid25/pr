import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

// MSWサーバーのセットアップ
export const server = setupServer(...handlers)

// テスト開始前にサーバーを起動
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// 各テスト後にハンドラーをリセット
afterEach(() => {
  server.resetHandlers()
})

// すべてのテスト終了後にサーバーを停止
afterAll(() => {
  server.close()
})