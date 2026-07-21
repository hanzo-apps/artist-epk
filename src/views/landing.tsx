import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, Text, Paragraph, Spinner } from '@hanzo/gui'
import { Hero } from './hero'
import { SectionLabel, Panel, CoverArt, PrimaryButton, GhostButton, Empty } from '../components'
import type { Release, PressAsset } from '../lib/records'
import { fmtDate, openUrl } from '../lib/format'
import { artist } from '../content'
import { text, dim, faint, magenta } from '../theme'

/** Signed-in Home — hero over the latest release, biography and press kit. */
export function Landing() {
  const releases = useQuery<Release>('releases', { sort: '-release_date', realtime: false })
  const press = useQuery<PressAsset>('press_assets', { sort: '-created', realtime: false })
  const latest = releases.data[0]

  return (
    <YStack gap="$9" paddingVertical="$7">
      <Hero cover={latest?.cover_url} tag={latest ? 'LATEST' : 'LIVE SET'} />

      <YStack>
        <SectionLabel>Latest release</SectionLabel>
        {releases.isLoading ? (
          <Spinner color={magenta} />
        ) : latest ? (
          <Panel>
            <XStack gap="$5" flexWrap="wrap" alignItems="center">
              <CoverArt uri={latest.cover_url} size={168} lit label="LATEST" index={2} />
              <YStack gap="$2" flex={1} minWidth={220}>
                <Text color={faint} fontSize={12} letterSpacing={2} textTransform="uppercase">
                  {latest.kind} · {fmtDate(latest.release_date)}
                </Text>
                <Text color={text} fontSize={30} fontWeight="800" letterSpacing={-0.5}>
                  {latest.title}
                </Text>
                <XStack marginTop="$3">
                  <PrimaryButton onPress={() => openUrl(latest.stream_url)}>Listen</PrimaryButton>
                </XStack>
              </YStack>
            </XStack>
          </Panel>
        ) : (
          <Empty>No releases yet — add your first from the Admin tab.</Empty>
        )}
      </YStack>

      <YStack>
        <SectionLabel>Biography</SectionLabel>
        <Paragraph color={dim} fontSize={17} lineHeight={27} maxWidth={720}>
          {artist.bio}
        </Paragraph>
      </YStack>

      <YStack>
        <SectionLabel>Press kit</SectionLabel>
        {press.isLoading ? (
          <Spinner color={magenta} />
        ) : press.data.length === 0 ? (
          <Empty>No press assets yet — add downloadable links from the Admin tab.</Empty>
        ) : (
          <YStack gap="$2">
            {press.data.map((a) => (
              <Panel key={a.id}>
                <XStack alignItems="center" justifyContent="space-between" gap="$4" flexWrap="wrap">
                  <Text color={text} fontSize={16} fontWeight="600">
                    {a.label}
                  </Text>
                  <GhostButton onPress={() => openUrl(a.file_url)}>Download</GhostButton>
                </XStack>
              </Panel>
            ))}
          </YStack>
        )}
      </YStack>
    </YStack>
  )
}
