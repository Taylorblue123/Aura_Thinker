# 🚀 Aura Thinker - Real Implementation Plan

## Overview
Transform the current mockup into a fully functional learning and content creation platform with real API integration, data persistence, and AI capabilities.

## Architecture Design

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│                    State Management (Zustand)                │
├─────────────────────────────────────────────────────────────┤
│                      API Client Layer                        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express + WS)                     │
├─────────────────────────────────────────────────────────────┤
│   Auth │ Sessions │ Questions │ Content │ Platform Adapter  │
├─────────────────────────────────────────────────────────────┤
│                     Database (PostgreSQL)                    │
├─────────────────────────────────────────────────────────────┤
│                  AI Integration (Claude API)                 │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Learning sessions
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  input_type VARCHAR(50) NOT NULL, -- 'text', 'url', 'file'
  raw_content TEXT NOT NULL,
  processed_content JSONB, -- Structured content after analysis
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'analyzing', -- analyzing, questioning, drafting, complete
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Analysis results
CREATE TABLE content_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  one_sentence_thesis TEXT,
  argument_skeleton JSONB,
  problem_list JSONB,
  key_concepts JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coach questions
CREATE TABLE coach_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(100), -- elaboration, feynman, comparison, transfer, metacognition
  purpose TEXT,
  why_relevant TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User responses
CREATE TABLE user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES coach_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  response_text TEXT,
  skipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content drafts
CREATE TABLE content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content_html TEXT,
  content_markdown TEXT,
  version INTEGER DEFAULT 1,
  ai_suggestions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform adaptations
CREATE TABLE platform_adaptations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- xiaohongshu, twitter, wechat
  adapted_content TEXT NOT NULL,
  platform_specific_data JSONB, -- hashtags, emojis, thread structure etc
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sessions_user ON learning_sessions(user_id);
CREATE INDEX idx_sessions_status ON learning_sessions(status);
CREATE INDEX idx_questions_session ON coach_questions(session_id);
CREATE INDEX idx_responses_question ON user_responses(question_id);
CREATE INDEX idx_drafts_session ON content_drafts(session_id);
CREATE INDEX idx_adaptations_draft ON platform_adaptations(draft_id);
```

## API Endpoints Design

### Authentication
```javascript
POST   /api/auth/register     // Register new user
POST   /api/auth/login        // Login user
POST   /api/auth/logout       // Logout user
GET    /api/auth/me          // Get current user
POST   /api/auth/refresh     // Refresh token
```

### Learning Sessions
```javascript
POST   /api/sessions                    // Create new session
GET    /api/sessions                    // List user's sessions
GET    /api/sessions/:id                // Get session details
PUT    /api/sessions/:id                // Update session
DELETE /api/sessions/:id                // Delete session
GET    /api/sessions/:id/full          // Get complete session with all data
```

### Content Analysis
```javascript
POST   /api/sessions/:id/analyze       // Trigger AI analysis
GET    /api/sessions/:id/analysis      // Get analysis results
POST   /api/sessions/:id/reanalyze    // Re-run analysis
```

### Coach Questions
```javascript
POST   /api/sessions/:id/generate-questions  // Generate questions
GET    /api/sessions/:id/questions          // Get all questions
POST   /api/questions/:id/respond          // Submit response
PUT    /api/questions/:id/response        // Update response
GET    /api/sessions/:id/responses       // Get all responses
```

### Content Drafts
```javascript
POST   /api/sessions/:id/drafts          // Create draft
GET    /api/sessions/:id/drafts          // List drafts
GET    /api/drafts/:id                   // Get draft
PUT    /api/drafts/:id                   // Update draft
DELETE /api/drafts/:id                   // Delete draft
POST   /api/drafts/:id/auto-save        // Auto-save draft
GET    /api/drafts/:id/suggestions      // Get AI suggestions
```

### Platform Adaptation
```javascript
POST   /api/drafts/:id/adapt/:platform   // Generate platform version
GET    /api/drafts/:id/adaptations      // Get all adaptations
PUT    /api/adaptations/:id             // Update adaptation
POST   /api/adaptations/:id/regenerate  // Regenerate with feedback
```

### WebSocket Events
```javascript
// Real-time updates
ws.on('session:status', { sessionId, status })
ws.on('analysis:progress', { sessionId, progress })
ws.on('question:generated', { sessionId, question })
ws.on('draft:auto-saved', { draftId })
ws.on('suggestion:new', { draftId, suggestion })
```

## Frontend State Management (Zustand)

```typescript
interface AppState {
  // User
  user: User | null
  isAuthenticated: boolean

  // Session
  currentSession: Session | null
  sessions: Session[]
  sessionStatus: SessionStatus

  // Questions & Responses
  questions: Question[]
  responses: Map<string, Response>
  currentQuestionIndex: number

  // Draft
  currentDraft: Draft | null
  drafts: Draft[]
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error'

  // Platform Adaptations
  adaptations: Map<Platform, Adaptation>

  // Actions
  login: (credentials) => Promise<void>
  logout: () => void
  createSession: (data) => Promise<Session>
  analyzeContent: (sessionId) => Promise<void>
  submitResponse: (questionId, response) => Promise<void>
  saveDraft: (content) => Promise<void>
  generateAdaptation: (platform) => Promise<void>
}
```

## Implementation Phases

### Phase 1: Foundation (Days 1-3)
```typescript
// 1. Setup real database
- [ ] Switch from SQLite to PostgreSQL
- [ ] Create migration scripts
- [ ] Add connection pooling

// 2. Implement authentication
- [ ] JWT token generation
- [ ] Protected routes
- [ ] User registration/login

