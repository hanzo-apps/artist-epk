/**
 * The artist identity this pressroom ships with — the one place static branding
 * copy lives. Name and bio are not row data (the Base collections are releases,
 * shows and press assets), so the artist edits them here. Everything else on the
 * site is provisioned into Hanzo Base and managed from the Admin tab.
 */
export const artist = {
  name: 'NOVA HALCYON',
  eyebrow: 'ELECTRONIC · LIVE A/V',
  hook: 'Synths for the small hours.',
  bio:
    'Nova Halcyon makes widescreen electronic music — analog synth haze, ' +
    'club-ready low end, and a live audiovisual show built for dark rooms. ' +
    'New material and tour dates land here first.',
  genres: ['Synthwave', 'Ambient', 'Club'],
  streaming: ['Spotify', 'Apple Music', 'Bandcamp', 'SoundCloud'],
} as const
