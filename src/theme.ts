/**
 * Pressroom palette — a dark neon wash: deep violet base, magenta spotlight,
 * a cold cyan highlight. Plain hex/rgba strings passed straight to @hanzo/gui
 * longhand style props (backgroundColor / color / borderColor / shadowColor),
 * so the whole site reads from one place with no second styling system.
 */
export const ink = '#0b0410' //   near-black violet — page base
export const panel = '#150a24' // raised surface (cards, inputs)
export const violet = '#2a0b52' // deep violet — gradient anchor
export const plum = '#54105f' //  warm violet — gradient midpoint
export const magenta = '#ff2d9b' // primary neon accent
export const blush = '#ff7ad0' //  lifted magenta (hover, highlights)
export const cyan = '#41e5ff' //   secondary neon — cold spotlight

export const text = '#f6ecff' //             primary type
export const dim = 'rgba(246,236,255,0.64)' // secondary type
export const faint = 'rgba(246,236,255,0.34)' // captions, placeholders
export const line = 'rgba(255,45,155,0.22)' //  magenta-tinted hairline
export const glow = 'rgba(255,45,155,0.55)' //  neon glow (button/art shadow)
export const danger = '#ff6b6b' //              form/validation errors

/** Diagonal violet→magenta hero wash, fed to <LinearGradient colors={...}>. */
export const wash = [ink, violet, plum, '#7a1560'] as const

/** Six-step hue rotation so placeholder cover art forms a rhythmic grid. */
export const hues = [
  ['#3a0d6e', '#ff2d9b'],
  ['#1b0b4d', '#41e5ff'],
  ['#5a0f5e', '#ff7ad0'],
  ['#2a0b52', '#8a2be2'],
  ['#0f1e5c', '#41e5ff'],
  ['#4a0e52', '#ff2d9b'],
] as const
