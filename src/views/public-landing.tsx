import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, Text } from '@hanzo/gui'
import { Screen, Wordmark, PrimaryButton, GhostButton, CoverArt, SectionLabel, Chip } from '../components'
import { Hero } from './hero'
import { artist } from '../content'
import { faint, dim } from '../theme'

/**
 * The signed-out landing — the public face of the pressroom and the honest
 * pre-auth thumbnail. Shows the artist hero, streaming presence and a decorative
 * discography grid; the real catalogue + management live behind Hanzo sign-in.
 */
export function PublicLanding() {
  const { login, isLoading } = useIam()

  return (
    <Screen>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$5"
        paddingVertical="$4"
        maxWidth={1180}
        width="100%"
        alignSelf="center"
      >
        <Wordmark />
        <GhostButton onPress={() => login()}>Sign in</GhostButton>
      </XStack>

      <YStack
        paddingHorizontal="$5"
        paddingTop="$7"
        paddingBottom="$9"
        maxWidth={1180}
        width="100%"
        alignSelf="center"
        gap="$9"
      >
        <Hero
          actions={
            <>
              <PrimaryButton onPress={() => login()} disabled={isLoading}>
                {isLoading ? 'Loading…' : 'Enter the pressroom'}
              </PrimaryButton>
              <GhostButton onPress={() => login()}>For press</GhostButton>
            </>
          }
        />

        <XStack flexWrap="wrap" gap="$2" alignItems="center">
          <Text color={faint} fontSize={12} letterSpacing={2} textTransform="uppercase" marginRight="$2">
            Streaming on
          </Text>
          {artist.streaming.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </XStack>

        <YStack>
          <SectionLabel>Discography</SectionLabel>
          <XStack flexWrap="wrap" gap="$4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <YStack key={i} gap="$2" alignItems="center">
                <CoverArt index={i} size={148} />
                <Text color={faint} fontSize={12} letterSpacing={2}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      </YStack>

      <XStack
        borderTopWidth={1}
        borderColor="rgba(255,45,155,0.14)"
        paddingHorizontal="$5"
        paddingVertical="$5"
        maxWidth={1180}
        width="100%"
        alignSelf="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap="$3"
      >
        <Text color={dim} fontSize={14}>
          Your press kit, one link.
        </Text>
        <Text color={faint} fontSize={13}>
          Pressroom · built on Hanzo
        </Text>
      </XStack>
    </Screen>
  )
}
