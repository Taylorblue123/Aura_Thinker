import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load agent configurations from .claude/agents directory
const AGENTS_DIR = join(__dirname, '..', '.claude', 'agents')

/**
 * Load agent configuration from markdown file
 */
async function loadAgentConfig(agentName) {
  try {
    const filePath = join(AGENTS_DIR, `${agentName}.md`)
    const content = await fs.readFile(filePath, 'utf-8')

    // Parse the markdown to extract system prompt and other metadata
    const sections = content.split('##').filter(Boolean)
    const config = {}

    for (const section of sections) {
      const lines = section.trim().split('\n')
      const header = lines[0].trim()
      const body = lines.slice(1).join('\n').trim()

      if (header === 'Description') {
        config.description = body
      } else if (header === 'System Prompt') {
        config.systemPrompt = body
      }
    }

    return config
  } catch (error) {
    console.error(`Error loading agent ${agentName}:`, error)
    return null
  }
}

/**
 * Cognitive Reviewer Agent
 * Analyzes content structure and identifies problems
 */
export async function runCognitiveReviewer(content, audience, goal) {
  const agentConfig = await loadAgentConfig('cognitive-reviewer')

  // TODO: Integrate with Claude API
  // For now, return structured mock data based on the agent's expected output

  return {
    one_sentence_thesis: 'AI Agent能显著提升客服效率，但需要正确的实施策略和边界认知',
    argument_skeleton: [
      {
        claim: 'AI Agent能理解上下文',
        reason: '基于大语言模型技术',
        evidence: '可以进行多轮对话',
        inference: '比传统关键词匹配更智能'
      },
      {
        claim: '效率提升明显',
        reason: '自动化重复性任务',
        evidence: '70-80%常见问题可被处理',
        inference: '团队可专注于复杂任务'
      },
      {
        claim: '不是完全替代',
        reason: '复杂情况需要人工',
        evidence: '情感支持、创意解决方案',
        inference: '人机协作是最佳模式'
      }
    ],
    problem_list: [
      {
        type: '概念模糊',
        text: 'AI Agent',
        issue: '未明确定义是LLM-based还是传统chatbot'
      },
      {
        type: '证据不足',
        text: '效率提升50%',
        issue: '缺少具体测量方式和数据来源'
      },
      {
        type: '隐含假设',
        text: '所有客服任务都能自动化',
        issue: '忽略了任务复杂度差异'
      }
    ],
    minimal_fix_suggestions: [
      '[CLARITY] 在开头用一句话定义"AI Agent"',
      '[EVIDENCE] 为效率提升数据补充来源或案例',
      '[LOGIC] 说明哪类任务适合自动化，哪类不适合',
      '[STRUCTURE] 将结论部分展开，不要一笔带过'
    ]
  }
}

/**
 * Learning Coach Agent
 * Generates cognitive science-based questions
 */
export async function runLearningCoach(content, problemList, argumentSkeleton) {
  const agentConfig = await loadAgentConfig('learning-coach')

  // TODO: Integrate with Claude API
  // Generate questions based on cognitive science principles

  return [
    {
      question: '"效率提升50%"是如何测量的？是对比人工客服的响应时间，还是包含了解决率和用户满意度？',
      purpose: '精细化加工',
      purpose_detail: '逼迫明确关键概念的操作定义',
      why_now: '原文给出量化结论但未说明测量维度，这会影响读者对结论可信度的判断'
    },
    {
      question: '如果向一个从未接触过AI的餐饮业老板解释"Agent能自动化客服"，你会怎么说？',
      purpose: '费曼技术',
      purpose_detail: '用简单语言重新解释，暴露理解盲区',
      why_now: '原文使用了术语但未建立具体场景感'
    },
    {
      question: 'AI客服与传统IVR的核心区别是什么？什么情况下传统方案更合适？',
      purpose: '对比学习',
      purpose_detail: '通过对比澄清概念边界',
      why_now: '原文强调优势但未说明适用边界'
    },
    {
      question: '如果客户问题升级为投诉要求赔偿，Agent还能自动化吗？',
      purpose: '迁移',
      purpose_detail: '测试方案在复杂场景的适用性',
      why_now: '挑战"所有任务都能自动化"的假设'
    },
    {
      question: '你为什么相信这个效率数字？证据来源是什么？',
      purpose: '元认知',
      purpose_detail: '审视证据来源与可信度',
      why_now: '促使区分事实与假设'
    }
  ]
}

/**
 * Platform Strategist Agent
 * Generates platform-specific adaptation strategies
 */
export async function runPlatformStrategist(platform, argumentSkeleton, goal, tone) {
  const agentConfig = await loadAgentConfig('platform-strategist')

  // TODO: Integrate with Claude API
  // Generate platform-specific strategies

  const strategies = {
    xiaohongshu: {
      objective_function: '停留时长 + 收藏率',
      structure_recommendation: {
        hook: '场景化痛点描述，30-50字',
        body: '分3-4个要点，每个用emoji区隔',
        cta: '行动建议 + 互动问题'
      },
      rewrite_directives: [
        '[HOOK] 用场景化开头替换抽象陈述',
        '[STRUCTURE] 数据前置建立可信度',
        '[EVIDENCE] 补充具体工具名称',
        '[DENSITY] 拆分长段落',
        '[TONE] 降低焦虑感，强调增强而非替代',
        '[CTA] 加具体互动问题',
        '[VISUAL] 添加emoji增强视觉节奏'
      ],
      checklist: [
        '长度500-800字',
        '段落≤3行',
        '开头切中痛点',
        '有3-4个视觉锚点',
        '给出可执行建议',
        '有真诚提问',
        '专业术语有解释',
        'CTA明确'
      ],
      risk_warnings: [
        '避免纯技术介绍',
        '数据要具体',
        '不制造焦虑'
      ]
    },
    x: {
      objective_function: '转发率 + 评论参与',
      structure_recommendation: {
        hook: '直接亮明观点，≤1行',
        body: 'Thread 2-4条支撑',
        cta: '开放性问题'
      },
      rewrite_directives: [
        '[HOOK] 第一句直击要害',
        '[STRUCTURE] 分条呈现论点',
        '[DENSITY] 压缩每条到280字符内',
        '[EVIDENCE] 用数据说话',
        '[TONE] 犀利有态度'
      ],
      checklist: [
        '单条≤280字符',
        'Thread 3-5条',
        '观点清晰',
        '可辩论性',
        '转发价值'
      ],
      risk_warnings: [
        '避免冗长',
        '需要明确立场',
        '留讨论空间'
      ]
    },
    wechat: {
      objective_function: '引发讨论 + 有用性',
      structure_recommendation: {
        hook: '简短背景1-2句',
        body: '核心内容3-5段',
        cta: '邀请讨论'
      },
      rewrite_directives: [
        '[STRUCTURE] 段落短小',
        '[TONE] 温和专业',
        '[DENSITY] 留白充足',
        '[CTA] 真诚提问'
      ],
      checklist: [
        '长度300-600字',
        '段落≤50字',
        '易扫读',
        '尊重群聊环境'
      ],
      risk_warnings: [
        '避免刷屏',
        '不要宣讲口吻'
      ]
    }
  }

  return strategies[platform] || strategies.xiaohongshu
}

/**
 * Editor Finalizer Agent
 * Produces final draft with change audit trail
 */
export async function runEditorFinalizer(sourceText, reviewerOutput, strategistOutput, userAnswers) {
  const agentConfig = await loadAgentConfig('editor-finalizer')

  // TODO: Integrate with Claude API
  // Generate final draft based on all inputs

  const platform = strategistOutput.platform || 'xiaohongshu'

  const finalDrafts = {
    xiaohongshu: {
      content: `如果你的客服团队每天回答100+重复问题，这篇文章能帮你省80%时间

我最近在研究AI客服工具，发现一个被低估的事实：大部分团队还在用人工处理重复咨询，但其实AI Agent已经能覆盖这类场景，效率提升明显。

💡 什么是AI Agent？
简单说，就是基于大语言模型（如ChatGPT）的自主任务执行系统。它不只是关键词匹配，而是能理解上下文、多轮对话、甚至调用工具（比如查订单状态）。

🚀 实际效果数据
[待补充: 具体效率提升数据来源与测量方式]
但根据多个SaaS客服团队的反馈，常见场景的自动化率能达到70-80%。

📋 从哪里开始？
1️⃣ 列出你们最高频的3个客户问题
2️⃣ 选一个AI客服工具试点（如Zendesk AI或Intercom Fin）
3️⃣ 一周后对比人工处理量和响应时间

⚠️ 重要提醒
AI Agent不是要取代客服团队，而是让人可以专注于更复杂的咨询。简单重复的问题交给AI，团队压力小了，客户响应也更快。

你们团队最常被问的Top 3问题是什么？评论区聊聊👇`,
      change_summary: [
        {
          change: '开头改为场景化痛点描述',
          reason: '平台目标函数（小红书需要快速共鸣）',
          source: 'Strategist Directive #1'
        },
        {
          change: '补充AI Agent定义',
          reason: '认知清晰度（概念模糊）',
          source: 'Reviewer Problem List'
        },
        {
          change: '标注待补充数据',
          reason: '避免编造',
          source: 'No-Fabrication Constraint'
        },
        {
          change: '用emoji增强视觉节奏',
          reason: '平台目标函数（移动端可读性）',
          source: 'Platform Best Practice'
        }
      ]
    }
  }

  return finalDrafts[platform] || finalDrafts.xiaohongshu
}

/**
 * Main orchestrator function to run the complete pipeline
 */
export async function runPipeline(input) {
  const { content, platform, audience, goal, tone } = input

  console.log('Starting Aura Learning Pipeline...')

  // Step 1: Cognitive Review
  console.log('Step 1: Running Cognitive Reviewer...')
  const reviewerOutput = await runCognitiveReviewer(content, audience, goal)

  // Step 2: Learning Coach (parallel with Platform Strategist)
  console.log('Step 2: Running Learning Coach...')
  const coachQuestions = await runLearningCoach(
    content,
    reviewerOutput.problem_list,
    reviewerOutput.argument_skeleton
  )

  // Step 3: Platform Strategist (parallel with Learning Coach)
  console.log('Step 3: Running Platform Strategist...')
  const strategistOutput = await runPlatformStrategist(
    platform,
    reviewerOutput.argument_skeleton,
    goal,
    tone
  )

  // Step 4: Editor Finalizer
  console.log('Step 4: Running Editor Finalizer...')
  const finalOutput = await runEditorFinalizer(
    content,
    reviewerOutput,
    { ...strategistOutput, platform },
    {} // User answers would go here
  )

  return {
    reviewer: reviewerOutput,
    coach: coachQuestions,
    strategist: strategistOutput,
    editor: finalOutput
  }
}

export default {
  runCognitiveReviewer,
  runLearningCoach,
  runPlatformStrategist,
  runEditorFinalizer,
  runPipeline
}