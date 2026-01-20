import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookOpen, MessageCircle, Edit3, Eye, Home } from 'lucide-react'
import { cn } from '../lib/utils'

const Layout = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: '学习输入', href: '/learning', icon: BookOpen },
    { name: '教练问答', href: '/coach', icon: MessageCircle },
    { name: '内容编辑', href: '/editor', icon: Edit3 },
    { name: '平台预览', href: '/preview', icon: Eye },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold">Aura Learning</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout