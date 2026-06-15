import { useState } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer,
} from 'recharts'
import { ClipboardList, Clock, Loader2, CheckCircle2, Star, AlertTriangle, X } from 'lucide-react'
import { followupTasks as mockTasks, complianceData, stores, getStoreName } from '@/utils/mockData'
import type { FollowupTask, FollowupStatus } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const STATUS_META: Record<FollowupStatus, { label: string; icon: typeof Clock; color: string }> = {
  '待办': { label: '待办', icon: Clock, color: 'text-warn-400' },
  '进行中': { label: '进行中', icon: Loader2, color: 'text-brand-400' },
  '已完成': { label: '已完成', icon: CheckCircle2, color: 'text-success-400' },
}

const PRIORITY_BADGE: Record<string, string> = {
  '高': 'badge-danger',
  '中': 'badge-warn',
  '低': 'badge-success',
}

const REFUND_LABEL: Record<string, string> = {
  '无': 'badge-success', '低': 'badge-brand', '中': 'badge-warn', '高': 'badge-danger',
}

function SatisfactionStars({ value }: { value: number | null }) {
  if (value == null) return null
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={12} className={i < value ? 'fill-warn-400 text-warn-400' : 'text-surface-600'} />
      ))}
    </span>
  )
}

export default function Followup() {
  const tasks = useAppStore((s) => s.followupTasks)
  const updateFollowupTask = useAppStore((s) => s.updateFollowupTask)
  const [modalTaskId, setModalTaskId] = useState<string | null>(null)
  const [form, setForm] = useState({ satisfaction: 4, refundTendency: '无' as FollowupTask['refundTendency'], notes: '' })

  const pending = tasks.filter((t) => t.status === '待办')
  const inProgress = tasks.filter((t) => t.status === '进行中')
  const completed = tasks.filter((t) => t.status === '已完成')
  const avgSatisfaction = completed.length
    ? (completed.reduce((s, t) => s + (t.satisfaction ?? 0), 0) / completed.length).toFixed(1)
    : '—'
  const highRefund = tasks.filter((t) => t.refundTendency === '高').length

  const openModal = (taskId: string) => {
    const t = tasks.find((x) => x.id === taskId)
    setForm({
      satisfaction: t?.satisfaction ?? 4,
      refundTendency: t?.refundTendency ?? '无',
      notes: t?.notes ?? '',
    })
    setModalTaskId(taskId)
  }

  const handleSave = () => {
    if (!modalTaskId) return
    updateFollowupTask(modalTaskId, {
      satisfaction: form.satisfaction,
      refundTendency: form.refundTendency,
      notes: form.notes,
      status: '已完成',
      completedAt: new Date().toISOString().slice(0, 10),
    })
    setModalTaskId(null)
  }

  const radarDims = ['attendance', 'photoUpload', 'recordComplete', 'planStability', 'satisfaction'] as const
  const dimLabels: Record<string, string> = {
    attendance: '出勤率', photoUpload: '照片上传', recordComplete: '记录完整', planStability: '方案稳定', satisfaction: '满意度',
  }
  const storeRanking = complianceData
    .map((c) => ({
      ...c,
      score: +(radarDims.reduce((s, d) => s + c[d], 0) / radarDims.length).toFixed(1),
    }))
    .sort((a, b) => b.score - a.score)

  const renderColumn = (status: FollowupStatus, items: FollowupTask[]) => {
    const meta = STATUS_META[status]
    const Icon = meta.icon
    return (
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <Icon size={16} className={meta.color} />
          <span className="font-medium text-surface-200">{meta.label}</span>
          <span className="ml-auto text-xs text-surface-400 bg-surface-700 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
          {items.map((t) => (
            <div key={t.id} className="card !p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-surface-100">{t.patientName}</span>
                <span className={PRIORITY_BADGE[t.priority]}>{t.priority}</span>
              </div>
              <div className="text-xs text-surface-400">{getStoreName(t.storeId)}</div>
              <div className="flex items-center justify-between text-xs text-surface-400">
                <span>{t.assignedTo}</span>
                <span>{t.dueDate}</span>
              </div>
              {t.status === '已完成' && (
                <div className="flex items-center justify-between">
                  <SatisfactionStars value={t.satisfaction} />
                  {t.refundTendency && (
                    <span className={REFUND_LABEL[t.refundTendency]}>{t.refundTendency}</span>
                  )}
                </div>
              )}
              {t.status === '进行中' && (
                <button onClick={() => openModal(t.id)} className="btn-primary w-full !py-1.5 text-xs">
                  记录结果
                </button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-xs text-surface-500 text-center py-6">暂无任务</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: '随访总数', value: tasks.length, icon: ClipboardList, color: 'text-brand-400' },
          { label: '待办', value: pending.length, icon: Clock, color: 'text-warn-400' },
          { label: '进行中', value: inProgress.length, icon: Loader2, color: 'text-brand-400' },
          { label: '已完成', value: completed.length, icon: CheckCircle2, color: 'text-success-400' },
          { label: '平均满意度', value: avgSatisfaction, icon: Star, color: 'text-warn-400' },
          { label: '高退费倾向', value: highRefund, icon: AlertTriangle, color: 'text-danger-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="card flex flex-col gap-1">
            <div className="flex items-center gap-2 text-surface-400 text-xs">
              <kpi.icon size={14} className={kpi.color} />
              {kpi.label}
            </div>
            <span className={cn('stat-value', kpi.color)}>{kpi.value}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="section-title mb-4">任务看板</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderColumn('待办', pending)}
          {renderColumn('进行中', inProgress)}
          {renderColumn('已完成', completed)}
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">门店合规对比</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card">
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={complianceData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="store" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                {radarDims.map((dim, i) => (
                  <Radar
                    key={dim}
                    name={dimLabels[dim]}
                    dataKey={dim}
                    stroke={['#06B6D4', '#F97316', '#4ade80', '#a78bfa', '#fb923c'][i]}
                    fill={['#06B6D4', '#F97316', '#4ade80', '#a78bfa', '#fb923c'][i]}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700 text-surface-400 text-xs">
                  <th className="text-left py-2 font-medium">排名</th>
                  <th className="text-left py-2 font-medium">门店</th>
                  <th className="text-right py-2 font-medium">合规分</th>
                </tr>
              </thead>
              <tbody>
                {storeRanking.map((s, i) => (
                  <tr key={s.store} className="border-b border-surface-700/50">
                    <td className="py-2.5">
                      <span className={cn(
                        'inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold',
                        i < 3 ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-700 text-surface-400',
                      )}>{i + 1}</span>
                    </td>
                    <td className="py-2.5 text-surface-200">{s.store}</td>
                    <td className="py-2.5 text-right font-mono text-brand-400">{s.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="card !bg-surface-800 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title !text-base">记录随访结果</h3>
              <button onClick={() => setModalTaskId(null)} className="text-surface-400 hover:text-surface-200"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1">满意度</label>
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <button key={i} onClick={() => setForm((f) => ({ ...f, satisfaction: i + 1 }))}>
                    <Star size={22} className={i < form.satisfaction ? 'fill-warn-400 text-warn-400' : 'text-surface-600'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1">退费倾向</label>
              <select
                value={form.refundTendency ?? '无'}
                onChange={(e) => setForm((f) => ({ ...f, refundTendency: e.target.value as FollowupTask['refundTendency'] }))}
                className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500"
              >
                {(['无', '低', '中', '高'] as const).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1">备注</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-200 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setModalTaskId(null)} className="btn-secondary">取消</button>
              <button onClick={handleSave} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
