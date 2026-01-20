import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LearningInput from './pages/LearningInput'
import CoachQA from './pages/CoachQA'
import ContentEditor from './pages/ContentEditor'
import PlatformPreview from './pages/PlatformPreview'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="learning" element={<LearningInput />} />
            <Route path="coach/:sessionId?" element={<CoachQA />} />
            <Route path="editor/:sessionId?" element={<ContentEditor />} />
            <Route path="preview/:draftId?" element={<PlatformPreview />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  )
}

export default App