import { useState } from 'react'
import { Upload, Link, FileText, Send, Loader2 } from 'lucide-react'

const LearningInput = () => {
  const [inputType, setInputType] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tags, setTags] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const learningData = {
      title,
      type: inputType,
      content: inputType === 'text' ? content : inputType === 'url' ? url : file?.name,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      timestamp: new Date().toISOString()
    }

    try {
      // TODO: Send to API
      console.log('Submitting learning material:', learningData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Navigate to coach Q&A page with session ID
      alert('学习资料已提交，即将开始认知教练提问...')
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const inputTypes = [
    { id: 'text', label: '文本/笔记', icon: FileText },
    { id: 'url', label: '网页链接', icon: Link },
    { id: 'file', label: '上传文件', icon: Upload },
  ]

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">新建学习</h1>
          <p className="text-muted-foreground">导入你的学习资料，开始深度思考之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">学习主题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：AI Agent 深度研究"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Input Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">资料类型</label>
            <div className="grid grid-cols-3 gap-4">
              {inputTypes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setInputType(id)}
                  className={`p-4 border rounded-lg transition-colors ${
                    inputType === id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Content Based on Type */}
          <div>
            <label className="block text-sm font-medium mb-2">学习内容</label>

            {inputType === 'text' && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴你的学习笔记、文章内容或思考..."
                className="w-full h-64 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
              />
            )}

            {inputType === 'url' && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            )}

            {inputType === 'file' && (
              <div className="border-2 border-dashed border-border rounded-lg p-8">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.txt,.md,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : '点击上传文件（PDF, TXT, MD, DOC）'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">标签（可选）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, 机器学习, 产品设计（用逗号分隔）"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setTitle('')
                setContent('')
                setUrl('')
                setFile(null)
                setTags('')
              }}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
            >
              清空
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  开始学习
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
          <h3 className="font-medium mb-2">学习流程说明</h3>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. 提交学习资料后，AI会分析内容结构</li>
            <li>2. 基于认知科学原理，提出5个深化思考的问题</li>
            <li>3. 你的回答将帮助完善理解，形成更好的内容输出</li>
            <li>4. 所有学习历史都会被保存，便于回顾和迭代</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default LearningInput