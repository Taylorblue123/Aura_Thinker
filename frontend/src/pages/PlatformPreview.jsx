import { useState } from 'react'
import { Smartphone, Monitor, MessageSquare, Copy, Check } from 'lucide-react'

const PlatformPreview = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('xiaohongshu')
  const [copied, setCopied] = useState(false)

  const platformContent = {
    xiaohongshu: {
      title: '如果你的客服团队每天回答100+重复问题，这篇文章能帮你省80%时间',
      content: `我最近在研究AI客服工具，发现一个被低估的事实：大部分团队还在用人工处理重复咨询，但其实AI Agent已经能覆盖这类场景，效率提升明显。

💡 什么是AI Agent？
简单说，就是基于大语言模型（如ChatGPT）的自主任务执行系统。它不只是关键词匹配，而是能理解上下文、多轮对话、甚至调用工具（比如查订单状态）。

🚀 实际效果数据
根据多个SaaS客服团队的反馈，常见场景（订单查询、退换货政策、功能使用说明）的自动化率能达到70-80%。

📋 从哪里开始？
1️⃣ 列出你们最高频的3个客户问题
2️⃣ 选一个AI客服工具试点（如Zendesk AI或Intercom Fin）
3️⃣ 一周后对比人工处理量和响应时间

⚠️ 重要提醒
AI Agent不是要取代客服团队，而是让人可以专注于更复杂的咨询（比如投诉处理、方案设计）。简单重复的问题交给AI，这样团队压力小了，客户响应也更快。

你们团队最常被问的Top 3问题是什么？评论区聊聊👇

#AI客服 #效率提升 #客服自动化 #AI工具`,
      meta: {
        wordCount: 387,
        hashtags: 4,
        emojis: 8,
        paragraphs: 7
      }
    },
    x: {
      title: 'Thread on AI Customer Service',
      content: `1/ Most customer service teams waste 80% of their time on repetitive questions.

AI Agents can handle these automatically - not just keyword matching, but real understanding and multi-turn conversations.

2/ What's different about AI Agents?

Traditional IVR: Fixed scripts, button pressing
AI Agent: Context understanding, natural language, can even call APIs

The difference is like GPS vs asking for directions.

3/ Real results from SaaS teams:
- 70-80% automation rate for common queries
- Response time: 5min → 30sec
- Customer satisfaction actually increased

4/ How to start:
→ List your top 3 repetitive questions
→ Pick one AI tool (Zendesk AI, Intercom Fin)
→ Run a 1-week pilot
→ Compare metrics

5/ Important: AI doesn't replace your team.

It handles the boring stuff so humans can focus on complex issues that need empathy and creative problem-solving.

What repetitive questions kill your team's productivity?`,
      meta: {
        tweets: 5,
        totalChars: 845,
        avgCharsPerTweet: 169
      }
    },
    wechat: {
      title: 'AI客服工具实践分享',
      content: `最近在研究AI客服工具，发现一个有意思的现象：大部分团队还在人工处理重复咨询。

其实AI Agent已经能覆盖这类场景了。它不是简单的关键词匹配，而是能理解上下文、进行多轮对话。

几个关键数据：
• 常见问题自动化率：70-80%
• 响应时间：5分钟→30秒
• 客户满意度不降反升

如果要尝试，建议：
1. 先列出最高频的3个问题
2. 选一个工具小范围试点
3. 一周后看数据对比

AI不是要取代客服，而是让团队专注于更有价值的复杂咨询。

大家有用过类似工具吗？效果如何？`,
      meta: {
        wordCount: 234,
        paragraphs: 6,
        bulletPoints: 3
      }
    }
  }

  const handleCopy = () => {
    const content = platformContent[selectedPlatform].content
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { id: 'xiaohongshu', name: '小红书', icon: Smartphone, color: 'bg-red-500' },
    { id: 'x', name: 'X (Twitter)', icon: Monitor, color: 'bg-blue-500' },
    { id: 'wechat', name: '微信群', icon: MessageSquare, color: 'bg-green-500' },
  ]

  const current = platformContent[selectedPlatform]

  return (
    <div className="flex h-full">
      {/* Platform Selector */}
      <div className="w-64 border-r border-border p-6">
        <h2 className="text-lg font-semibold mb-4">选择平台</h2>
        <div className="space-y-2">
          {platforms.map(({ id, name, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setSelectedPlatform(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                selectedPlatform === id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className={`p-1.5 rounded ${color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <span>{name}</span>
            </button>
          ))}
        </div>

        {/* Platform Stats */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
          <h3 className="font-medium mb-3">内容统计</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(current.meta).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">
                  {key === 'wordCount' && '字数'}
                  {key === 'hashtags' && '话题标签'}
                  {key === 'emojis' && 'Emoji'}
                  {key === 'paragraphs' && '段落数'}
                  {key === 'tweets' && '推文数'}
                  {key === 'totalChars' && '总字符'}
                  {key === 'avgCharsPerTweet' && '平均字符/条'}
                  {key === 'bulletPoints' && '要点数'}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Tips */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-900">平台提示</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            {selectedPlatform === 'xiaohongshu' && (
              <>
                <li>• 使用emoji增强视觉效果</li>
                <li>• 分段要短，便于阅读</li>
                <li>• 结尾加互动问题</li>
              </>
            )}
            {selectedPlatform === 'x' && (
              <>
                <li>• 第一条要抓住注意力</li>
                <li>• 每条控制在280字符内</li>
                <li>• 使用Thread编号</li>
              </>
            )}
            {selectedPlatform === 'wechat' && (
              <>
                <li>• 保持友好对话感</li>
                <li>• 避免过长段落</li>
                <li>• 适度使用bullet points</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{current.title}</h1>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制内容
                </>
              )}
            </button>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {selectedPlatform === 'xiaohongshu' && (
              <div className="space-y-4">
                {current.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
                ))}
              </div>
            )}

            {selectedPlatform === 'x' && (
              <div className="space-y-4">
                {current.content.split('\n\n').map((tweet, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                    <p className="whitespace-pre-wrap">{tweet}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedPlatform === 'wechat' && (
              <div className="space-y-3">
                {current.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-wrap text-sm">{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => window.location.href = '/editor'}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
            >
              返回编辑
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              发布到{platforms.find(p => p.id === selectedPlatform)?.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformPreview