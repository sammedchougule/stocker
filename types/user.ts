export type User = {
    id: string
    email?: string
    user_metadata?: {
      [key: string]: string
    }
    app_metadata?: {
      [key: string]: string
    }
    aud: string
    created_at: string
  }
  
  