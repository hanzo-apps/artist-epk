import type { BaseRecord } from '@hanzo/base/react'

/**
 * Row shapes for the three Base collections provisioned from schema.sql. Base
 * stamps id/created/updated/owner/org (BaseRecord); these are the domain fields.
 * Keep in lockstep with schema.sql and the Admin form writes.
 */

/** A discography entry — single / EP / album. */
export interface Release extends BaseRecord {
  title: string
  kind: string
  cover_url: string
  release_date: string
  stream_url: string
}

/** An upcoming tour date. */
export interface Show extends BaseRecord {
  venue: string
  city: string
  date: string
  ticket_url: string
}

/** A downloadable press-kit file (bio PDF, photo pack, logo, rider…). */
export interface PressAsset extends BaseRecord {
  label: string
  file_url: string
}
