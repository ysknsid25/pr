import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { prRoute, prHandler } from './routes/api/pr'

// HonoXアプリを作成
const app = createApp()

// OpenAPI用のアプリを作成
const apiApp = new OpenAPIHono()

// PR APIルートを登録
apiApp.openapi(prRoute, prHandler)

// OpenAPI specification
apiApp.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'GitHub PR Tracker API',
    description: 'API for tracking GitHub pull requests with infinite scroll support',
  },
  tags: [
    {
      name: 'Pull Requests',
      description: 'GitHub pull request operations',
    },
  ],
})

// Swagger UI
apiApp.get('/ui', swaggerUI({ url: '/doc' }))

// APIアプリをメインアプリにマウント
app.route('/', apiApp)

showRoutes(app)

export default app
