import type { ReactNode } from 'react'
import { YStack, XStack, H1, Paragraph, Text } from '@hanzo/gui'
import { Eyebrow, Chip, CoverArt } from '../components'
import { artist } from '../content'
import { text, dim, magenta } from '../theme'

/**
 * The identity block — oversized artist name, hook, bio and the spotlit cover
 * art. Shared by the public landing and the signed-in Home tab; pass the latest
 * release's `cover` + `tag` to make the artwork real once the catalogue exists.
 */
export function Hero({
  cover, tag, actions,
}: { cover?: string; tag?: string; actions?: ReactNode }) {
  return (
    <XStack flexWrap="wrap" gap="$8" alignItems="center" justifyContent="space-between">
      <YStack gap="$4" flex={2} minWidth={300} maxWidth={620}>
        <Eyebrow>{artist.eyebrow}</Eyebrow>
        <H1
          color={text}
          fontWeight="900"
          letterSpacing={-2}
          fontSize={46}
          lineHeight={46}
          $sm={{ fontSize: 74, lineHeight: 70 }}
          $lg={{ fontSize: 94, lineHeight: 88 }}
        >
          {artist.name}
        </H1>
        <Text color={magenta} fontSize={19} fontWeight="600" letterSpacing={0.2}>
          {artist.hook}
        </Text>
        <Paragraph color={dim} fontSize={16} lineHeight={25} maxWidth={540}>
          {artist.bio}
        </Paragraph>
        <XStack flexWrap="wrap" gap="$2">
          {artist.genres.map((g) => (
            <Chip key={g}>{g}</Chip>
          ))}
        </XStack>
        {actions ? (
          <XStack flexWrap="wrap" gap="$3" marginTop="$3">
            {actions}
          </XStack>
        ) : null}
      </YStack>
      <YStack flex={1} minWidth={260} alignItems="center">
        <CoverArt uri={cover} size={300} label={tag ?? 'LIVE SET'} lit index={2} />
      </YStack>
    </XStack>
  )
}
