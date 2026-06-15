import { useState } from 'react'
import { AlertTriangle, Camera, CheckCircle2, ClipboardCheck, XCircle, Shield, ChevronDown } from 'lucide-react'
import { anomalyRecords, anomalyHeatmapData, stores, getStoreName, getDoctorName } from '@/utils/mockData'
import type { AnomalyType } from '@/types'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'anomaly', label: '附件/托槽异常', icon: AlertTriangle },
  { key: 'audit', label: '复诊记录抽查', icon: ClipboardCheck },
  { key: 'photo', label: '照片缺失检查', icon: Camera },
] as const

type TabKey = (typeof TABS)[number]['key']

const ANOMALY_TYPES: AnomalyType[] = ['附件丢失', '托槽脱落', '照片缺失', '复诊记录缺项']

const auditData = [
  { id: 'R001', patient: '王思远', doctor: '张伟明', store: 'S001', visitDate: '2026-06-12', completeness: 100, missing: [] as string[] },
  { id: 'R002', patient: '李芳华', doctor: '陈雅琳', store: 'S001', visitDate: '2026-06-10', completeness: 75, missing: ['弓丝型号', '患者反馈'] },
  { id: 'R003', patient: '赵敏', doctor: '刘建国', store: 'S002', visitDate: '2026-06-08', completeness: 50, missing: ['调整说明', '弓丝型号', '患者反馈', '医生签名'] },
  { id: 'R004', patient: '孙浩然', doctor: '赵敏', store: 'S002', visitDate: '2026-06-06', completeness: 100, missing: [] },
  { id: 'R005', patient: '郑婉清', doctor: '吴晓峰', store: 'S003', visitDate: '2026-06-04', completeness: 88, missing: ['患者反馈'] },
  { id: 'R006', patient: '许文静', doctor: '杨建华', store: 'S004', visitDate: '2026-06-02', completeness: 63, missing: ['调整说明', '弓丝型号', '患者反馈'] },
  { id: 'R007', patient: '马天宇', doctor: '马天宇', store: 'S005', visitDate: '2026-05-30', completeness: 100, missing: [] },
]

const photoCheckData = [
  {
    patient: '黄志强', doctor: '郑婉清', store: 'S003',
    nodes: [
      { name: '初诊建档', photos: ['正面像', '侧面像', '口内照'], uploaded: [true, true, true] },
      { name: '方案确认', photos: ['方案截图', '患者签字'], uploaded: [true, false] },
      { name: '排齐阶段', photos: ['口内照', '正面像', '弓丝记录'], uploaded: [true, false, false] },
      { name: '关缝阶段', photos: ['口内照', '侧面像'], uploaded: [false, false] },
      { name: '精调记录', photos: ['口内照', '正面像'], uploaded: [true, true] },
      { name: '保持器戴入', photos: ['口内照', '保持器照片'], uploaded: [true, false] },
    ],
  },
  {
    patient: '何俊杰', doctor: '何俊杰', store: 'S004',
    nodes: [
      { name: '初诊建档', photos: ['正面像', '侧面像', '口内照'], uploaded: [true, true, true] },
      { name: '方案确认', photos: ['方案截图', '患者签字'], uploaded: [true, true] },
      { name: '排齐阶段', photos: ['口内照', '正面像', '弓丝记录'], uploaded: [false, false, false] },
      { name: '关缝阶段', photos: ['口内照', '侧面像'], uploaded: [true, false] },
      { name: '精调记录', photos: ['口内照', '正面像'], uploaded: [false, false] },
      { name: '保持器戴入', photos: ['口内照', '保持器照片'], uploaded: [true, true] },
      { name: '复诊记录', photos: ['口内照', '弓丝记录'], uploaded: [true, false] },
    ],
  },
]

function HeatmapCell({ count, max }: { count: number; max: number }) {
  const intensity = max > 0 ? count / max : 0
  const bg = count === 0
    ? 'bg-surface-700/50'
    : intensity > 0.6
      ? 'bg-brand-500/40'
      : intensity > 0.3
        ? 'bg-brand-500/20'
        : 'bg-brand-500/10'
  return (
    <div className={cn('rounded px-3 py-2 text-center text-sm font-medium tabular-nums', bg, count > 0 ? 'text-brand-300' : 'text-surface-500')}>
      {count}
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === '高') return <span className="badge-danger">高</span>
  if (severity === '中') return <span className="badge-warn">中</span>
  return <span className="badge-success">低</span>
}

