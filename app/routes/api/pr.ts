import { createRoute, z } from '@hono/zod-openapi'

// GitHub API レスポンスのスキーマ定義
export const GitHubUserSchema = z.object({
  login: z.string().openapi({
    description: 'GitHub username',
    example: 'octocat'
  }),
  avatar_url: z.string().openapi({
    description: 'GitHub user avatar image URL',
    example: 'https://avatars.githubusercontent.com/u/583231?v=4'
  }),
}).openapi({
  title: 'GitHubUser',
  description: 'GitHub user information'
})

export const GitHubPullRequestItemSchema = z.object({
  number: z.number().openapi({
    description: 'Pull request number',
    example: 42
  }),
  title: z.string().openapi({
    description: 'Pull request title',
    example: 'Add new feature'
  }),
  state: z.enum(['open', 'closed']).openapi({
    description: 'Pull request state',
    example: 'open'
  }),
  created_at: z.string().openapi({
    description: 'Pull request creation date in ISO format',
    example: '2024-01-15T10:30:00Z'
  }),
  html_url: z.string().openapi({
    description: 'Pull request URL on GitHub',
    example: 'https://github.com/owner/repo/pull/42'
  }),
  repository_url: z.string().openapi({
    description: 'Repository API URL',
    example: 'https://api.github.com/repos/owner/repo'
  }),
  user: GitHubUserSchema.nullable().openapi({
    description: 'Pull request author information'
  }),
}).openapi({
  title: 'GitHubPullRequestItem',
  description: 'GitHub pull request item from search results'
})

export const GitHubSearchResponseSchema = z.object({
  total_count: z.number().openapi({
    description: 'Total number of pull requests found',
    example: 150
  }),
  items: z.array(GitHubPullRequestItemSchema).openapi({
    description: 'Array of pull request items'
  }),
}).openapi({
  title: 'GitHubSearchResponse',
  description: 'GitHub search API response for pull requests'
})

export const PRResponseItemSchema = z.object({
  organizationAvatar: z.string().nullable().openapi({
    description: 'Organization or repository owner avatar image URL',
    example: 'https://avatars.githubusercontent.com/u/583231?v=4'
  }),
  owner: z.string().openapi({
    description: 'Repository owner username',
    example: 'github'
  }),
  repository: z.string().openapi({
    description: 'Repository name',
    example: 'docs'
  }),
  title: z.string().openapi({
    description: 'Pull request title',
    example: 'Update documentation for API v2'
  }),
  state: z.enum(['open', 'closed']).openapi({
    description: 'Pull request state (open or closed)',
    example: 'open'
  }),
  createdAt: z.string().openapi({
    description: 'Pull request creation date in ISO format',
    example: '2024-01-15T10:30:00Z'
  }),
  number: z.number().openapi({
    description: 'Pull request number',
    example: 42
  }),
  url: z.string().openapi({
    description: 'Pull request URL on GitHub',
    example: 'https://github.com/github/docs/pull/42'
  }),
}).openapi({
  title: 'PullRequestItem',
  description: 'Formatted pull request information for client consumption'
})

export const PaginationSchema = z.object({
  currentPage: z.number().openapi({
    description: 'Current page number',
    example: 1
  }),
  perPage: z.number().openapi({
    description: 'Number of items per page',
    example: 30
  }),
  totalCount: z.number().openapi({
    description: 'Total number of pull requests found',
    example: 150
  }),
  totalPages: z.number().openapi({
    description: 'Total number of pages',
    example: 5
  }),
  hasNextPage: z.boolean().openapi({
    description: 'Whether there is a next page',
    example: true
  }),
  hasPreviousPage: z.boolean().openapi({
    description: 'Whether there is a previous page',
    example: false
  }),
  nextPage: z.number().nullable().openapi({
    description: 'Next page number (null if no next page)',
    example: 2
  }),
  previousPage: z.number().nullable().openapi({
    description: 'Previous page number (null if no previous page)',
    example: null
  }),
}).openapi({
  title: 'Pagination',
  description: 'Pagination information for infinite scroll support'
})

export const PRListResponseSchema = z.object({
  username: z.string().openapi({
    description: 'GitHub username that was searched',
    example: 'octocat'
  }),
  pagination: PaginationSchema,
  pullRequests: z.array(PRResponseItemSchema).openapi({
    description: 'Array of formatted pull request items'
  }),
}).openapi({
  title: 'PullRequestListResponse',
  description: 'Response containing user pull requests with pagination support for infinite scroll'
})

export const ErrorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'Error message',
    example: 'GitHub API rate limit exceeded'
  }),
  message: z.string().optional().openapi({
    description: 'Detailed error message',
    example: 'You have exceeded the GitHub API rate limit. Please try again later.'
  }),
}).openapi({
  title: 'ErrorResponse',
  description: 'Error response format'
})

