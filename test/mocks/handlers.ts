import { http, HttpResponse } from 'msw'
import { mockPullRequests, mockPullRequestsPage2, mockEmptyResponse, mockErrorResponses } from './data'

export const handlers = [
  http.get('https://api.github.com/search/issues', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    const page = url.searchParams.get('page') || '1'
    const perPage = url.searchParams.get('per_page') || '30'

    // 認証ヘッダーのチェック
    const authorization = request.headers.get('Authorization')

    // パラメータのバリデーション
    if (!query) {
      return HttpResponse.json(mockErrorResponses.validationError, { status: 422 })
    }

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return HttpResponse.json(mockErrorResponses.unauthorizedError, { status: 401 })
    }

    // エラー条件の判定（認証後）
    const token = authorization.replace('Bearer ', '')

    // レート制限のテスト用
    if (token === 'rate_limit_token') {
      return HttpResponse.json(mockErrorResponses.rateLimitError, { status: 403 })
    }

    // 無効なトークンのテスト用
    if (token === 'invalid_token') {
      return HttpResponse.json(mockErrorResponses.unauthorizedError, { status: 401 })
    }

    // サーバーエラーのテスト用
    if (token === 'server_error_token') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

    // 存在しないユーザーのテスト用
    if (query.includes('author:nonexistentuser')) {
      return HttpResponse.json(mockEmptyResponse, { status: 200 })
    }

    // ページネーションのテスト - page=2の場合は少ないアイテム数で調整
    if (page === '2') {
      const adjustedResponse = {
        ...mockPullRequestsPage2,
        total_count: 42, // 総数は同じ
      }
      return HttpResponse.json(adjustedResponse, { status: 200 })
    }

    // per_pageの制限テスト
    const numPerPage = parseInt(perPage, 10)
    if (numPerPage > 100) {
      return HttpResponse.json({
        ...mockPullRequests,
        items: mockPullRequests.items.slice(0, 100),
      }, { status: 200 })
    }

    // デフォルトの成功レスポンス
    return HttpResponse.json(mockPullRequests, { status: 200 })
  }),
]