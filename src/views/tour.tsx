import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, Text, Spinner } from '@hanzo/gui'
import { SectionLabel, Panel, PrimaryButton, Empty } from '../components'
import type { Show } from '../lib/records'
import { dayOf, monthOf, openUrl } from '../lib/format'
import { text, dim, faint, magenta } from '../theme'

/** Tour — upcoming shows only (past dates fall off), a date ticker per row. */
export function Tour() {
  const { data, isLoading, error } = useQuery<Show>('shows', { sort: 'date', realtime: false })
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = data.filter((s) => s.date >= today)

  return (
    <YStack paddingVertical="$7" gap="$1">
      <SectionLabel>On tour</SectionLabel>
      {isLoading ? (
        <Spinner color={magenta} />
      ) : error ? (
        <Empty>Couldn’t reach Base ({error.message}). Confirm you’re signed in.</Empty>
      ) : upcoming.length === 0 ? (
        <Empty>No upcoming shows — add tour dates from the Admin tab.</Empty>
      ) : (
        <YStack gap="$3">
          {upcoming.map((s) => (
            <Panel key={s.id}>
              <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$4">
                <XStack alignItems="center" gap="$4" flex={1} minWidth={240}>
                  <YStack alignItems="center" minWidth={58}>
                    <Text color={magenta} fontSize={24} fontWeight="800" lineHeight={26}>
                      {dayOf(s.date)}
                    </Text>
                    <Text color={faint} fontSize={12} letterSpacing={1.5}>
                      {monthOf(s.date)}
                    </Text>
                  </YStack>
                  <YStack gap="$1">
                    <Text color={text} fontSize={18} fontWeight="700">
                      {s.venue}
                    </Text>
                    <Text color={dim} fontSize={14}>
                      {s.city}
                    </Text>
                  </YStack>
                </XStack>
                <PrimaryButton onPress={() => openUrl(s.ticket_url)}>Tickets</PrimaryButton>
              </XStack>
            </Panel>
          ))}
        </YStack>
      )}
    </YStack>
  )
}
