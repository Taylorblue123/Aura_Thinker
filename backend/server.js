import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Initialize database
const db = new Database(join(__dirname, 'aura_learning.db'))

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS learning_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS coach_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    question TEXT NOT NULL,
    purpose TEXT,
    purpose_detail TEXT,
    why_now TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES learning_sessions(id)
  );

  CREATE TABLE IF NOT EXISTS user_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES coach_questions(id)
  );

  CREATE TABLE IF NOT EXISTS content_drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    title TEXT,
    content TEXT,
    platform TEXT,
    version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES learning_sessions(id)
  );

  CREATE TABLE IF NOT EXISTS published_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    draft_id INTEGER,
    platform TEXT,
    final_content TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (draft_id) REFERENCES content_drafts(id)
  );
`)

// API Routes

// Learning Sessions
app.post('/api/sessions', async (req, res) => {
  const { title, type, content, tags } = req.body

  try {
    const stmt = db.prepare(
      'INSERT INTO learning_sessions (title, type, content, tags) VALUES (?, ?, ?, ?)'
    )
    const result = stmt.run(title, type, content, JSON.stringify(tags))

    // TODO: Call Claude agents to analyze content and generate questions

    res.json({
      id: result.lastInsertRowid,
      message: 'Session created successfully'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/sessions', (req, res) => {
  try {
    const sessions = db.prepare('SELECT * FROM learning_sessions ORDER BY created_at DESC').all()
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Coach Questions
app.get('/api/questions/:sessionId', (req, res) => {
  try {
    const questions = db.prepare(
      'SELECT * FROM coach_questions WHERE session_id = ? ORDER BY id'
    ).all(req.params.sessionId)
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/questions/:questionId/response', (req, res) => {
  const { response } = req.body

  try {
    const stmt = db.prepare(
      'INSERT INTO user_responses (question_id, response) VALUES (?, ?)'
    )
    const result = stmt.run(req.params.questionId, response)

    res.json({
      id: result.lastInsertRowid,
      message: 'Response saved successfully'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Content Drafts
app.post('/api/drafts', (req, res) => {
  const { sessionId, title, content, platform } = req.body

  try {
    const stmt = db.prepare(
      'INSERT INTO content_drafts (session_id, title, content, platform) VALUES (?, ?, ?, ?)'
    )
    const result = stmt.run(sessionId, title, content, platform)

    res.json({
      id: result.lastInsertRowid,
      message: 'Draft saved successfully'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/drafts', (req, res) => {
  try {
    const drafts = db.prepare(
      'SELECT * FROM content_drafts ORDER BY updated_at DESC'
    ).all()
    res.json(drafts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Claude Agent Integration
app.post('/api/agents/analyze', async (req, res) => {
  const { content, type } = req.body

  try {
    // TODO: Integrate with Claude agents from .claude/agents directory
    // For now, return mock data
    const analysis = {
      one_sentence_thesis: 'AI Agent能显著提升客服效率，但需要正确的实施策略',
      argument_skeleton: [
        'AI Agent能理解上下文，不只是关键词匹配',
        '70-80%的常见问题可以被自动化',
        '不是替代人工，而是让人专注于复杂任务'
      ],
      problem_list: [
        { type: '概念模糊', description: '"AI Agent"未明确定义' },
        { type: '证据不足', description: '效率提升50%缺少数据支撑' }
      ]
    }

    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/agents/questions', async (req, res) => {
  const { sessionId, analysis } = req.body

  try {
    // TODO: Generate questions using learning-coach agent
    // For now, return mock questions
    const questions = [
      {
        question: '如何测量"效率提升50%"？',
        purpose: '精细化加工',
        purpose_detail: '明确关键概念的操作定义',
        why_now: '原文给出量化结论但未说明测量维度'
      },
      // ... more questions
    ]

    // Save questions to database
    const stmt = db.prepare(
      'INSERT INTO coach_questions (session_id, question, purpose, purpose_detail, why_now) VALUES (?, ?, ?, ?, ?)'
    )

    for (const q of questions) {
      stmt.run(sessionId, q.question, q.purpose, q.purpose_detail, q.why_now)
    }

    res.json({
      count: questions.length,
      message: 'Questions generated successfully'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Aura Learning & Publishing Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      sessions: {
        'POST /api/sessions': 'Create new learning session',
        'GET /api/sessions': 'List all sessions'
      },
      questions: {
        'GET /api/questions/:sessionId': 'Get questions for session',
        'POST /api/questions/:questionId/response': 'Save response to question'
      },
      drafts: {
        'POST /api/drafts': 'Save content draft',
        'GET /api/drafts': 'List all drafts'
      },
      agents: {
        'POST /api/agents/analyze': 'Analyze content with AI',
        'POST /api/agents/questions': 'Generate coach questions'
      },
      health: {
        'GET /health': 'Health check'
      }
    },
    frontend: 'http://localhost:5173',
    documentation: 'See PROJECT_STATUS.md for details'
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`)
  console.log(`Database initialized at ${join(__dirname, 'aura_learning.db')}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database connection...')
  db.close()
  process.exit(0)
})