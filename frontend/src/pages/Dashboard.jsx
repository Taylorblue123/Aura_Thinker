import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, MessageCircle, FileText, Clock, ArrowRight, Plus } from 'lucide-react'

const Dashboard = () => {
  const [recentSessions, setRecentSessions] = useState([])
  const [pendingQuestions, setPendingQuestions] = useState([])
  const [drafts, setDrafts] = useState([])

  useEffect(() => {
    // TODO: Fetch from API
    setRecentSessions([
      { id: 1, title: 'AI Agent深度研究', date: '今天 14:30', status: 'in_progress' },
      { id: 2, title: '认知科学学习笔记', date: '昨天 10:15', status: 'completed' },
      { id: 3, title: '产品思维框架整理', date: '2天前', status: 'completed' },
    ])

    setPendingQuestions([
      { id: 1, question: '如果向新手解释AI Agent，你会怎么说？', sessionId: 1 },
      { id: 2, question: '这个概念与传统自动化的核心区别是什么？', sessionId: 1 },
    ])

    setDrafts([
      { id: 1, title: 'AI Agent实践指南', platform: '小红书', lastEdit: '2小时前' },
      { id: 2, title: '认知科学与学习效率', platform: 'X', lastEdit: '1天前' },
    ])
  }, [])

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">欢迎回来</h1>
          <p className="text-muted-foreground">继续你的学习与创作之旅</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Link
            to="/learning"
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">新建学习</h3>
                </div>
                <p className="text-sm text-muted-foreground">开始新的学习主题</p>
              </div>
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>

          <Link
            to="/coach"
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">待回答问题</h3>
                </div>
                <p className="text-sm text-muted-foreground">{pendingQuestions.length} 个问题待回答</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>

          <Link
            to="/editor"
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">草稿箱</h3>
                </div>
                <p className="text-sm text-muted-foreground">{drafts.length} 篇待完成</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        </div>

        {/* Recent Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">最近学习</h2>
            <Link to="/learning" className="text-sm text-primary hover:underline">
              查看全部
            </Link>
          </div>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{session.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.date}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          session.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {session.status === 'completed' ? '已完成' : '进行中'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/coach?session=${session.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    继续学习
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Questions */}
        {pendingQuestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">待回答问题</h2>
              <Link to="/coach" className="text-sm text-primary hover:underline">
                回答问题
              </Link>
            </div>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {pendingQuestions.map((q) => (
                <div key={q.id} className="p-4">
                  <p className="text-sm">{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drafts */}
        {drafts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">草稿</h2>
              <Link to="/editor" className="text-sm text-primary hover:underline">
                查看全部
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{draft.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>目标平台：{draft.platform}</span>
                    <span>{draft.lastEdit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard