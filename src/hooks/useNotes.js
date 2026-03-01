import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth }       from './useAuth'
import { useStudyStore } from '@/store/studyStore'
import { supabase }      from '@/services/supabase'

/**
 * Returns { noteMap, notes, saveNote, deleteNote }
 * noteMap: { [verseNumber]: { text, updatedAt, id? } }
 * notes:   sorted array of { verse, text, updatedAt, id? }
 *
 * When logged out: reads/writes Zustand (localStorage).
 * When logged in:  reads/writes Supabase with optimistic updates.
 */
export function useNotes(book, chapter) {
  const { user }    = useAuth()
  const queryClient = useQueryClient()

  // ── Zustand (always subscribed; used when logged out) ──────────
  const localNotes  = useStudyStore((s) => s.notes)
  const localAdd    = useStudyStore((s) => s.addNote)
  const localRemove = useStudyStore((s) => s.removeNote)

  const localMap = Object.fromEntries(
    Object.entries(localNotes)
      .filter(([key]) => key.startsWith(`${book}-${chapter}-`))
      .map(([key, val]) => [parseInt(key.split('-').pop(), 10), val])
  )

  // ── Supabase (used when logged in) ─────────────────────────────
  const queryKey = ['notes', user?.id, book, chapter]

  const { data: remoteRows } = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('id, verse, text, updated_at')
        .eq('user_id', user.id)
        .eq('book', book)
        .eq('chapter', chapter)
      if (error) throw error
      return data
    },
    staleTime: Infinity,
  })

  const remoteMap = remoteRows
    ? Object.fromEntries(
        remoteRows.map((n) => [n.verse, { text: n.text, updatedAt: n.updated_at, id: n.id }])
      )
    : {}

  function toSortedArray(map) {
    return Object.entries(map)
      .map(([verse, val]) => ({ verse: parseInt(verse, 10), ...val }))
      .sort((a, b) => a.verse - b.verse)
  }

  const saveMutation = useMutation({
    mutationFn: async ({ verse, text }) => {
      const existing = remoteMap[verse]
      if (existing) {
        const { error } = await supabase
          .from('notes')
          .update({ text, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('notes')
          .insert({ user_id: user.id, book, chapter, verse, text })
        if (error) throw error
      }
    },
    onMutate: async ({ verse, text }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old = []) => [
        ...(old.filter((n) => n.verse !== verse)),
        { id: '__optimistic__', verse, text, updated_at: new Date().toISOString() },
      ])
      return { prev }
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(queryKey, ctx.prev),
    onSettled: ()          => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ verse }) => {
      const existing = remoteMap[verse]
      if (!existing) return
      const { error } = await supabase.from('notes').delete().eq('id', existing.id)
      if (error) throw error
    },
    onMutate: async ({ verse }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old = []) => old.filter((n) => n.verse !== verse))
      return { prev }
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(queryKey, ctx.prev),
    onSettled: ()          => queryClient.invalidateQueries({ queryKey }),
  })

  // ── Return ─────────────────────────────────────────────────────
  if (!user) {
    return {
      noteMap:    localMap,
      notes:      toSortedArray(localMap),
      saveNote:   (verse, text) => localAdd(book, chapter, verse, text),
      deleteNote: (verse)       => localRemove?.(book, chapter, verse),
    }
  }

  return {
    noteMap:    remoteMap,
    notes:      toSortedArray(remoteMap),
    saveNote:   (verse, text) => saveMutation.mutate({ verse, text }),
    deleteNote: (verse)       => deleteMutation.mutate({ verse }),
  }
}
