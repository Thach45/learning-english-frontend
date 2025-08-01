import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import StudySets from './pages/StudySets';

import StudySetDetail from './pages/StudySetDetail';
import Learn from './pages/Learn';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Categories from './pages/Categories';
import CategoryDetailPage from './pages/CategoryDetail';
import DictionaryDemo from './components/DictionaryDemo';

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
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
                {/* <Route path="/study-sets/create" element={<CreateStudySet />} /> */}
                <Route path="/study-sets/:id" element={<StudySetDetail />} />
                <Route path="/learn/:studySetId/flashcards" element={<Learn />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:id" element={<CategoryDetailPage />} />
                <Route path="/dictionary" element={<DictionaryDemo />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;