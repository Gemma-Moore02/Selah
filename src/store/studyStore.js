import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStudyStore = create(
  persist(
    (set) => ({
      activeHighlightColor: 'yellow',
      toolMode: 'highlight',   // 'highlight' | 'erase' | 'note'
      notes: {},               // key: "John-4-5", value: { text, updatedAt }
      highlights: {},          // key: "John-4-5", value: { color }

      setHighlightColor: (color) => set({ activeHighlightColor: color }),
      setToolMode:       (mode)  => set({ toolMode: mode }),

      addNote: (book, chapter, verse, text) => set((state) => ({
        notes: {
          ...state.notes,
          [`${book}-${chapter}-${verse}`]: { text, updatedAt: new Date().toISOString() },
        },
      })),

      updateNote: (book, chapter, verse, text) => set((state) => ({
        notes: {
          ...state.notes,
          [`${book}-${chapter}-${verse}`]: { text, updatedAt: new Date().toISOString() },
        },
      })),

      removeNote: (book, chapter, verse) => set((state) => {
        const next = { ...state.notes }
        delete next[`${book}-${chapter}-${verse}`]
        return { notes: next }
      }),

      addHighlight: (book, chapter, verse, color) => set((state) => ({
        highlights: {
          ...state.highlights,
          [`${book}-${chapter}-${verse}`]: { color },
        },
      })),

      removeHighlight: (book, chapter, verse) => set((state) => {
        const next = { ...state.highlights }
        delete next[`${book}-${chapter}-${verse}`]
        return { highlights: next }
      }),
    }),
    {
      name: 'selah-study',
      // Only persist user data — not transient UI tool state
      partialize: (state) => ({ notes: state.notes, highlights: state.highlights }),
    }
  )
)
