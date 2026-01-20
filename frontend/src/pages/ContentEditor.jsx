import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Save, Loader2, Eye, Sparkles, FileText,
  CheckCircle, AlertCircle, Info
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import apiClient from '../lib/api'

// Auto-save interval in milliseconds
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

const ContentEditor = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const {
    currentSession,
    currentDraft,
    setCurrentDraft,
    updateDraft,
    autoSaveStatus,
    setAutoSaveStatus,
    responses
  } = useAppStore()

  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [lastSaved, setLastSaved] = useState(null)
  const autoSaveTimerRef = useRef(null)
  const hasUnsavedChangesRef = useRef(false)

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      hasUnsavedChangesRef.current = true
      scheduleAutoSave()
    }
  })

  useEffect(() => {
    if (!sessionId) {
      toast.error('请先选择或创建一个学习会话')
      navigate('/learning')
      return
    }

    loadOrCreateDraft()

    // Setup auto-save cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
      // Save on unmount if there are unsaved changes
      if (hasUnsavedChangesRef.current && currentDraft?.id) {
        saveContent(true)
      }
    }
  }, [sessionId])

  const loadOrCreateDraft = async () => {
    setIsLoading(true)
    try {
      // Check if drafts exist for this session
      const drafts = await apiClient.drafts.list(sessionId)

      if (drafts.length > 0) {
        // Load the most recent draft
        const latestDraft = drafts[0]
        setCurrentDraft(latestDraft)
        setTitle(latestDraft.title || '')
        if (editor) {
          editor.commands.setContent(latestDraft.content || '')
        }
        setLastSaved(new Date(latestDraft.updated_at))
        toast.success('草稿已加载')
      } else {
        // Create a new draft with initial content based on Q&A responses
        const initialContent = generateInitialContent()
        const newDraft = await apiClient.drafts.create(sessionId, {
          title: currentSession?.title || '新内容',
          content: initialContent,
          platform: 'general'
        })

        setCurrentDraft(newDraft)
        setTitle(newDraft.title)
        if (editor) {
          editor.commands.setContent(initialContent)
        }
        toast.success('新草稿已创建')
      }

      // Load AI suggestions
      loadSuggestions()
    } catch (error) {
      console.error('Error loading draft:', error)
      toast.error('加载草稿失败')
    } finally {
      setIsLoading(false)
    }
  }

  const generateInitialContent = () => {
    // Generate initial content based on Q&A responses
    let content = '<h2>基于您的学习和思考</h2>'

    if (currentSession) {
      content += `<p><strong>主题：</strong>${currentSession.title}</p>`
    }

    if (responses && Object.keys(responses).length > 0) {
      content += '<h3>核心观点</h3>'
      content += '<ul>'
      Object.values(responses).forEach((response, index) => {
        if (response && response !== '[跳过]') {
          // Take first 100 chars of each response as a bullet point
          const snippet = response.substring(0, 100)
          content += `<li>${snippet}${response.length > 100 ? '...' : ''}</li>`
        }
      })
      content += '</ul>'
    }

    content += '<h3>正文</h3>'
    content += '<p>在这里开始撰写您的内容...</p>'

    return content
  }

  const loadSuggestions = async () => {
    try {
      // For MVP, generate some static suggestions
      // In production, this would call the AI API
      const mockSuggestions = [
        '考虑添加一个具体的案例来支撑你的观点',
        '这段内容的逻辑可以更清晰，建议使用"首先...其次...最后"的结构',
        '读者可能不熟悉这个概念，建议添加简单解释',
        '结尾可以更有力，考虑添加行动呼吁或思考问题'
      ]
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      if (hasUnsavedChangesRef.current && currentDraft?.id) {
        saveContent(true)
      }
    }, AUTO_SAVE_INTERVAL)
  }, [currentDraft])

  const saveContent = async (isAutoSave = false) => {
    if (!currentDraft?.id || !editor) return

    const content = editor.getHTML()

    if (isAutoSave) {
      setAutoSaveStatus('saving')
    } else {
      setIsSaving(true)
    }

    try {
      if (isAutoSave) {
        await apiClient.drafts.autoSave(currentDraft.id, content)
      } else {
        await apiClient.drafts.update(currentDraft.id, { title, content })
      }

      hasUnsavedChangesRef.current = false
      setLastSaved(new Date())
      updateDraft({ content, title, updated_at: new Date().toISOString() })

      if (isAutoSave) {
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
      } else {
        toast.success('内容已保存')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      if (isAutoSave) {
        setAutoSaveStatus('error')
      } else {
        toast.error('保存失败')
      }
    } finally {
      if (!isAutoSave) {
        setIsSaving(false)
      }
    }
  }

  const handlePreview = () => {
    // Save before preview
    if (hasUnsavedChangesRef.current) {
      saveContent()
    }
    navigate(`/preview/${currentDraft?.id || sessionId}`)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载编辑器...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">内容编辑器</h1>
            <p className="text-muted-foreground">
              {currentSession?.title ? `基于"${currentSession.title}"创作` : '撰写你的内容'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>自动保存中...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>已自动保存</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>自动保存失败</span>
                </>
              )}
              {lastSaved && autoSaveStatus === 'idle' && (
                <span>上次保存: {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Editor Area */}
          <div className="col-span-2">
            {/* Title Input */}
            <div className="mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  hasUnsavedChangesRef.current = true
                }}
                placeholder="输入标题..."
                className="w-full px-4 py-2 text-2xl font-bold border-0 border-b-2 border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="border border-border rounded-lg p-4 min-h-[500px] bg-card">
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none focus:outline-none min-h-[450px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => saveContent()}
                  disabled={isSaving || !hasUnsavedChangesRef.current}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      保存草稿
                    </>
                  )}
                </button>
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  预览效果
                </button>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                返回主页
              </button>
            </div>
          </div>

          {/* Sidebar - AI Suggestions */}
          <div className="col-span-1">
            <div className="sticky top-8">
              {/* AI Suggestions */}
              <div className="border border-border rounded-lg p-4 bg-card mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">AI 建议</h3>
                </div>
                <div className="space-y-3">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-secondary/50 rounded-md">
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无建议</p>
                  )}
                </div>
              </div>

              {/* Writing Stats */}
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">写作统计</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">字数</span>
                    <span>{editor?.storage.characterCount?.characters() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">段落</span>
                    <span>{editor?.state.doc.content.size || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计阅读时间</span>
                    <span>{Math.ceil((editor?.storage.characterCount?.characters() || 0) / 500)} 分钟</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">编辑提示</h4>
                </div>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• 内容会每30秒自动保存</li>
                  <li>• 使用 Ctrl/Cmd + B 加粗文字</li>
                  <li>• 使用 Ctrl/Cmd + I 斜体文字</li>
                  <li>• 完成后点击预览查看效果</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentEditor