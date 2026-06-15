import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { Search, Filter, ChevronDown, AlertTriangle, RotateCcw } from 'lucide-react'
import { stores, doctors, cases, stageDurations, getStoreName, getDoctorName } from '@/utils/mockData'
import type { TreatmentStage } from '@/types'
import { cn } from '@/lib/utils'

const STAGES: TreatmentStage[] = ['初诊', '方案确认', '排齐阶段', '关缝阶段', '精细调整', '保持阶段']
const PAGE_SIZE = 10

export default function Screening() {
  const [storeFilter, setStoreFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [stageFilter, setStageFilter] = useState<TreatmentStage | ''>('')
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [highRiskOnly, setHighRiskOnly] = useState(false)
  const [planChangeMin, setPlanChangeMin] = useState('')
  const [planChangeMax, setPlanChangeMax] = useState('')
  const [page, setPage] = useState(1)

  const filteredDoctors = useMemo(() => {
    if (!storeFilter) return doctors
    return doctors.filter(d => d.storeId === storeFilter)
  }, [storeFilter])

  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (storeFilter && c.storeId !== storeFilter) return false
      if (doctorFilter && c.doctorId !== doctorFilter) return false
      if (stageFilter && c.stage !== stageFilter) return false
      if (overdueOnly && !c.isOverdue) return false
      if (highRiskOnly && !c.isHighRisk) return false
      if (planChangeMin !== '' && c.planChangeCount < Number(planChangeMin)) return false
      if (planChangeMax !== '' && c.planChangeCount > Number(planChangeMax)) return false
      return c.status === '在治'
    })
  }, [storeFilter, doctorFilter, stageFilter, overdueOnly, highRiskOnly, planChangeMin, planChangeMax])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleStoreChange = (v: string) => {
    setStoreFilter(v)
    setDoctorFilter('')
    setPage(1)
  }

  const resetFilters = () => {
    setStoreFilter('')
    setDoctorFilter('')
    setStageFilter('')
    setOverdueOnly(false)
    setHighRiskOnly(false)
    setPlanChangeMin('')
    setPlanChangeMax('')
    setPage(1)
  }

  const stageBadge = (stage: TreatmentStage) => {
    const map: Record<string, string> = {
      '初诊': 'badge-brand',
      '方案确认': 'badge-brand',
      '排齐阶段': 'badge-success',
      '关缝阶段': 'badge-success',
      '精细调整': 'badge-warn',
      '保持阶段': 'badge-success',
    }
    return map[stage] || 'badge-brand'
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-brand-400" />
          <h2 className="section-title">筛选条件</h2>
          <button onClick={resetFilters} className="ml-auto flex items-center gap-1 text-xs text-surface-400 hover:text-surface-200 transition-colors">
            <RotateCcw className="w-3 h-3" />重置
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <select value={storeFilter} onChange={e => handleStoreChange(e.target.value)} className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500">
            <option value="">全部门店</option>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name.replace('瑞尔齿科·', '')}</option>)}
          </select>
          <select value={doctorFilter} onChange={e => { setDoctorFilter(e.target.value); setPage(1) }} className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500">
            <option value="">全部医生</option>
            {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={stageFilter} onChange={e => { setStageFilter(e.target.value as TreatmentStage | ''); setPage(1) }} className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500">
            <option value="">全部阶段</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="flex items-center gap-2 bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 cursor-pointer select-none">
            <input type="checkbox" checked={overdueOnly} onChange={e => { setOverdueOnly(e.target.checked); setPage(1) }} className="accent-warn-500 w-4 h-4" />
            <span className="text-sm text-surface-300">超期未诊</span>
          </label>
          <label className="flex items-center gap-2 bg-surface-900 border border-surface-600 rounded-lg px-3 py-2 cursor-pointer select-none">
            <input type="checkbox" checked={highRiskOnly} onChange={e => { setHighRiskOnly(e.target.checked); setPage(1) }} className="accent-danger-500 w-4 h-4" />
            <span className="text-sm text-surface-300">高风险</span>
          </label>
          <div className="flex items-center gap-1">
            <input type="number" min="0" placeholder="方案变更≥" value={planChangeMin} onChange={e => { setPlanChangeMin(e.target.value); setPage(1) }} className="w-full bg-surface-900 border border-surface-600 rounded-lg px-2 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500" />
            <span className="text-surface-500 text-xs">~</span>
            <input type="number" min="0" placeholder="≤" value={planChangeMax} onChange={e => { setPlanChangeMax(e.target.value); setPage(1) }} className="w-full bg-surface-900 border border-surface-600 rounded-lg px-2 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-400" />
            <h2 className="section-title">病例筛查</h2>
            <span className="text-xs text-surface-400 ml-2">共 {filtered.length} 条</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700 text-surface-400 text-xs">
                <th className="text-left py-3 px-3 font-medium">患者</th>
                <th className="text-left py-3 px-3 font-medium">年龄</th>
                <th className="text-left py-3 px-3 font-medium">性别</th>
                <th className="text-left py-3 px-3 font-medium">门店</th>
                <th className="text-left py-3 px-3 font-medium">医生</th>
                <th className="text-left py-3 px-3 font-medium">阶段</th>
                <th className="text-left py-3 px-3 font-medium">方案变更</th>
                <th className="text-left py-3 px-3 font-medium">治疗天数</th>
                <th className="text-left py-3 px-3 font-medium">距上次复诊</th>
                <th className="text-left py-3 px-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(c => (
                <tr key={c.id} className={cn(
                  'border-b border-surface-700/50 hover:bg-surface-700/30 transition-colors',
                  c.isHighRisk && 'border-l-2 border-l-danger-500'
                )}>
                  <td className="py-3 px-3 font-medium text-surface-100">{c.patientName}</td>
                  <td className="py-3 px-3 text-surface-300">{c.patientAge}</td>
                  <td className="py-3 px-3 text-surface-300">{c.patientGender}</td>
                  <td className="py-3 px-3 text-surface-300">{getStoreName(c.storeId)}</td>
                  <td className="py-3 px-3 text-surface-300">{getDoctorName(c.doctorId)}</td>
                  <td className="py-3 px-3"><span className={stageBadge(c.stage)}>{c.stage}</span></td>
                  <td className="py-3 px-3">
                    <span className={cn(c.planChangeCount >= 3 && 'text-warn-400 font-semibold')}>
                      {c.planChangeCount}次
                    </span>
                  </td>
                  <td className="py-3 px-3 text-surface-300">{c.daysInTreatment}天</td>
                  <td className="py-3 px-3">
                    <span className={cn(c.isOverdue ? 'text-warn-400 font-semibold' : 'text-surface-300')}>
                      {c.lastVisitDays}天
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {c.isOverdue && <span className="badge-warn">超期</span>}
                      {c.isHighRisk && (
                        <span className="badge-danger flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />风险
                        </span>
                      )}
                      {!c.isOverdue && !c.isHighRisk && <span className="badge-success">正常</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={10} className="py-12 text-center text-surface-500">无匹配病例</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-700">
          <span className="text-xs text-surface-400">第 {page}/{totalPages} 页</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 text-xs">上一页</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4))
              const p = start + i
              if (p > totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)} className={cn('px-3 py-1 rounded text-xs transition-colors', p === page ? 'bg-brand-500 text-white' : 'text-surface-300 hover:bg-surface-700')}>{p}</button>
              )
            })}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 text-xs">下一页</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ChevronDown className="w-4 h-4 text-brand-400" />
          <h2 className="section-title">各阶段时长分析</h2>
          <span className="text-xs text-surface-400 ml-2">实际均值 vs 标准天数</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stageDurations} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} />
            <YAxis type="category" dataKey="stage" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={{ stroke: '#475569' }} width={72} />
            <Tooltip
              contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(v: number, name: string) => [`${v}天`, name === 'avgDays' ? '实际均值' : '标准天数']}
            />
            <Bar dataKey="standardDays" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={14} name="standardDays" />
            <Bar dataKey="avgDays" radius={[0, 4, 4, 0]} barSize={14} name="avgDays">
              {stageDurations.map(d => (
                <Cell key={d.stage} fill={d.avgDays > d.standardDays ? '#F97316' : '#22d3ee'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 text-xs text-surface-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-400 inline-block" />标准天数</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-400 inline-block" />实际均值（达标）</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-warn-500 inline-block" />实际均值（超标）</span>
        </div>
      </div>
    </div>
  )
}
