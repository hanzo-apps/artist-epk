import { useState } from 'react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { YStack, XStack, Text, Button } from '@hanzo/gui'
import { SectionLabel, Panel, Field, PrimaryButton } from '../components'
import type { Release, Show, PressAsset } from '../lib/records'
import { fmtDate } from '../lib/format'
import { text, dim, faint, line, panel, danger } from '../theme'

/**
 * Admin — the signed-in artist manages the catalogue. Every create/delete goes
 * through @hanzo/base carrying the IAM token, so rows are stamped with and
 * scoped to this org. Keep the fields in lockstep with schema.sql + records.ts.
 */
export function Admin() {
  return (
    <YStack paddingVertical="$7" gap="$9">
      <ReleaseAdmin />
      <ShowAdmin />
      <PressAdmin />
    </YStack>
  )
}

/** One managed row with a delete affordance. */
function ManageRow({
  title, sub, onDelete, busy,
}: { title: string; sub: string; onDelete: () => void; busy: boolean }) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      gap="$3"
      paddingHorizontal="$3"
      paddingVertical="$3"
      borderWidth={1}
      borderColor={line}
      borderRadius={12}
      backgroundColor={panel}
    >
      <YStack gap="$1" flex={1}>
        <Text color={text} fontSize={15} fontWeight="600">
          {title}
        </Text>
        <Text color={faint} fontSize={12}>
          {sub}
        </Text>
      </YStack>
      <Button
        size="$2"
        chromeless
        disabled={busy}
        onPress={onDelete}
        hoverStyle={{ backgroundColor: 'rgba(255,107,107,0.10)' }}
      >
        <Text color={dim} fontSize={13} fontWeight="600">
          Delete
        </Text>
      </Button>
    </XStack>
  )
}

const RELEASE_BLANK = { title: '', kind: 'single', cover_url: '', release_date: '', stream_url: '' }

