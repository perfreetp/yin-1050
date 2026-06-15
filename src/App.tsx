import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Screening from '@/pages/Screening'
import Review from '@/pages/Review'
import Followup from '@/pages/Followup'
import Reports from '@/pages/Reports'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="screening" element={<Screening />} />
          <Route path="review" element={<Review />} />
          <Route path="followup" element={<Followup />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}
