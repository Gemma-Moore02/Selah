import { useQuery } from '@tanstack/react-query'

// Vite resolves these at build time — keys are relative paths from this file
const MODULES = import.meta.glob('../data/commentaries/**/*.json')

const SOURCE_KEYS = {
  'Matthew Henry': 'matthew-henry',
  'John Calvin':   'john-calvin',
  'John Gill':     'john-gill',
  'Geneva':        'geneva',
}

export function useCommentary(source, book, chapter) {
  const key      = SOURCE_KEYS[source] ?? source.toLowerCase().replace(/\s+/g, '-')
  const bookFile = book.toLowerCase().replace(/\s+/g, '')
  const path     = `../data/commentaries/${key}/${bookFile}.json`

  return useQuery({
    queryKey: ['commentary', source, book, chapter],
    queryFn: async () => {
      const loader = MODULES[path]
      if (!loader) return []
      const mod = await loader()
      const entries = mod.default?.entries ?? []
      return entries.filter((e) => e.chapter === chapter)
    },
    staleTime: Infinity,
    gcTime:    Infinity,
  })
}
