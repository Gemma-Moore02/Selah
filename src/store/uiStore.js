import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  panelOpen:   false,
  activePane:  'notes',   // 'notes' | 'commentary' | 'insights'
  activeVerse: null,      // { book, chapter, verse } or null

  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setPanelOpen:   (value) => set({ panelOpen: value }),
  setActivePane:  (pane)  => set({ activePane: pane }),
  setActiveVerse: (ref)   => set({ activeVerse: ref }),
}))
