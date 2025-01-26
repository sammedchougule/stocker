export type User = {
    id: string
    email?: string
    user_metadata?: {
      [key: string]: any
    }
    app_metadata?: {
      [key: string]: any
    }
    aud: string
    created_at: string
  }
  
  