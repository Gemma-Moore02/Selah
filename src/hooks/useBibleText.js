import { useQuery } from '@tanstack/react-query'
import { getChapter } from '@/data/translations/web'

// Tanstack Query wrapper for local chapter data.
// staleTime: Infinity so a chapter is never re-fetched within a session.
export function useBibleText(book, chapter) {
  return useQuery({
    queryKey: ['bible', 'local', book, chapter],
    queryFn:  () => getChapter(book, chapter),
    staleTime: Infinity,
    gcTime:    Infinity,
    enabled:   Boolean(book && chapter),
  })
}
