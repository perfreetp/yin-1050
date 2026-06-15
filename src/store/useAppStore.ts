import { create } from 'zustand'
import type { FollowupTask, SupervisionNote, ExportRecord } from '@/types'
import { followupTasks as initialFollowupTasks, supervisionNotes as initialNotes } from '@/utils/mockData'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function save(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch { /* ignore */ }
}

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  selectedStoreId: string | null
  setSelectedStoreId: (id: string | null) => void
  followupTasks: FollowupTask[]
  addFollowupTask: (task: FollowupTask) => void
  updateFollowupTask: (id: string, updates: Partial<FollowupTask>) => void
  supervisionNotes: SupervisionNote[]
  updateSupervisionNote: (id: string, updates: Partial<SupervisionNote>) => void
  addSupervisionNote: (note: SupervisionNote) => void
  exportHistory: ExportRecord[]
  addExportRecord: (record: ExportRecord) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  selectedStoreId: null,
  setSelectedStoreId: (id) => set({ selectedStoreId: id }),

  followupTasks: load<FollowupTask[]>('ortho_qc_followupTasks', initialFollowupTasks),
  addFollowupTask: (task) =>
    set((s) => {
      const next = [task, ...s.followupTasks]
      save('ortho_qc_followupTasks', next)
      return { followupTasks: next }
    }),
  updateFollowupTask: (id, updates) =>
    set((s) => {
      const next = s.followupTasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
      save('ortho_qc_followupTasks', next)
      return { followupTasks: next }
    }),

  supervisionNotes: load<SupervisionNote[]>('ortho_qc_supervisionNotes', initialNotes),
  updateSupervisionNote: (id, updates) =>
    set((s) => {
      const next = s.supervisionNotes.map((n) => (n.id === id ? { ...n, ...updates } : n))
      save('ortho_qc_supervisionNotes', next)
      return { supervisionNotes: next }
    }),
  addSupervisionNote: (note) =>
    set((s) => {
      const next = [note, ...s.supervisionNotes]
      save('ortho_qc_supervisionNotes', next)
      return { supervisionNotes: next }
    }),

  exportHistory: load<ExportRecord[]>('ortho_qc_exportHistory', []),
  addExportRecord: (record) =>
    set((s) => {
      const next = [record, ...s.exportHistory].slice(0, 50)
      save('ortho_qc_exportHistory', next)
      return { exportHistory: next }
    }),
}))
