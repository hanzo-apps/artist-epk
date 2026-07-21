/** Date + link helpers shared by the views (ISO `YYYY-MM-DD` strings in Base). */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** `2026-03-14` → `Mar 14, 2026` (month + year only if no day). */
export function fmtDate(iso?: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m) return iso
  return d ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`
}

/** Day-of-month for the tour ticker, e.g. `14`. */
export function dayOf(iso?: string): string {
  const d = iso?.split('-')[2]
  return d ? String(Number(d)) : '—'
}

/** Uppercase short month for the tour ticker, e.g. `MAR`. */
export function monthOf(iso?: string): string {
  const m = Number(iso?.split('-')[1])
  return m ? MONTHS[m - 1].toUpperCase() : ''
}

/** Open an external link (stream / tickets / press file) in a new tab. */
export function openUrl(url?: string): void {
  if (url && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
