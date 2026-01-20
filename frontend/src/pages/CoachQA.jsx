import { useState, useEffect } from 'react'
import { MessageCircle, Send, ChevronRight, Brain, Target, ArrowRight } from 'lucide-react'

const CoachQA = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState('')

  useEffect(() => {
    // TODO: Fetch questions from API based on session
    setQuestions([
      {
        id: 1,
        question: '"效率提升50%"是如何测量的？是对比人工客服的响应时间，还是包含了解决率和用户满意度？',
        purpose: '精细化加工',
        purposeDetail: '逼迫明确关键概念的操作定义',
        whyNow: '原文给出量化结论但未说明测量维度，这会影响读者对结论可信度的判断'
      },
      {
        id: 2,
        question: '如果向一个从未接触过AI的餐饮业老板解释"Agent能自动化客服"，你会怎么说？他可能会问什么问题？',
        purpose: '费曼技术',
        purposeDetail: '用简单语言重新解释，暴露理解盲区',
        whyNow: '原文使用了"自动化""Agent"等术语，但未建立具体场景感'
      },
      {
        id: 3,
        question: 'AI客服与传统按钮式IVR(语音菜单)的核心区别是什么？在什么情况下传统方案反而更合适？',
        purpose: '对比学习',
        purposeDetail: '通过对比澄清概念边界',
        whyNow: '原文强调Agent优势，但未说明"什么时候不该用Agent"'
      },
      {
        id: 4,
        question: '如果客户问题从"查询订单状态"升级为"投诉产品质量并要求赔偿"，Agent还能"自动化"吗？需要哪些额外机制？',
        purpose: '迁移',
        purposeDetail: '测试方案在更复杂场景下的适用性',
        whyNow: '原文隐含假设"所有客服任务都能自动化"，这个问题挑战该假设的边界'
      },
      {
        id: 5,
        question: '你为什么相信"效率提升50%"这个数字？这是来自公开研究、内部测试，还是供应商宣传材料？',
        purpose: '元认知',
        purposeDetail: '审视证据来源与可信度',
        whyNow: '原文未标注证据来源，这个问题促使作者区分"事实"与"待验证假设"'
      }
    ])
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: currentAnswer
      })
      setCurrentAnswer('')

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // TODO: Submit all answers to API and navigate to editor
        console.log('All answers:', { ...answers, [currentQuestion.id]: currentAnswer })
        alert('问答完成！即将进入内容编辑...')
      }
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      alert('问答完成！即将进入内容编辑...')
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const purposeIcons = {
    '精细化加工': Brain,
    '费曼技术': MessageCircle,
    '对比学习': ArrowRight,
    '迁移': ChevronRight,
    '元认知': Target,
  }

  if (questions.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">加载问题中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">认知教练提问</h1>
          <p className="text-muted-foreground">通过回答这些问题，深化你的理解</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>问题 {currentQuestionIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% 完成</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {purposeIcons[currentQuestion.purpose] &&
                (() => {
                  const Icon = purposeIcons[currentQuestion.purpose]
                  return <Icon className="h-5 w-5 text-primary" />
                })()
              }
              <span className="text-sm font-medium text-primary">{currentQuestion.purpose}</span>
              <span className="text-sm text-muted-foreground">- {currentQuestion.purposeDetail}</span>
            </div>
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">为什么问这个：</span> {currentQuestion.whyNow}
              </p>
            </div>
          </div>
        </div>

        {/* Answer Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">你的回答</label>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="深入思考后，输入你的回答..."
            className="w-full h-40 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            跳过
          </button>
          <button
            onClick={handleSubmitAnswer}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成问答'}
          </button>
        </div>

        {/* Answered Questions Summary */}
        {Object.keys(answers).length > 0 && (
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium mb-2">已回答的问题 ({Object.keys(answers).length})</h3>
            <div className="space-y-2">
              {questions.slice(0, currentQuestionIndex).map((q, idx) => (
                <div key={q.id} className="text-sm">
                  <span className="text-muted-foreground">Q{idx + 1}: </span>
                  {answers[q.id] ? (
                    <span className="text-green-600">✓ 已回答</span>
                  ) : (
                    <span className="text-yellow-600">⊘ 已跳过</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachQA