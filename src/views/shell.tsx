import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, Button, Text } from '@hanzo/gui'
import { Screen, Wordmark } from '../components'
import { Landing } from './landing'
import { Releases } from './releases'
import { Tour } from './tour'
import { Admin } from './admin'
import { text, dim, magenta, line } from '../theme'

type Tab = 'home' | 'releases' | 'tour' | 'admin'

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'releases', label: 'Releases' },
  { id: 'tour', label: 'Tour' },
  { id: 'admin', label: 'Admin' },
]

/** Signed-in shell — top nav switches the four views; no router, one SPA. */
export function Shell() {
  const { logout } = useIam()
  const [tab, setTab] = useState<Tab>('home')

  return (
    <Screen>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap="$3"
        paddingHorizontal="$5"
        paddingVertical="$4"
        borderBottomWidth={1}
        borderColor={line}
        maxWidth={1180}
        width="100%"
        alignSelf="center"
      >
        <Wordmark />
        <XStack gap="$1" flexWrap="wrap">
          {TABS.map((t) => (
            <Button
              key={t.id}
              onPress={() => setTab(t.id)}
              chromeless
              height={38}
              paddingHorizontal={14}
              borderRadius={10}
              backgroundColor={tab === t.id ? 'rgba(255,45,155,0.14)' : 'transparent'}
              hoverStyle={{ backgroundColor: 'rgba(255,45,155,0.08)' }}
            >
              <Text color={tab === t.id ? magenta : dim} fontWeight={tab === t.id ? '700' : '500'} fontSize={14}>
                {t.label}
              </Text>
            </Button>
          ))}
        </XStack>
        <Button
          onPress={() => logout()}
          height={38}
          paddingHorizontal={16}
          borderRadius={10}
          borderWidth={1}
          borderColor={line}
          backgroundColor="transparent"
          hoverStyle={{ borderColor: magenta }}
        >
          <Text color={text} fontSize={14} fontWeight="600">
            Sign out
          </Text>
        </Button>
      </XStack>

      <YStack paddingHorizontal="$5" maxWidth={1180} width="100%" alignSelf="center">
        {tab === 'home' ? <Landing /> : null}
        {tab === 'releases' ? <Releases /> : null}
        {tab === 'tour' ? <Tour /> : null}
        {tab === 'admin' ? <Admin /> : null}
      </YStack>
    </Screen>
  )
}
