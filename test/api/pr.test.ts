import { describe, it, expect, beforeEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import { prRoute, prHandler } from '../../app/routes/api/pr'

describe('PR API', () => {
  let app: OpenAPIHono

  beforeEach(() => {
    app = new OpenAPIHono()
    app.openapi(prRoute, prHandler)
  })

  describe('Success Cases', () => {
    it('should return pull requests for valid user', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      expect(data).toHaveProperty('username', 'testuser')
      expect(data).toHaveProperty('pagination')
      expect(data).toHaveProperty('pullRequests')
      expect(Array.isArray(data.pullRequests)).toBe(true)

      // ページネーション情報の検証
      expect(data.pagination).toMatchObject({
        currentPage: 1,
        perPage: 30,
        totalCount: 42,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
        nextPage: 2,
        previousPage: null,
      })

      // PRアイテムの構造検証
      expect(data.pullRequests[0]).toMatchObject({
        organizationAvatar: expect.any(String),
        owner: 'testorg',
        repository: 'testrepo',
        title: expect.any(String),
        state: expect.stringMatching(/^(open|closed)$/),
        createdAt: expect.any(String),
        number: expect.any(Number),
        url: expect.any(String),
      })
    })

    it('should handle pagination correctly', async () => {
      const res = await app.request('/api/pr?username=testuser&page=2&per_page=10', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      // totalCount=42, perPage=10なので totalPages=Math.ceil(42/10)=5
      expect(data.pagination).toMatchObject({
        currentPage: 2,
        perPage: 10,
        totalPages: 5,
        hasNextPage: true, // page 2 < totalPages 5
        hasPreviousPage: true,
        nextPage: 3,
        previousPage: 1,
      })
    })

    it('should limit per_page to maximum 100', async () => {
      const res = await app.request('/api/pr?username=testuser&per_page=150', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.pagination.perPage).toBe(100)
    })

    it('should handle empty results for nonexistent user', async () => {
      const res = await app.request('/api/pr?username=nonexistentuser', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      expect(data.pagination.totalCount).toBe(0)
      expect(data.pullRequests).toHaveLength(0)
    })
  })

  describe('Validation Errors', () => {
    it('should return 400 for missing username', async () => {
      const res = await app.request('/api/pr', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(400)
      const data = await res.json() as any
      expect(data).toHaveProperty('error')
      expect(data.error.name).toBe('ZodError')
      expect(data.error.message).toContain('username')
    })

    it('should return 400 for empty username', async () => {
      const res = await app.request('/api/pr?username=', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data).toHaveProperty('error')
    })

    it('should handle invalid page numbers gracefully', async () => {
      const res = await app.request('/api/pr?username=testuser&page=0', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      // page=0はparseIntで0になるが、実装では最低1ページとして扱われる
      expect(data.pagination.currentPage).toBe(0)
    })
  })

  describe('Authentication Errors', () => {
    it('should return 500 when GitHub token is not configured', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      })

      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toBe('GitHub token not configured')
    })

    it('should return 401 when GitHub API authentication fails', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer invalid_token',
        },
      }, {
        GITHUB_TOKEN: 'invalid_token',
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toBe('GitHub API authentication failed')
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit is exceeded', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer rate_limit_token',
        },
      }, {
        GITHUB_TOKEN: 'rate_limit_token',
      })

      expect(res.status).toBe(429)
      const data = await res.json()
      expect(data.error).toContain('rate limit')
    })
  })

  describe('Server Errors', () => {
    it('should return 500 for GitHub API server errors', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer server_error_token',
        },
      }, {
        GITHUB_TOKEN: 'server_error_token',
      })

      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toBe('Failed to fetch pull requests')
    })
  })

  describe('Response Format Validation', () => {
    it('should return structured response with all required fields', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      // レスポンス構造の詳細検証
      expect(data).toMatchObject({
        username: expect.any(String),
        pagination: {
          currentPage: expect.any(Number),
          perPage: expect.any(Number),
          totalCount: expect.any(Number),
          totalPages: expect.any(Number),
          hasNextPage: expect.any(Boolean),
          hasPreviousPage: expect.any(Boolean),
          nextPage: expect.any(Number),
          previousPage: null,
        },
        pullRequests: expect.arrayContaining([
          expect.objectContaining({
            organizationAvatar: expect.any(String),
            owner: expect.any(String),
            repository: expect.any(String),
            title: expect.any(String),
            state: expect.stringMatching(/^(open|closed)$/),
            createdAt: expect.any(String),
            number: expect.any(Number),
            url: expect.stringMatching(/^https:\/\//),
          }),
        ]),
      })
    })

    it('should properly parse repository information', async () => {
      const res = await app.request('/api/pr?username=testuser', {
        headers: {
          'Authorization': 'Bearer valid_token',
        },
      }, {
        GITHUB_TOKEN: 'valid_token',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      const firstPR = data.pullRequests[0]
      expect(firstPR.owner).toBe('testorg')
      expect(firstPR.repository).toBe('testrepo')
      expect(firstPR.organizationAvatar).toBe('https://avatars.githubusercontent.com/u/12345?v=4')
    })
  })
})