import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Search, ShieldAlert, PhoneOutgoing, FileBarChart2,
  ChevronLeft, ChevronRight, Activity,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/dashboard', label: '机构看板', icon: LayoutDashboard },
  { path: '/screening', label: '病例筛查', icon: Search },
  { path: '/review', label: '异常复核', icon: ShieldAlert },
  { path: '/followup', label: '回访管理', icon: PhoneOutgoing },
  { path: '/reports', label: '报表中心', icon: FileBarChart2 },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-surface-900 border-r border-surface-700/50 flex flex-col z-50 transition-all duration-300',
        sidebarCollapsed ? 'w-[68px]' : 'w-[220px]'
      )}
    >
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-surface-700/50 shrink-0',
        sidebarCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-display font-bold text-surface-100 leading-tight truncate">正畸质控平台</h1>
            <p className="text-[10px] text-surface-400 leading-tight">Ortho QC Monitor</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'
              )} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 border-t border-surface-700/50 text-surface-500 hover:text-surface-300 transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