function ReleaseAdmin() {
  const { data, refetch } = useQuery<Release>('releases', { sort: '-release_date', realtime: false })
  const create = useMutation('releases', 'create')
  const remove = useMutation('releases', 'delete')
  const [form, setForm] = useState(RELEASE_BLANK)
  const upd = (patch: Partial<typeof RELEASE_BLANK>) => setForm((f) => ({ ...f, ...patch }))

  async function add() {
    if (!form.title.trim() || create.isLoading) return
    await create.mutate({ ...form })
    setForm(RELEASE_BLANK)
    await refetch()
  }
  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack gap="$4">
      <SectionLabel>Add release</SectionLabel>
      <Panel>
        <YStack gap="$4">
          <XStack flexWrap="wrap" gap="$3">
            <Field label="Title" value={form.title} onChangeText={(v) => upd({ title: v })} placeholder="LUMEN" />
            <Field label="Kind" value={form.kind} onChangeText={(v) => upd({ kind: v })} placeholder="single · ep · album" />
            <Field label="Release date" value={form.release_date} onChangeText={(v) => upd({ release_date: v })} placeholder="2026-03-14" />
          </XStack>
          <XStack flexWrap="wrap" gap="$3">
            <Field label="Cover URL" value={form.cover_url} onChangeText={(v) => upd({ cover_url: v })} placeholder="https://…/cover.jpg" />
            <Field label="Stream URL" value={form.stream_url} onChangeText={(v) => upd({ stream_url: v })} placeholder="https://open.spotify.com/…" />
          </XStack>
          {create.error ? (
            <Text color={danger} fontSize={13}>
              {create.error.message}
            </Text>
          ) : null}
          <XStack>
            <PrimaryButton onPress={add} disabled={create.isLoading || !form.title.trim()}>
              Add release
            </PrimaryButton>
          </XStack>
        </YStack>
      </Panel>
      {data.length > 0 ? (
        <YStack gap="$2">
          {data.map((r) => (
            <ManageRow
              key={r.id}
              title={r.title}
              sub={`${r.kind} · ${fmtDate(r.release_date)}`}
              onDelete={() => del(r.id)}
              busy={remove.isLoading}
            />
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}

const SHOW_BLANK = { venue: '', city: '', date: '', ticket_url: '' }

function ShowAdmin() {
  const { data, refetch } = useQuery<Show>('shows', { sort: 'date', realtime: false })
  const create = useMutation('shows', 'create')
  const remove = useMutation('shows', 'delete')
  const [form, setForm] = useState(SHOW_BLANK)
  const upd = (patch: Partial<typeof SHOW_BLANK>) => setForm((f) => ({ ...f, ...patch }))

  async function add() {
    if (!form.venue.trim() || create.isLoading) return
    await create.mutate({ ...form })
    setForm(SHOW_BLANK)
    await refetch()
  }
  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack gap="$4">
      <SectionLabel>Add show</SectionLabel>
      <Panel>
        <YStack gap="$4">
          <XStack flexWrap="wrap" gap="$3">
            <Field label="Venue" value={form.venue} onChangeText={(v) => upd({ venue: v })} placeholder="Berghain" />
            <Field label="City" value={form.city} onChangeText={(v) => upd({ city: v })} placeholder="Berlin, DE" />
            <Field label="Date" value={form.date} onChangeText={(v) => upd({ date: v })} placeholder="2026-05-02" />
          </XStack>
          <XStack flexWrap="wrap" gap="$3">
            <Field label="Ticket URL" value={form.ticket_url} onChangeText={(v) => upd({ ticket_url: v })} placeholder="https://tickets…" />
          </XStack>
          {create.error ? (
            <Text color={danger} fontSize={13}>
              {create.error.message}
            </Text>
          ) : null}
          <XStack>
            <PrimaryButton onPress={add} disabled={create.isLoading || !form.venue.trim()}>
              Add show
            </PrimaryButton>
          </XStack>
        </YStack>
      </Panel>
      {data.length > 0 ? (
        <YStack gap="$2">
          {data.map((s) => (
            <ManageRow
              key={s.id}
              title={`${s.venue} — ${s.city}`}
              sub={fmtDate(s.date)}
              onDelete={() => del(s.id)}
              busy={remove.isLoading}
            />
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}

const PRESS_BLANK = { label: '', file_url: '' }

function PressAdmin() {
  const { data, refetch } = useQuery<PressAsset>('press_assets', { sort: '-created', realtime: false })
  const create = useMutation('press_assets', 'create')
  const remove = useMutation('press_assets', 'delete')
  const [form, setForm] = useState(PRESS_BLANK)
  const upd = (patch: Partial<typeof PRESS_BLANK>) => setForm((f) => ({ ...f, ...patch }))

  async function add() {
    if (!form.label.trim() || create.isLoading) return
    await create.mutate({ ...form })
    setForm(PRESS_BLANK)
    await refetch()
  }
  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack gap="$4">
      <SectionLabel>Add press asset</SectionLabel>
      <Panel>
        <YStack gap="$4">
          <XStack flexWrap="wrap" gap="$3">
            <Field label="Label" value={form.label} onChangeText={(v) => upd({ label: v })} placeholder="Press photo (hi-res)" />
            <Field label="File URL" value={form.file_url} onChangeText={(v) => upd({ file_url: v })} placeholder="https://…/press.zip" />
          </XStack>
          {create.error ? (
            <Text color={danger} fontSize={13}>
              {create.error.message}
            </Text>
          ) : null}
          <XStack>
            <PrimaryButton onPress={add} disabled={create.isLoading || !form.label.trim()}>
              Add press asset
            </PrimaryButton>
          </XStack>
        </YStack>
      </Panel>
      {data.length > 0 ? (
        <YStack gap="$2">
          {data.map((a) => (
            <ManageRow
              key={a.id}
              title={a.label}
              sub={a.file_url}
              onDelete={() => del(a.id)}
              busy={remove.isLoading}
            />
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
