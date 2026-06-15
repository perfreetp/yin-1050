import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export default function Layout() {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[220px]'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
