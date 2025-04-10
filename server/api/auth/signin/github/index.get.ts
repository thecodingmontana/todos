import type { H3Event } from 'h3'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onSuccess(event: H3Event, { user }: any) {
    await authenticateOauthUser({
      providerName: 'github',
      providerUserEmail: user.email,
      providerUserId: user.node_id,
      providerUsername: user.name,
      providerAvatar: user.avatar_url,
    }, event)
    return sendRedirect(event, '/todos')
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError(event: H3Event, error: any) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
