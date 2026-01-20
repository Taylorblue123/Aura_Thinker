import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LearningInput from './pages/LearningInput'
import CoachQA from './pages/CoachQA'
import ContentEditor from './pages/ContentEditor'
import PlatformPreview from './pages/PlatformPreview'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<LearningInput />} />
          <Route path="coach" element={<CoachQA />} />
          <Route path="editor" element={<ContentEditor />} />
          <Route path="preview" element={<PlatformPreview />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App