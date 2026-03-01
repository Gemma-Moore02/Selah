import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth }       from './useAuth'
import { useStudyStore } from '@/store/studyStore'
import { supabase }      from '@/services/supabase'

/**
 * Returns { highlightMap, addHighlight, removeHighlight }
 * highlightMap: { [verseNumber]: { color } }
 *
 * When logged out: reads/writes Zustand (localStorage).
 * When logged in:  reads/writes Supabase with optimistic updates.
 */
export function useHighlights(book, chapter) {
  const { user }      = useAuth()
  const queryClient   = useQueryClient()

  // ── Zustand (always subscribed; used when logged out) ──────────
  const localHighlights  = useStudyStore((s) => s.highlights)
  const localAdd         = useStudyStore((s) => s.addHighlight)
  const localRemove      = useStudyStore((s) => s.removeHighlight)

  const localMap = Object.fromEntries(
    Object.entries(localHighlights)
      .filter(([key]) => key.startsWith(`${book}-${chapter}-`))
      .map(([key, val]) => [parseInt(key.split('-').pop(), 10), val])
  )

  // ── Supabase (used when logged in) ─────────────────────────────
  const queryKey = ['highlights', user?.id, book, chapter]

  const { data: remoteRows } = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('highlights')
        .select('id, verse_start, color')
        .eq('user_id', user.id)
        .eq('book', book)
        .eq('chapter', chapter)
      if (error) throw error
      return data
    },
    staleTime: Infinity,
  })

  const remoteMap = remoteRows
    ? Object.fromEntries(remoteRows.map((h) => [h.verse_start, { color: h.color, id: h.id }]))
    : {}

  const addMutation = useMutation({
    mutationFn: async ({ verse, color }) => {
      // Replace any existing highlight for this verse
      const existing = remoteMap[verse]
      if (existing) {
        await supabase.from('highlights').delete().eq('id', existing.id)
      }
      const { error } = await supabase.from('highlights').insert({
        user_id: user.id, book, chapter,
        verse_start: verse, verse_end: verse, color,
      })
      if (error) throw error
    },
    onMutate: async ({ verse, color }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old = []) => [
        ...(old.filter((h) => h.verse_start !== verse)),
        { id: '__optimistic__', verse_start: verse, color },
      ])
      return { prev }
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(queryKey, ctx.prev),
    onSettled: ()          => queryClient.invalidateQueries({ queryKey }),
  })

  const removeMutation = useMutation({
    mutationFn: async ({ verse }) => {
      const existing = remoteMap[verse]
      if (!existing) return
      const { error } = await supabase.from('highlights').delete().eq('id', existing.id)
      if (error) throw error
    },
    onMutate: async ({ verse }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old = []) => old.filter((h) => h.verse_start !== verse))
      return { prev }
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(queryKey, ctx.prev),
    onSettled: ()          => queryClient.invalidateQueries({ queryKey }),
  })

  // ── Return ─────────────────────────────────────────────────────
  if (!user) {
    return {
      highlightMap:    localMap,
      addHighlight:    (verse, color) => localAdd(book, chapter, verse, color),
      removeHighlight: (verse)        => localRemove(book, chapter, verse),
    }
  }

  return {
    highlightMap:    remoteMap,
    addHighlight:    (verse, color) => addMutation.mutate({ verse, color }),
    removeHighlight: (verse)        => removeMutation.mutate({ verse }),
  }
}
