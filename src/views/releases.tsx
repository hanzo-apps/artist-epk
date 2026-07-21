import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, Text, Spinner } from '@hanzo/gui'
import { SectionLabel, CoverArt, GhostButton, Empty } from '../components'
import type { Release } from '../lib/records'
import { fmtDate, openUrl } from '../lib/format'
import { text, faint } from '../theme'

/** Discography — a rhythmic grid of cover art, each with a streaming link. */
export function Releases() {
  const { data, isLoading, error } = useQuery<Release>('releases', {
    sort: '-release_date',
    realtime: false,
  })

  return (
    <YStack paddingVertical="$7" gap="$1">
      <SectionLabel>Discography</SectionLabel>
      {isLoading ? (
        <Spinner color="#ff2d9b" />
      ) : error ? (
        <Empty>Couldn’t reach Base ({error.message}). Confirm you’re signed in.</Empty>
      ) : data.length === 0 ? (
        <Empty>No releases yet — add one from the Admin tab.</Empty>
      ) : (
        <XStack flexWrap="wrap" gap="$5">
          {data.map((r, i) => (
            <YStack key={r.id} width={220} gap="$3">
              <CoverArt uri={r.cover_url} index={i} size={220} />
              <YStack gap="$1">
                <Text color={faint} fontSize={11} letterSpacing={2} textTransform="uppercase">
                  {r.kind} · {fmtDate(r.release_date)}
                </Text>
                <Text color={text} fontSize={18} fontWeight="700">
                  {r.title}
                </Text>
              </YStack>
              <GhostButton onPress={() => openUrl(r.stream_url)}>Listen ▶</GhostButton>
            </YStack>
          ))}
        </XStack>
      )}
    </YStack>
  )
}
