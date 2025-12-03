import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage';

// Resources
import BlogPage from './pages/resources/BlogPage';
import MaterialsPage from './pages/resources/MaterialsPage';
import NewsPage from './pages/resources/NewsPage';
import SubmitMaterialPage from './pages/resources/SubmitMaterialPage';
import QuizPage from './pages/resources/QuizPage';

// Classes
import ClassesPage from './pages/classes/ClassesPage';
import LockedInChallenge from './pages/LockedInChallenge';

// Opportunities
import OpportunitiesPage from './pages/opportunities/OpportunitiesPage';
import JobsPage from './pages/opportunities/JobsPage';
import InternshipsPage from './pages/opportunities/InternshipsPage';
import ScholarshipsPage from './pages/opportunities/ScholarshipsPage';

// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMaterialsPage from './pages/admin/AdminMaterialsPage';
import AdminReviewPage from './pages/admin/AdminReviewPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

// Layout wrapper for consistent Header/Footer
const Layout: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Layout
const AdminLayout: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AdminProtectedRoute>
          <Outlet />
        </AdminProtectedRoute>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          
          {/* Resources */}
          <Route path="resources/blog" element={<BlogPage />} />
          <Route path="resources/news" element={<NewsPage />} />
          <Route path="resources/materials" element={<MaterialsPage />} />
          <Route path="resources/submit-material" element={<SubmitMaterialPage />} />
          <Route path="quiz" element={<QuizPage />} />

          {/* Classes Route */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/locked-in" element={<LockedInChallenge />} />

          {/* Opportunities */}
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="internship" element={<InternshipsPage />} />
          <Route path="scholarship" element={<ScholarshipsPage />} />
          
        </Route>

        {/* Admin Login (Public) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="materials" element={<AdminMaterialsPage />} />
          <Route path="review" element={<AdminReviewPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;