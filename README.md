# 🌟 Aura Thinker - Intelligent Learning & Content Creation Platform

[![Status](https://img.shields.io/badge/Status-MVP%20Working-success)](https://github.com/Taylorblue123/Aura_Thinker)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Express-green)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-SQLite-orange)](https://www.sqlite.org/)

## 🚀 Overview

**Aura Thinker** is a functional web application that transforms your learning notes into publication-ready content through AI-powered cognitive coaching. Unlike simple writing tools, it implements a complete **"Learn → Think → Create"** workflow with real data persistence and intelligent guidance.

### ✨ Core Features (Working in MVP)

- 📚 **Learning Input**: Import notes via text, URL, or file upload
- 🧠 **Cognitive Coach**: Answer 5 targeted questions based on learning science
- ✍️ **Smart Editor**: Rich text editing with auto-save every 30 seconds
- 🎯 **Platform Adaptation**: Preview content optimized for different platforms
- 💾 **Real Database**: All data persists in SQLite database
- 🔄 **Complete Flow**: Automatic navigation through the entire workflow

## 🎮 Live Demo

**Frontend**: http://localhost:5173
**Backend API**: http://localhost:3001

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **Zustand** - State management
- **TipTap** - Rich text editor
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Router v6** - Routing

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **SQLite3** - Database
- **Better-SQLite3** - Database driver
- **CORS** - Cross-origin support

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Taylorblue123/Aura_Thinker.git
cd Aura_Thinker
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start the backend server**
```bash
cd ../backend
npm start
# Server runs on http://localhost:3001
```

5. **Start the frontend (new terminal)**
```bash
cd ../frontend
npm run dev
# App runs on http://localhost:5173
```

## 📖 How to Use

### Complete Workflow

#### 1️⃣ Learning Input
- Navigate to http://localhost:5173/learning
- Enter a learning topic/title
- Choose input type:
  - **Text**: Paste your notes directly
  - **URL**: Enter a web link (placeholder for now)
  - **File**: Upload .txt or .md files
- Click "开始学习" to begin

#### 2️⃣ Cognitive Coach Q&A
- Automatically redirected to `/coach/{sessionId}`
- Answer 5 questions designed to deepen understanding:
  - 精细化加工 (Elaboration)
  - 费曼技术 (Feynman Technique)
  - 对比学习 (Comparison)
  - 迁移 (Transfer)
  - 元认知 (Metacognition)
- Your responses are saved to the database
- Skip questions if needed

#### 3️⃣ Content Editor
- Automatically redirected to `/editor/{sessionId}`
- Draft pre-populated with your Q&A responses
- Features:
  - Rich text editing (bold, italic, lists, etc.)
  - Auto-save every 30 seconds
  - Manual save button
  - Word count and reading time
  - AI suggestions sidebar (mock for MVP)

#### 4️⃣ Platform Preview
- Click "预览效果" in editor
- See content adapted for:
  - 小红书 (Xiaohongshu)
  - X (Twitter)
  - 微信群 (WeChat Groups)
- Copy optimized content for each platform

## 🔌 API Endpoints

### Sessions
- `POST /api/sessions` - Create new learning session
- `GET /api/sessions` - List all sessions
- `POST /api/sessions/:id/generate-questions` - Generate coach questions

### Questions & Responses
- `GET /api/questions/:sessionId` - Get questions for session
- `POST /api/questions/:id/response` - Save user response

### Drafts
- `POST /api/sessions/:id/drafts` - Create draft
- `GET /api/sessions/:id/drafts` - List session drafts
- `GET /api/drafts/:id` - Get specific draft
- `PUT /api/drafts/:id` - Update draft
- `POST /api/drafts/:id/auto-save` - Auto-save content

### Health Check
- `GET /health` - API health status

## 📊 Database Schema

```sql
-- Learning sessions
learning_sessions (id, title, type, content, tags, created_at, status)

-- Coach questions
coach_questions (id, session_id, question, purpose, purpose_detail, why_now)

-- User responses
user_responses (id, question_id, response, created_at)

-- Content drafts
content_drafts (id, session_id, title, content, platform, version, created_at, updated_at)
```

## 🎯 Current Features Status

| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | ❌ Planned | Single user for MVP |
| Session Management | ✅ Working | Full CRUD operations |
| Question Generation | ✅ Working | Predefined questions (AI planned) |
| Response Saving | ✅ Working | Persists to database |
| Content Editor | ✅ Working | TipTap with auto-save |
| Platform Adaptation | 🔄 Partial | UI ready, logic pending |
| Claude AI Integration | ❌ Planned | Requires API key |
| File Upload | 🔄 Partial | Local reading only |
| Dark Mode | ❌ Planned | Light mode only |

## 🐛 Known Limitations

1. **No real AI integration** - Questions are predefined
2. **Single user** - No authentication system
3. **Local files only** - No cloud storage
4. **Mock suggestions** - AI suggestions are static
5. **Platform adaptation** - Shows examples, not real transformation

## 🚀 Roadmap

### Phase 1: MVP (Current) ✅
- Basic learning input
- Coach Q&A flow
- Content editing
- Database persistence

### Phase 2: AI Integration
- Claude API for question generation
- Real-time content suggestions
- Smart platform adaptation

### Phase 3: Multi-user
- User authentication
- Personal dashboards
- Collaboration features

### Phase 4: Advanced
- Knowledge graphs
- Learning analytics
- API for third-party apps

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Recent Updates

### v1.0.0 - MVP Release (2024-01-20)
- ✅ Transformed from mockup to working application
- ✅ Added Zustand state management
- ✅ Implemented real API endpoints
- ✅ Created functional session flow
- ✅ Added auto-save to editor
- ✅ Connected all components to database

See [MVP_IMPLEMENTATION_REPORT.md](MVP_IMPLEMENTATION_REPORT.md) for detailed changes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and Express
- UI components inspired by shadcn/ui
- Rich text editing powered by TipTap
- State management by Zustand

## 📮 Contact

- GitHub: [@Taylorblue123](https://github.com/Taylorblue123)
- Issues: [Bug Reports](https://github.com/Taylorblue123/Aura_Thinker/issues)

---

**🎉 The MVP is now fully functional!** Try it out and transform your learning into great content.

*Last updated: 2024-01-20 - MVP Working Version*