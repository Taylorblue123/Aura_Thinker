import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Undo, Redo, Save } from 'lucide-react'

const ContentEditor = () => {
  const [title, setTitle] = useState('AI Agent实践指南')
  const [platform, setPlatform] = useState('xiaohongshu')
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h2>如果你的客服团队每天回答100+重复问题，这篇文章能帮你省80%时间</h2>

      <p>我最近在研究AI客服工具，发现一个被低估的事实：大部分团队还在用人工处理重复咨询，但其实AI Agent已经能覆盖这类场景，效率提升明显。</p>

      <h3>什么是AI Agent？</h3>
      <p>简单说，就是基于大语言模型（如ChatGPT）的自主任务执行系统。它不只是关键词匹配，而是能理解上下文、多轮对话、甚至调用工具（比如查订单状态）。</p>

      <h3>从哪里开始？</h3>
      <ul>
        <li>💡 第一步：列出你们最高频的3个客户问题</li>
        <li>⚡ 第二步：选一个AI客服工具试点（如Zendesk AI或Intercom Fin）</li>
        <li>🎯 第三步：一周后对比人工处理量和响应时间</li>
      </ul>

      <p><strong>重要提醒：</strong>AI Agent不是要取代客服团队，而是让人可以专注于更复杂的咨询（比如投诉处理、方案设计）。</p>

      <p>你们团队最常被问的Top 3问题是什么？评论区聊聊👇</p>
    `,
  })

  const handleSave = async () => {
    setIsSaving(true)
    const content = editor.getHTML()

    try {
      // TODO: Save to API
      console.log('Saving draft:', { title, platform, content })
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('草稿已保存！')
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const platforms = [
    { id: 'xiaohongshu', label: '小红书' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'wechat', label: '微信群' },
  ]

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full">
      {/* Editor Main Area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-muted-foreground"
              placeholder="输入标题..."
            />
          </div>

          {/* Editor Toolbar */}
          <div className="border border-border rounded-t-lg p-2 bg-card flex items-center gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-secondary ${
                editor.isActive('bold') ? 'bg-secondary' : ''
              }`}
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-secondary ${
                editor.isActive('italic') ? 'bg-secondary' : ''
              }`}
            >
              <Italic className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-secondary ${
                editor.isActive('bulletList') ? 'bg-secondary' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-secondary ${
                editor.isActive('orderedList') ? 'bg-secondary' : ''
              }`}
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-secondary"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-secondary"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="border border-t-0 border-border rounded-b-lg p-4 bg-card min-h-[400px]">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-border p-6 bg-card">
        <h2 className="text-lg font-semibold mb-6">发布设置</h2>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">目标平台</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Word Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">字数统计</label>
          <div className="p-3 bg-secondary/50 rounded-md">
            <p className="text-sm">
              当前字数：{editor.storage.characterCount?.characters() || 0} 字
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {platform === 'xiaohongshu' && '小红书推荐：500-800字'}
              {platform === 'x' && 'X推荐：280字符或3-5条Thread'}
              {platform === 'wechat' && '微信群推荐：300-600字'}
            </p>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">AI 建议</label>
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm">⚠️ 缺少具体数据来源</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm">✓ 开头钩子吸引力强</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm">💡 可以加入一个对比案例</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? '保存中...' : '保存草稿'}
          </button>
          <button
            onClick={() => window.location.href = '/preview'}
            className="w-full px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            预览效果
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentEditor