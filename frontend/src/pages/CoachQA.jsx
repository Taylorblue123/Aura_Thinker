import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, Send, ChevronRight, Brain, Target, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import apiClient from '../lib/api'

const CoachQA = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const {
    questions,
    setQuestions,
    responses,
    addResponse,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    nextQuestion,
    currentSession,
    setLoading
  } = useAppStore()

  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      toast.error('请先选择或创建一个学习会话')
      navigate('/learning')
      return
    }

    fetchQuestions()
  }, [sessionId])

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const fetchedQuestions = await apiClient.questions.list(sessionId)

      if (fetchedQuestions.length === 0) {
        toast.error('该会话还没有生成问题')
        navigate('/learning')
        return
      }

      setQuestions(fetchedQuestions)
      setCurrentQuestionIndex(0)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('获取问题失败')
      navigate('/learning')
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('请输入你的回答')
      return
    }

    setIsSaving(true)
    const currentQuestion = questions[currentQuestionIndex]

    try {
      // Save response to backend
      await apiClient.questions.respond(currentQuestion.id, currentAnswer)

      // Save to local state
      addResponse(currentQuestion.id, currentAnswer)

      toast.success('回答已保存')
      setCurrentAnswer('')

      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion()
      } else {
        handleComplete()
      }
    } catch (error) {
      console.error('Error saving response:', error)
      toast.error('保存回答失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = () => {
    const currentQuestion = questions[currentQuestionIndex]

    // Mark as skipped
    addResponse(currentQuestion.id, '[跳过]')

    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion()
      setCurrentAnswer('')
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    toast.success('问答完成！即将进入内容编辑...')
    setTimeout(() => {
      navigate(`/editor/${sessionId}`)
    }, 1500)
  }

  if (isLoadingQuestions) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载问题中...</p>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">没有找到问题</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const purposeIcons = {
    '精细化加工': Brain,
    '费曼技术': MessageCircle,
    '对比学习': ArrowRight,
    '迁移': ChevronRight,
    '元认知': Target,
  }

  const PurposeIcon = purposeIcons[currentQuestion.purpose] || Brain

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">认知教练提问</h1>
          <p className="text-muted-foreground">
            {currentSession?.title ? `关于"${currentSession.title}"的深度思考` : '通过回答这些问题，深化你的理解'}
          </p>
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
              <PurposeIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">{currentQuestion.purpose}</span>
              <span className="text-sm text-muted-foreground">- {currentQuestion.purpose_detail}</span>
            </div>
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            {currentQuestion.why_now && (
              <div className="p-3 bg-secondary/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">为什么问这个：</span> {currentQuestion.why_now}
                </p>
              </div>
            )}
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
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {currentAnswer.length > 0 && `已输入 ${currentAnswer.length} 字`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            disabled={isSaving}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            跳过
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={isSaving || !currentAnswer.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成问答'}
              </>
            )}
          </button>
        </div>

        {/* Answered Questions Summary */}
        {Object.keys(responses).length > 0 && (
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium mb-3">回答进度</h3>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const response = responses[q.id]
                const isAnswered = !!response && response !== '[跳过]'
                const isSkipped = response === '[跳过]'
                const isCurrent = idx === currentQuestionIndex

                return (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <span className={`${isCurrent ? 'font-medium' : ''}`}>
                      Q{idx + 1}:
                    </span>
                    {isAnswered ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">已回答 ({response.length}字)</span>
                      </>
                    ) : isSkipped ? (
                      <>
                        <ChevronRight className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600">已跳过</span>
                      </>
                    ) : isCurrent ? (
                      <span className="text-primary">当前问题</span>
                    ) : (
                      <span className="text-muted-foreground">待回答</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 回答提示</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 花时间深入思考，不要急于回答</li>
            <li>• 可以结合具体例子说明你的观点</li>
            <li>• 如果不确定，说出你的疑惑也很有价值</li>
            <li>• 你的回答将影响最终生成的内容质量</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CoachQA