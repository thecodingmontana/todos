declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    username: string
    avatar: string
  }
  interface UserSession {
    user?: {
      id: string
      email: string
      username: string
      avatar: string
    }
    sessionToken?: string
  }
}
export {}
