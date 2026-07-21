import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner } from '@hanzo/gui'
import { Callback } from './auth/callback'
import { PublicLanding } from './views/public-landing'
import { Shell } from './views/shell'
import { ink, magenta } from './theme'

/**
 * Top-level route + auth gate — no router dependency (one static SPA):
 *   /auth/callback  → finish the PKCE exchange, then land home
 *   signed out      → the public pressroom landing (the honest pre-auth view)
 *   signed in       → the shell (Home / Releases / Tour / Admin over Base)
 */
export function App() {
  const { isAuthenticated, isLoading } = useIam()

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <Callback />
  }
  if (isLoading) {
    return (
      <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" backgroundColor={ink}>
        <Spinner size="large" color={magenta} />
      </YStack>
    )
  }
  return isAuthenticated ? <Shell /> : <PublicLanding />
}
