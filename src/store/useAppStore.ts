import { create } from 'zustand'
import type { FollowupTask, SupervisionNote } from '@/types'
import { followupTasks as initialFollowupTasks, supervisionNotes as initialNotes } from '@/utils/mockData'

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  selectedStoreId: string | null
  setSelectedStoreId: (id: string | null) => void
  followupTasks: FollowupTask[]
  updateFollowupTask: (id: string, updates: Partial<FollowupTask>) => void
  supervisionNotes: SupervisionNote[]
  updateSupervisionNote: (id: string, updates: Partial<SupervisionNote>) => void
  addSupervisionNote: (note: SupervisionNote) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  selectedStoreId: null,
  setSelectedStoreId: (id) => set({ selectedStoreId: id }),
  followupTasks: initialFollowupTasks,
  updateFollowupTask: (id, updates) =>
    set((s) => ({
      followupTasks: s.followupTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  supervisionNotes: initialNotes,
  updateSupervisionNote: (id, updates) =>
    set((s) => ({
      supervisionNotes: s.supervisionNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  addSupervisionNote: (note) =>
    set((s) => ({ supervisionNotes: [note, ...s.supervisionNotes] })),
}))