function AnomalyTab() {
  const [filterType, setFilterType] = useState<AnomalyType | ''>('')
  const [filterStore, setFilterStore] = useState('')

  const storeNames = [...new Set(anomalyHeatmapData.map(d => d.store))]
  const maxCount = Math.max(...anomalyHeatmapData.map(d => d.count), 1)

  const filtered = anomalyRecords.filter(r => {
    if (filterType && r.type !== filterType) return false
    if (filterStore && r.storeId !== filterStore) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="card overflow-x-auto">
        <h3 className="section-title mb-4">异常热力图</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-surface-400 font-medium">异常类型</th>
              {storeNames.map(s => (
                <th key={s} className="px-3 py-2 text-center text-surface-400 font-medium">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANOMALY_TYPES.map(type => (
              <tr key={type}>
                <td className="px-3 py-2 text-surface-200 font-medium">{type}</td>
                {storeNames.map(store => {
                  const item = anomalyHeatmapData.find(d => d.store === store && d.type === type)
                  return (
                    <td key={store} className="px-1 py-1">
                      <HeatmapCell count={item?.count ?? 0} max={maxCount} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="section-title">异常记录</h3>
          <select
            className="bg-surface-700 border border-surface-600 rounded-lg px-3 py-1.5 text-sm text-surface-200"
            value={filterType}
            onChange={e => setFilterType(e.target.value as AnomalyType | '')}
          >
            <option value="">全部类型</option>
            {ANOMALY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="bg-surface-700 border border-surface-600 rounded-lg px-3 py-1.5 text-sm text-surface-200"
            value={filterStore}
            onChange={e => setFilterStore(e.target.value)}
          >
            <option value="">全部门店</option>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name.replace('瑞尔齿科·', '')}</option>)}
          </select>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map(r => (
            <div key={r.id} className="flex items-center gap-4 bg-surface-700/50 rounded-lg px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-surface-100">{r.patientName}</span>
                  <span className="text-surface-500 text-xs">{getDoctorName(r.doctorId)}</span>
                  <span className="text-surface-500 text-xs">{getStoreName(r.storeId)}</span>
                </div>
                <div className="text-surface-400 text-sm mt-0.5">{r.description}</div>
              </div>
              <span className="text-surface-500 text-xs whitespace-nowrap">{r.date}</span>
              <SeverityBadge severity={r.severity} />
              {r.resolved
                ? <span className="badge-success">已解决</span>
                : <span className="badge-warn">待处理</span>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditTab() {
  return (
    <div className="space-y-3">
      {auditData.map(r => (
        <div key={r.id} className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-medium text-surface-100">{r.patient}</span>
              <span className="text-surface-400 text-sm">{r.doctor}</span>
              <span className="text-surface-500 text-xs">{getStoreName(r.store)}</span>
            </div>
            <span className="text-surface-500 text-xs">{r.visitDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', r.completeness >= 90 ? 'bg-success-500' : r.completeness >= 70 ? 'bg-warn-500' : 'bg-danger-500')}
                style={{ width: `${r.completeness}%` }}
              />
            </div>
            <span className={cn('text-sm font-medium tabular-nums', r.completeness >= 90 ? 'text-success-400' : r.completeness >= 70 ? 'text-warn-400' : 'text-danger-400')}>
              {r.completeness}%
            </span>
          </div>
          {r.missing.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <XCircle className="w-3.5 h-3.5 text-danger-400" />
              <span className="text-danger-400 text-xs">缺失项：{r.missing.join('、')}</span>
            </div>
          )}
          {r.missing.length === 0 && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />
              <span className="text-success-400 text-xs">记录完整</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function PhotoTab() {
  const [expandedCase, setExpandedCase] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {photoCheckData.map((c, i) => (
          <button
            key={c.patient}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', expandedCase === i ? 'bg-brand-500 text-white' : 'bg-surface-700 text-surface-300 hover:bg-surface-600')}
            onClick={() => setExpandedCase(i)}
          >
            {c.patient}
          </button>
        ))}
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-surface-600" />
        {photoCheckData[expandedCase].nodes.map((node, ni) => {
          const missingCount = node.uploaded.filter(u => !u).length
          return (
            <div key={ni} className="relative mb-4 last:mb-0">
              <div className={cn('absolute -left-[14px] top-1.5 w-3 h-3 rounded-full border-2', missingCount > 0 ? 'border-danger-500 bg-danger-500/30' : 'border-success-500 bg-success-500/30')} />
              <div className="card ml-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-surface-100">{node.name}</h4>
                  {missingCount > 0
                    ? <span className="badge-danger">{missingCount}项缺失</span>
                    : <span className="badge-success">已齐全</span>
                  }
                </div>
                <div className="flex flex-wrap gap-2">
                  {node.photos.map((photo, pi) => {
                    const ok = node.uploaded[pi]
                    return (
                      <div
                        key={pi}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs',
                          ok ? 'bg-success-500/10 text-success-400 border border-success-500/20' : 'bg-danger-500/10 text-danger-400 border border-dashed border-danger-500/40'
                        )}
                      >
                        {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {photo}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Review() {
  const [activeTab, setActiveTab] = useState<TabKey>('anomaly')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-brand-400" />
        <h1 className="text-2xl font-display font-bold text-surface-100">质控审查</h1>
      </div>

      <div className="flex gap-1 bg-surface-800 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.key ? 'bg-brand-500 text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700'
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'anomaly' && <AnomalyTab />}
      {activeTab === 'audit' && <AuditTab />}
      {activeTab === 'photo' && <PhotoTab />}
    </div>
  )
}
