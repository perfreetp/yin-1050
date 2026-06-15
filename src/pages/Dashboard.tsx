import { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  AlertTriangle, Users, Clock, Activity, ShieldAlert, TrendingUp,
  UserCheck, Calendar,
} from 'lucide-react'
import { stores, doctors, trendData, alerts, cases, getStoreName } from '@/utils/mockData'
import { cn } from '@/lib/utils'

function AlertTicker() {
  const typeIcon = { overdue: Clock, risk: ShieldAlert, anomaly: AlertTriangle }
  const typeBadge = { overdue: 'badge-warn', risk: 'badge-danger', anomaly: 'badge-warn' }

  return (
    <div className="card overflow-hidden !p-0 relative">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-700 bg-surface-900/50">
        <Activity className="w-4 h-4 text-warn-400 animate-pulse" />
        <span className="text-xs font-medium text-surface-400">实时预警</span>
      </div>
      <div className="relative overflow-hidden h-10 flex items-center">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...alerts, ...alerts].map((a, i) => {
            const Icon = typeIcon[a.type]
            return (
              <div key={`${a.id}-${i}`} className="inline-flex items-center gap-2 px-6">
                <Icon className="w-3.5 h-3.5 text-warn-400 shrink-0" />
                <span className={cn('text-xs', typeBadge[a.type])}>{a.message}</span>
                <span className="text-[10px] text-surface-500">{a.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function KPICards() {
  const kpis = useMemo(() => {
    const totalActive = stores.reduce((s, st) => s + st.activePatients, 0)
    const totalOverdue = stores.reduce((s, st) => s + st.overdueCount, 0)
    const totalAnomaly = stores.reduce((s, st) => s + st.anomalyCount, 0)
    const highRisk = cases.filter(c => c.isHighRisk).length
    return [
      { label: '在治患者', value: totalActive, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10' },
      { label: '超期复诊', value: totalOverdue, icon: Clock, color: 'text-warn-400', bg: 'bg-warn-500/10' },
      { label: '异常记录', value: totalAnomaly, icon: AlertTriangle, color: 'text-danger-400', bg: 'bg-danger-500/10' },
      { label: '高风险病例', value: highRisk, icon: ShieldAlert, color: 'text-danger-400', bg: 'bg-danger-500/10' },
    ]
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="card flex items-center gap-4">
          <div className={cn('p-3 rounded-lg', k.bg)}>
            <k.icon className={cn('w-5 h-5', k.color)} />
          </div>
          <div>
            <p className="text-xs text-surface-400 mb-0.5">{k.label}</p>
            <p className={cn('stat-value', k.color)}>{k.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function StoreGrid() {
  return (
    <div>
      <h2 className="section-title mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand-400" />门店概览
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stores.map((s) => (
          <div key={s.id} className="card">
            <h3 className="font-medium text-surface-100 mb-3 text-sm">{s.name.replace('瑞尔齿科·', '')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-surface-500">在治患者</p>
                <p className="stat-value text-brand-400 !text-xl">{s.activePatients}</p>
              </div>
              <div>
                <p className="text-[11px] text-surface-500">月新增</p>
                <p className="stat-value text-success-400 !text-xl">{s.monthlyNew}</p>
              </div>
              <div>
                <p className="text-[11px] text-surface-500">超期复诊</p>
                <p className={cn('stat-value !text-xl', s.overdueCount > 8 ? 'text-danger-400' : 'text-warn-400')}>
                  {s.overdueCount}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-surface-500">异常数</p>
                <p className={cn('stat-value !text-xl', s.anomalyCount > 6 ? 'text-danger-400' : 'text-warn-400')}>
                  {s.anomalyCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DoctorTable() {
  return (
    <div>
      <h2 className="section-title mb-4 flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-brand-400" />医生分布
      </h2>
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-900/40">
                <th className="text-left px-4 py-3 text-xs text-surface-400 font-medium">医生</th>
                <th className="text-left px-4 py-3 text-xs text-surface-400 font-medium">门店</th>
                <th className="text-right px-4 py-3 text-xs text-surface-400 font-medium">在治患者</th>
                <th className="text-right px-4 py-3 text-xs text-surface-400 font-medium">方案变更</th>
                <th className="text-right px-4 py-3 text-xs text-surface-400 font-medium">平均间隔(天)</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d, i) => (
                <tr key={d.id} className={cn('border-b border-surface-700/50 hover:bg-surface-800/60', i % 2 && 'bg-surface-900/20')}>
                  <td className="px-4 py-2.5 text-surface-200">{d.name}</td>
                  <td className="px-4 py-2.5 text-surface-400 text-xs">{getStoreName(d.storeId)}</td>
                  <td className="px-4 py-2.5 text-right text-brand-400 font-medium">{d.activePatients}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={d.planChanges >= 5 ? 'badge-danger' : d.planChanges >= 3 ? 'badge-warn' : 'badge-success'}>
                      {d.planChanges}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={d.avgIntervalDays > 35 ? 'text-warn-400' : d.avgIntervalDays > 42 ? 'text-danger-400' : 'text-surface-300'}>
                      {d.avgIntervalDays}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TrendCharts() {
  const tooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#94a3b8' },
  }

  return (
    <div>
      <h2 className="section-title mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-brand-400" />趋势分析
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-xs text-surface-400 mb-4">在治患者趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="activePatients" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4', r: 3 }} name="在治患者" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-xs text-surface-400 mb-4">超期与异常趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="overdueCount" fill="#F97316" radius={[3, 3, 0, 0]} name="超期复诊" fillOpacity={0.85} />
              <Bar dataKey="anomalyCount" fill="#EF4444" radius={[3, 3, 0, 0]} name="异常记录" fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <AlertTicker />
      <KPICards />
      <StoreGrid />
      <DoctorTable />
      <TrendCharts />
    </div>
  )
}
