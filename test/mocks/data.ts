// GitHub APIのモックデータ

export const mockUser = {
  login: 'testuser',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
}

export const mockPullRequests = {
  total_count: 42,
  items: [
    {
      number: 123,
      title: 'Add new feature for user authentication',
      state: 'open' as const,
      created_at: '2024-01-15T10:30:00Z',
      html_url: 'https://github.com/testorg/testrepo/pull/123',
      repository_url: 'https://api.github.com/repos/testorg/testrepo',
      user: mockUser,
    },
    {
      number: 122,
      title: 'Fix bug in API response handling',
      state: 'closed' as const,
      created_at: '2024-01-14T15:45:00Z',
      html_url: 'https://github.com/testorg/testrepo/pull/122',
      repository_url: 'https://api.github.com/repos/testorg/testrepo',
      user: mockUser,
    },
    {
      number: 121,
      title: 'Update documentation',
      state: 'open' as const,
      created_at: '2024-01-13T09:20:00Z',
      html_url: 'https://github.com/anotherorg/anotherrepo/pull/121',
      repository_url: 'https://api.github.com/repos/anotherorg/anotherrepo',
      user: mockUser,
    },
  ],
}

export const mockPullRequestsPage2 = {
  total_count: 42,
  items: [
    {
      number: 120,
      title: 'Refactor database queries',
      state: 'closed' as const,
      created_at: '2024-01-12T14:30:00Z',
      html_url: 'https://github.com/testorg/testrepo/pull/120',
      repository_url: 'https://api.github.com/repos/testorg/testrepo',
      user: mockUser,
    },
  ],
}

export const mockEmptyResponse = {
  total_count: 0,
  items: [],
}

export const mockErrorResponses = {
  rateLimitError: {
    message: 'API rate limit exceeded for user.',
    documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
  },
  unauthorizedError: {
    message: 'Bad credentials',
    documentation_url: 'https://docs.github.com/rest',
  },
  notFoundError: {
    message: 'Not Found',
    documentation_url: 'https://docs.github.com/rest',
  },
  validationError: {
    message: 'Validation Failed',
    errors: [
      {
        resource: 'Search',
        field: 'q',
        code: 'missing',
      },
    ],
    documentation_url: 'https://docs.github.com/rest/reference/search',
  },
}