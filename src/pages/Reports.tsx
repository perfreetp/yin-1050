import { useState, Fragment } from 'react'
import { Plus, Download, FileCheck, ClipboardList, HardDrive } from 'lucide-react'
import { qualityCheckItems, stores, getStoreName } from '@/utils/mockData'
import type { SupervisionStatus, Priority } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const tabList = [
  { label: '月度质控清单', icon: FileCheck },
  { label: '督办备注', icon: ClipboardList },
  { label: '数据导出', icon: HardDrive },
]

const statusBadgeMap: Record<SupervisionStatus, string> = {
  '待处理': 'badge-warn',
  '跟进中': 'badge-brand',
  '已关闭': 'badge-success',
}

const priorityColor: Record<Priority, string> = {
  '高': 'text-danger-400',
  '中': 'text-warn-400',
  '低': 'text-surface-500',
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState(0)
  const { supervisionNotes, updateSupervisionNote, addSupervisionNote } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', assignedTo: '', priority: '中' as Priority })
  const [exportType, setExportType] = useState('病例数据')
  const [exportStore, setExportStore] = useState('all')
  const [exportRange, setExportRange] = useState({ start: '2026-01-01', end: '2026-06-16' })
  const [exportFormat, setExportFormat] = useState('Excel')

  const grouped = qualityCheckItems.reduce((acc, q) => {
    const key = `${q.category}|${q.item}|${q.standard}`
    if (!acc[key]) acc[key] = { category: q.category, item: q.item, standard: q.standard, byStore: {} as Record<string, string> }
    acc[key].byStore[q.storeId] = q.status
    return acc
  }, {} as Record<string, { category: string; item: string; standard: string; byStore: Record<string, string> }>)

  const rows = Object.values(grouped)
  const categories = [...new Set(rows.map(r => r.category))]
  const summary = stores.map(s => {
    const items = qualityCheckItems.filter(q => q.storeId === s.id)
    const passed = items.filter(q => q.status === '达标').length
    return { id: s.id, rate: items.length ? Math.round((passed / items.length) * 100) : 0 }
  })

  const handleAdd = () => {
    if (!form.title || !form.content) return
    addSupervisionNote({
      id: `SN${Date.now()}`, ...form, status: '待处理',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10), relatedStoreId: null,
    })
    setForm({ title: '', content: '', assignedTo: '', priority: '中' })
    setShowForm(false)
  }

  const exportHistory = [
    { name: '病例数据_全部门店_2026-06.xlsx', date: '2026-06-14 14:32', format: 'Excel' },
    { name: '质控清单_朝阳门店_2026-06.pdf', date: '2026-06-12 09:15', format: 'PDF' },
    { name: '异常记录_浦东店_2026-05.xlsx', date: '2026-06-10 16:48', format: 'Excel' },
    { name: '回访记录_全部门店_2026-05.pdf', date: '2026-06-08 11:20', format: 'PDF' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-surface-800 rounded-lg p-1 w-fit">
        {tabList.map((t, i) => (
          <button key={t.label} onClick={() => setActiveTab(i)}
            className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
              activeTab === i ? 'bg-brand-500 text-white' : 'text-surface-400 hover:text-surface-200')}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="card overflow-x-auto">
          <h2 className="section-title mb-4">2026年6月 质控清单</h2>
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="text-left py-3 px-3 text-surface-400 font-medium w-28">类别</th>
                <th className="text-left py-3 px-3 text-surface-400 font-medium">检查项</th>
                <th className="text-left py-3 px-3 text-surface-400 font-medium w-24">标准</th>
                {stores.map(s => (
                  <th key={s.id} className="text-center py-3 px-2 text-surface-400 font-medium whitespace-nowrap">{getStoreName(s.id)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => {
                const catRows = rows.filter(r => r.category === cat)
                return (
                  <Fragment key={cat}>
                    <tr className="bg-surface-900/50">
                      <td colSpan={3 + stores.length} className="py-2 px-3 font-medium text-brand-400 text-xs uppercase tracking-wider">{cat}</td>
                    </tr>
                    {catRows.map(row => (
                      <tr key={row.item} className="border-b border-surface-700/50 hover:bg-surface-700/30">
                        <td className="py-2.5 px-3 text-surface-500 text-xs" />
                        <td className="py-2.5 px-3 text-surface-200">{row.item}</td>
                        <td className="py-2.5 px-3 text-surface-400 text-xs">{row.standard}</td>
                        {stores.map(s => {
                          const st = row.byStore[s.id]
                          return (
                            <td key={s.id} className="text-center py-2.5 px-2">
                              {st === '达标' && <span className="text-success-400 font-medium">✓</span>}
                              {st === '未达标' && <span className="text-danger-400 font-medium">✗</span>}
                              {!st && <span className="text-surface-600">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
              <tr className="bg-surface-900/50 font-medium">
                <td colSpan={3} className="py-3 px-3 text-surface-300">达标率</td>
                {summary.map(s => (
                  <td key={s.id} className={cn('text-center py-3 px-2 font-semibold',
                    s.rate >= 80 ? 'text-success-400' : s.rate >= 50 ? 'text-warn-400' : 'text-danger-400')}>
                    {s.rate}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="section-title">督办备注</h2>
            <button className="btn-primary flex items-center gap-1.5" onClick={() => setShowForm(!showForm)}>
              <Plus size={16} />新增督办
            </button>
          </div>

          {showForm && (
            <div className="card space-y-3 animate-fade-in">
              <input className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                placeholder="标题" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <textarea className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500 resize-none"
                rows={3} placeholder="内容" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
              <div className="flex gap-3">
                <input className="flex-1 bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                  placeholder="负责人" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
                <select className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                  value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}>
                  <option value="高">高优先</option><option value="中">中优先</option><option value="低">低优先</option>
                </select>
                <button className="btn-primary" onClick={handleAdd}>提交</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {supervisionNotes.map(note => (
              <div key={note.id} className="card flex gap-4">
                <div className={cn('w-0.5 rounded-full flex-shrink-0',
                  note.status === '待处理' ? 'bg-warn-500' : note.status === '跟进中' ? 'bg-brand-500' : 'bg-success-500')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-surface-100">{note.title}</span>
                    <span className={statusBadgeMap[note.status]}>{note.status}</span>
                    <span className={cn('text-xs font-medium', priorityColor[note.priority])}>{note.priority}优先</span>
                  </div>
                  <p className="text-sm text-surface-400 mb-2">{note.content}</p>
                  <div className="flex items-center gap-4 text-xs text-surface-500">
                    <span>负责人: {note.assignedTo}</span>
                    <span>创建: {note.createdAt}</span>
                    <span>更新: {note.updatedAt}</span>
                    {note.relatedStoreId && <span className="text-brand-400">{getStoreName(note.relatedStoreId)}</span>}
                  </div>
                </div>
                <select className="bg-surface-900 border border-surface-700 rounded px-2 py-1 text-xs text-surface-300 self-start focus:outline-none focus:border-brand-500"
                  value={note.status}
                  onChange={e => updateSupervisionNote(note.id, { status: e.target.value as SupervisionStatus, updatedAt: new Date().toISOString().slice(0, 10) })}>
                  <option value="待处理">待处理</option><option value="跟进中">跟进中</option><option value="已关闭">已关闭</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h2 className="section-title">导出设置</h2>
            <div>
              <label className="block text-sm text-surface-400 mb-1.5">数据类型</label>
              <select className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                value={exportType} onChange={e => setExportType(e.target.value)}>
                <option>病例数据</option><option>异常记录</option><option>回访记录</option><option>质控清单</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-surface-400 mb-1.5">门店</label>
              <select className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                value={exportStore} onChange={e => setExportStore(e.target.value)}>
                <option value="all">全部门店</option>
                {stores.map(s => <option key={s.id} value={s.id}>{getStoreName(s.id)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-surface-400 mb-1.5">日期范围</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                  value={exportRange.start} onChange={e => setExportRange(r => ({ ...r, start: e.target.value }))} />
                <span className="self-center text-surface-500">至</span>
                <input type="date" className="flex-1 bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                  value={exportRange.end} onChange={e => setExportRange(r => ({ ...r, end: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-surface-400 mb-1.5">导出格式</label>
              <div className="flex gap-3">
                {['Excel', 'PDF'].map(fmt => (
                  <label key={fmt} className={cn('flex-1 text-center px-4 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors',
                    exportFormat === fmt ? 'border-brand-500 text-brand-400 bg-brand-500/10' : 'border-surface-600 text-surface-400 hover:border-surface-500')}>
                    <input type="radio" className="sr-only" checked={exportFormat === fmt} onChange={() => setExportFormat(fmt)} />
                    {fmt}
                  </label>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Download size={16} />导出数据
            </button>
          </div>

          <div className="card">
            <h2 className="section-title mb-4">最近导出</h2>
            <div className="space-y-0">
              {exportHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-surface-700/50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm text-surface-200 truncate">{item.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{item.date}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded flex-shrink-0 ml-3',
                    item.format === 'Excel' ? 'bg-success-500/20 text-success-400' : 'bg-danger-500/20 text-danger-400')}>
                    {item.format}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
