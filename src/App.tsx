import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StudySets from './pages/StudySets';
import StudySetDetail from './pages/StudySetDetail';
import Learn from './pages/Learn';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Categories from './pages/Vocabularies';
import CategoryDetailPage from './pages/CategoryDetail';
import DictionaryDemo from './components/DictionaryDemo';
import Community from './pages/Community';
import QuizPage from './pages/Quiz';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <NotificationProvider>
              <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/study-sets" element={<StudySets />} />
                    {/* <Route path="/study-sets/create" element={<CreateStudySet />} /> */}
                    <Route path="/study-sets/:id" element={<StudySetDetail />} />
                    <Route path="/learn/:studySetId/flashcards" element={<Learn />} />
                    <Route path="/learn/quiz" element={<QuizPage />} />
                    <Route path="/achievements" element={<Achievements />} />
                   
                    <Route path="/vocabularies" element={<Categories />} />
                    <Route path="/categories/:id" element={<CategoryDetailPage />} />
                    <Route path="/dictionary" element={<DictionaryDemo />} />
                    <Route path="/community" element={<Community />} />
                  </Route>
                </Route>
              </Routes>
              </Router>
            </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;