// 3. Setup state management
- [ ] Install Zustand
- [ ] Create stores
- [ ] Connect to components
```

### Phase 2: Core Flow (Days 4-7)
```typescript
// 1. Learning Input
- [ ] File upload to cloud storage
- [ ] URL content fetching
- [ ] Text processing
- [ ] Session creation with real IDs

// 2. Content Analysis
- [ ] Claude API integration
- [ ] Streaming responses
- [ ] Progress indicators
- [ ] Error handling

// 3. Coach Q&A
- [ ] Dynamic question generation
- [ ] Response persistence
- [ ] Navigation flow
```

### Phase 3: Content Creation (Days 8-10)
```typescript
// 1. Rich Text Editor
- [ ] TipTap full integration
- [ ] Auto-save functionality
- [ ] Version history
- [ ] Collaborative editing prep

// 2. AI Suggestions
- [ ] Real-time suggestions
- [ ] Contextual improvements
- [ ] Grammar/style checks
```

### Phase 4: Platform Adaptation (Days 11-13)
```typescript
// 1. Adaptation Engine
- [ ] Platform-specific rules
- [ ] Content transformation
- [ ] Preview generation

// 2. Export Features
- [ ] Copy to clipboard
- [ ] Download formats
- [ ] Direct publishing (API)
```

### Phase 5: UI/UX Overhaul (Days 14-16)
```typescript
// 1. Design System
- [ ] Component library
- [ ] Consistent theming
- [ ] Dark mode

// 2. Interactions
- [ ] Loading states
- [ ] Error boundaries
- [ ] Animations
- [ ] Mobile responsive
```

## Key Implementation Details

### 1. Real Session Flow
```javascript
// frontend/src/pages/LearningInput.jsx
const handleSubmit = async (formData) => {
  try {
    // Create session
    const session = await api.createSession({
      title: formData.title,
      type: formData.inputType,
      content: formData.content,
      tags: formData.tags
    })

    // Store in global state
    store.setCurrentSession(session)

    // Navigate with session context
    navigate(`/coach/${session.id}`)

  } catch (error) {
    toast.error('Failed to create session')
  }
}
```

### 2. AI Integration
```javascript
// backend/services/claude.service.js
class ClaudeService {
  async analyzeContent(content) {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet',
      messages: [{
        role: 'user',
        content: `Analyze this content: ${content}`
      }],
      stream: true
    })

    // Stream processing
    for await (const chunk of response) {
      yield chunk
    }
  }

  async generateQuestions(analysis, content) {
    // Use learning-coach agent
    const agent = new LearningCoachAgent()
    return agent.generateQuestions(analysis, content)
  }
}
```

### 3. Real-time Updates
```javascript
// backend/websocket.js
io.on('connection', (socket) => {
  socket.on('join:session', (sessionId) => {
    socket.join(`session:${sessionId}`)
  })

  // Emit progress updates
  socket.to(`session:${sessionId}`).emit('analysis:progress', {
    stage: 'analyzing',
    progress: 45
  })
})
```

### 4. Component Architecture
```jsx
// Proper component structure
<SessionProvider>
  <AuthGuard>
    <Layout>
      <Router>
        <Route path="/learning" element={<LearningInput />} />
        <Route path="/coach/:sessionId" element={<CoachQA />} />
        <Route path="/editor/:sessionId" element={<ContentEditor />} />
        <Route path="/preview/:draftId" element={<PlatformPreview />} />
      </Router>
    </Layout>
  </AuthGuard>
</SessionProvider>
```

## Success Criteria

### Functional Requirements
- ✅ Users can create accounts and login
- ✅ Learning materials are saved to database
- ✅ AI generates personalized questions
- ✅ Responses influence content generation
- ✅ Drafts auto-save every 30 seconds
- ✅ Platform adaptations are accurate
- ✅ All data persists across sessions

### Performance Requirements
- Page load < 2 seconds
- API response < 500ms
- Auto-save < 1 second
- AI streaming starts < 3 seconds
- 99% uptime

### Quality Requirements
- Zero data loss
- Graceful error handling
- Mobile responsive
- Accessibility compliant
- SEO optimized

## Testing Strategy

### Unit Tests
```javascript
// Test examples
describe('SessionService', () => {
  it('creates session with valid data', async () => {
    const session = await service.createSession(validData)
    expect(session.id).toBeDefined()
    expect(session.status).toBe('analyzing')
  })
})
```

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow
- WebSocket events

### E2E Tests
```javascript
// Playwright example
test('complete learning flow', async ({ page }) => {
  await page.goto('/learning')
  await page.fill('[name=title]', 'Test Learning')
  await page.click('[type=submit]')
  await expect(page).toHaveURL(/\/coach\//)
})
```

## Deployment Requirements

### Infrastructure
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: Supabase/Neon
- File Storage: Cloudinary/S3
- AI: Claude API

### Environment Variables
```env
# Backend
DATABASE_URL=postgresql://...
CLAUDE_API_KEY=sk-...
JWT_SECRET=...
REDIS_URL=...

# Frontend
VITE_API_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com
```

## Timeline

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Foundation | Auth, DB, State Management |
| 2 | Core Flow | Session → Analysis → Questions |
| 3 | Content | Editor, Drafts, Adaptations |
| 4 | Polish | UI/UX, Testing, Deployment |

## Next Steps

1. **Immediate** (Today):
   - Set up PostgreSQL
   - Implement authentication
   - Create API client

2. **Tomorrow**:
   - Connect LearningInput to real API
   - Implement session creation
   - Add navigation flow

3. **This Week**:
   - Complete Phase 1 & 2
   - Basic working flow
   - Initial AI integration

---

*This plan transforms the mockup into a production-ready application with real functionality.*