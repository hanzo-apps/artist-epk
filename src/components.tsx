import type { ReactNode } from 'react'
import { YStack, XStack, Text, Input, Button, Image, Circle } from '@hanzo/gui'
import { LinearGradient } from '@hanzo/gui/linear-gradient'
import { artist } from './content'
import {
  ink, panel, magenta, blush, cyan, text, dim, faint, line, glow, hues,
} from './theme'

/** The pressroom mark — a rotated neon lozenge + the artist name, compact. */
export function Wordmark() {
  return (
    <XStack alignItems="center" gap="$2.5">
      <YStack
        width={16}
        height={16}
        borderRadius={4}
        backgroundColor={magenta}
        rotate="45deg"
        shadowColor={glow}
        shadowRadius={12}
        shadowOffset={{ width: 0, height: 0 }}
      />
      <Text color={text} fontSize={15} fontWeight="800" letterSpacing={1}>
        {artist.name}
      </Text>
    </XStack>
  )
}

/** Full-height page base — the deep-violet stage every surface sits on. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={ink}>
      {children}
    </YStack>
  )
}

/** Uppercase kicker with a glowing dot — the small nightlife label. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <XStack alignItems="center" gap="$2">
      <Circle
        size={8}
        backgroundColor={magenta}
        shadowColor={glow}
        shadowRadius={12}
        shadowOffset={{ width: 0, height: 0 }}
      />
      <Text color={dim} fontSize={12} letterSpacing={3} textTransform="uppercase">
        {children}
      </Text>
    </XStack>
  )
}

/** Short magenta rule + uppercase caption — a section heading. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <XStack alignItems="center" gap="$3" marginBottom="$4">
      <YStack width={26} height={2} backgroundColor={magenta} />
      <Text color={magenta} fontSize={13} letterSpacing={3} textTransform="uppercase" fontWeight="700">
        {children}
      </Text>
    </XStack>
  )
}

/** A pill — ghost by default, `solid` for the neon spotlight variant. */
export function Chip({ children, solid = false }: { children: ReactNode; solid?: boolean }) {
  return (
    <XStack
      alignItems="center"
      paddingHorizontal={12}
      paddingVertical={6}
      borderRadius={999}
      borderWidth={1}
      borderColor={solid ? magenta : line}
      backgroundColor={solid ? magenta : 'transparent'}
    >
      <Text color={solid ? ink : dim} fontSize={12} letterSpacing={1} fontWeight={solid ? '700' : '400'}>
        {children}
      </Text>
    </XStack>
  )
}

/** A raised surface for lists, cards and forms. */
export function Panel({ children }: { children: ReactNode }) {
  return (
    <YStack backgroundColor={panel} borderColor={line} borderWidth={1} borderRadius={16} padding="$4">
      {children}
    </YStack>
  )
}

/** The glowing magenta call-to-action. (@hanzo/gui Button is Stack-typed, so
 *  the label's text styling lives on a child <Text>, not on the frame.) */
export function PrimaryButton({
  children, onPress, disabled,
}: { children: ReactNode; onPress?: () => void; disabled?: boolean }) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      height={46}
      paddingHorizontal={22}
      borderRadius={12}
      borderWidth={0}
      backgroundColor={magenta}
      opacity={disabled ? 0.5 : 1}
      shadowColor={glow}
      shadowRadius={22}
      shadowOffset={{ width: 0, height: 0 }}
      hoverStyle={{ backgroundColor: blush }}
      pressStyle={{ backgroundColor: blush, scale: 0.98 }}
    >
      <Text color={ink} fontWeight="700" fontSize={15}>
        {children}
      </Text>
    </Button>
  )
}

/** The quiet, outlined action. */
export function GhostButton({
  children, onPress, disabled,
}: { children: ReactNode; onPress?: () => void; disabled?: boolean }) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      height={46}
      paddingHorizontal={20}
      borderRadius={12}
      borderWidth={1}
      borderColor={line}
      backgroundColor="transparent"
      opacity={disabled ? 0.5 : 1}
      hoverStyle={{ borderColor: magenta, backgroundColor: 'rgba(255,45,155,0.08)' }}
      pressStyle={{ scale: 0.98 }}
    >
      <Text color={text} fontWeight="600" fontSize={15}>
        {children}
      </Text>
    </Button>
  )
}

/** A five-bar equalizer motif — decorative, sells the music energy. */
export function Equalizer() {
  const bars = [14, 26, 10, 22, 16]
  return (
    <XStack alignItems="flex-end" gap={3} height={26}>
      {bars.map((h, i) => (
        <YStack
          key={i}
          width={4}
          height={h}
          borderRadius={2}
          backgroundColor={i % 2 === 0 ? magenta : cyan}
          opacity={0.9}
        />
      ))}
    </XStack>
  )
}

/**
 * Cover art — the hero element. With a real `uri` it renders the artwork;
 * otherwise a hue-rotated gradient placeholder (so an empty catalogue still
 * reads as a rhythmic grid), optionally tagged and lit by a spotlight glow.
 */
export function CoverArt({
  uri, index = 0, size, label, lit = false,
}: { uri?: string; index?: number; size: number; label?: string; lit?: boolean }) {
  const [from, to] = hues[index % hues.length]
  const shadow = lit
    ? { shadowColor: glow, shadowRadius: 40, shadowOffset: { width: 0, height: 0 } }
    : {}
  if (uri) {
    return (
      <Image
        source={{ uri }}
        width={size}
        height={size}
        borderRadius={18}
        borderWidth={1}
        borderColor={line}
        {...shadow}
      />
    )
  }
  return (
    <LinearGradient
      colors={[from, to]}
      start={[0, 0]}
      end={[1, 1]}
      width={size}
      height={size}
      borderRadius={18}
      borderWidth={1}
      borderColor={line}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      {...shadow}
    >
      {label ? (
        <Text
          color={text}
          fontSize={size > 200 ? 15 : 11}
          letterSpacing={2}
          textTransform="uppercase"
          fontWeight="700"
          opacity={0.9}
        >
          {label}
        </Text>
      ) : (
        <Equalizer />
      )}
    </LinearGradient>
  )
}

/** A labelled text field for the Admin forms. */
export function Field({
  label, value, onChangeText, placeholder,
}: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  return (
    <YStack gap="$2" flex={1} minWidth={180}>
      <Text color={faint} fontSize={11} letterSpacing={1.5} textTransform="uppercase">
        {label}
      </Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        backgroundColor={ink}
        borderColor={line}
        borderWidth={1}
        borderRadius={10}
        height={44}
        paddingHorizontal={14}
        color={text}
      />
    </YStack>
  )
}

/** A muted empty-state line. */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <Text color={faint} fontSize={15}>
      {children}
    </Text>
  )
}
