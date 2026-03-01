import { useQuery } from '@tanstack/react-query'

const MODULES = import.meta.glob('../data/insights/**/*.json')

export function useInsights(book, chapter) {
  const bookFile = book.toLowerCase().replace(/\s+/g, '')
  const path     = `../data/insights/${bookFile}.json`

  return useQuery({
    queryKey: ['insights', book, chapter],
    queryFn: async () => {
      const loader = MODULES[path]
      if (!loader) return []
      const mod      = await loader()
      const insights = mod.default?.insights ?? []
      return insights.filter((i) => i.chapter === chapter)
    },
    staleTime: Infinity,
    gcTime:    Infinity,
  })
}
