import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import StudySets from './pages/StudySets';
import CreateStudySet from './pages/CreateStudySet';
import StudySetDetail from './pages/StudySetDetail';
import Learn from './pages/Learn';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/study-sets" element={<StudySets />} />
              <Route path="/study-sets/create" element={<CreateStudySet />} />
              <Route path="/study-sets/:id" element={<StudySetDetail />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/flashcards" element={<Learn />} />
              <Route path="/learn/quiz" element={<Learn />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;