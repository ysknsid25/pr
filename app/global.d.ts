import type {} from 'hono'

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      GITHUB_TOKEN: string
    }
  }
}