// OpenAPI route definition
export const prRoute = createRoute({
  method: 'get',
  path: '/api/pr',
  request: {
    query: z.object({
      username: z.string().min(1).openapi({
        description: 'GitHub username to search pull requests for',
        example: 'octocat'
      }),
      page: z.string().optional().default('1').openapi({
        description: 'Page number for pagination (starts from 1)',
        example: '1'
      }),
      per_page: z.string().optional().default('30').openapi({
        description: 'Number of items per page (maximum 100)',
        example: '30'
      }),
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PRListResponseSchema,
        },
      },
      description: 'Successfully retrieved pull requests list with pagination',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Bad request - invalid parameters',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unauthorized - GitHub API authentication failed',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'User not found',
    },
    429: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Rate limit exceeded',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal server error',
    },
  },
  tags: ['Pull Requests'],
  summary: 'Get user pull requests',
  description: 'Retrieve a paginated list of pull requests created by a specific GitHub user. Supports infinite scroll with pagination.',
})

// Route handler
export const prHandler = async (c: any) => {
  const { username, page: pageStr, per_page: perPageStr } = c.req.valid('query')

  // Transform query parameters
  const page = parseInt(pageStr, 10)
  const perPage = Math.min(parseInt(perPageStr, 10), 100)

  try {
    // GitHub Personal Access TokenはCloudflare Workers環境変数から取得
    const githubToken = c.env?.GITHUB_TOKEN
    if (!githubToken) {
      return c.json({ error: 'GitHub token not configured' }, 500)
    }

    // GitHub Search API を直接呼び出し（ページネーション対応）
    const searchUrl = new URL('https://api.github.com/search/issues')
    searchUrl.searchParams.set('q', `author:${username} type:pr`)
    searchUrl.searchParams.set('sort', 'created')
    searchUrl.searchParams.set('order', 'desc')
    searchUrl.searchParams.set('page', page.toString())
    searchUrl.searchParams.set('per_page', perPage.toString())

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PR-Tracker/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const rawData = await response.json()

    // GitHub APIレスポンスの型検証
    const validationResult = GitHubSearchResponseSchema.safeParse(rawData)
    if (!validationResult.success) {
      console.error('GitHub API response validation failed:', validationResult.error)
      return c.json({
        error: 'Invalid response from GitHub API',
        message: 'Response format validation failed'
      }, 502)
    }

    const pullRequests = validationResult.data

    // 必要な情報を抽出してレスポンス用のデータを作成
    const prList = pullRequests.items.map((pr) => {
      // リポジトリ情報の解析
      const repoUrlParts = pr.repository_url.split('/')
      const owner = repoUrlParts[repoUrlParts.length - 2]
      const repository = repoUrlParts[repoUrlParts.length - 1]

      return {
        // Organization/オーナーのアイコン画像
        organizationAvatar: pr.user?.avatar_url || null,
        // オーナー名
        owner: owner,
        // リポジトリ名
        repository: repository,
        // PRタイトル
        title: pr.title,
        // open/close状態
        state: pr.state,
        // 作成日時
        createdAt: pr.created_at,
        // issue番号（PR番号）
        number: pr.number,
        // PR URL
        url: pr.html_url,
      }
    })

    // ページネーション情報を計算
    const totalCount = pullRequests.total_count
    const totalPages = Math.ceil(totalCount / perPage)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    const responseData = {
      username: username,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalCount: totalCount,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null,
      },
      pullRequests: prList,
    }

    // レスポンスの型検証
    const responseValidation = PRListResponseSchema.safeParse(responseData)
    if (!responseValidation.success) {
      console.error('Response validation failed:', responseValidation.error)
      return c.json({
        error: 'Internal server error',
        message: 'Response format validation failed'
      }, 500)
    }

    return c.json(responseValidation.data)

  } catch (error: any) {
    console.error('GitHub API Error:', error)

    // fetch エラーの場合は status が含まれない場合がある
    const errorMessage = error.message || 'Unknown error'

    // GitHub API のステータスコードベースのエラーハンドリング
    if (errorMessage.includes('403')) {
      return c.json({
        error: 'GitHub API rate limit exceeded or forbidden',
      }, 429)
    }

    if (errorMessage.includes('401')) {
      return c.json({ error: 'GitHub API authentication failed' }, 401)
    }

    if (errorMessage.includes('404')) {
      return c.json({ error: 'User not found' }, 404)
    }

    if (errorMessage.includes('422')) {
      return c.json({
        error: 'Invalid search query or parameters',
        message: errorMessage
      }, 422)
    }

    return c.json({
      error: 'Failed to fetch pull requests',
      message: errorMessage
    }, 500)
  }
}