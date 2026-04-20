
import React from 'react';
// Fix: Use type-safe module import workaround for missing Router property exports
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import SEO from './components/SEO';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingCTA from './components/home/FloatingCTA';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage';
import FreshersPage from './pages/FreshersPage';

// Resources
import BlogPage from './pages/resources/BlogPage';
import MaterialsPage from './pages/resources/MaterialsPage';
import VideosPage from './pages/resources/VideosPage';
import NewsPage from './pages/resources/NewsPage';
import SubmitMaterialPage from './pages/resources/SubmitMaterialPage';
import QuizPage from './pages/resources/QuizPage';

// Classes
import ClassesPage from './pages/classes/ClassesPage';
import LockedInChallenge from './pages/LockedInChallenge';

// Daily Challenge
import DailyChallengeLanding from './pages/challenge/DailyChallengeLanding';
import DailyChallengeDashboard from './pages/challenge/DailyChallengeDashboard';
import DailyChallengeQuiz from './pages/challenge/DailyChallengeQuiz';

// Opportunities
import OpportunitiesPage from './pages/opportunities/OpportunitiesPage';
import JobsPage from './pages/opportunities/JobsPage';
import InternshipsPage from './pages/opportunities/InternshipsPage';
import ScholarshipsPage from './pages/opportunities/ScholarshipsPage';
import LocumPage from './pages/opportunities/LocumPage';
import LocumRegistration from './pages/opportunities/LocumRegistration';
import LocumDashboard from './pages/opportunities/LocumDashboard';
import LocumEditProfile from './pages/opportunities/LocumEditProfile';

// Employer Routes
import EmployerRegistration from './pages/opportunities/EmployerRegistration';
import EmployerLogin from './pages/opportunities/EmployerLogin';
import EmployerForgotPassword from './pages/opportunities/EmployerForgotPassword';
import EmployerDashboard from './pages/opportunities/EmployerDashboard';
import PostOpportunity from './pages/opportunities/PostOpportunity';
import EditOpportunity from './pages/opportunities/EditOpportunity';

// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMaterialsPage from './pages/admin/AdminMaterialsPage';
import AdminReviewPage from './pages/admin/AdminReviewPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminPostOpportunity from './pages/admin/AdminPostOpportunity';
import AdminClassesPage from './pages/admin/AdminClassesPage';
import AdminCreateClassPage from './pages/admin/AdminCreateClassPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminCreateCoursePage from './pages/admin/AdminCreateCoursePage';

// Student Courses
import CoursesPage from './pages/classes/CoursesPage';

// Layout wrapper for consistent Header/Footer
const Layout: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen">
      <Analytics />
      <SEO 
        title="Home"
        description="StudiRad is the premier platform for Radiography professionals. Daily challenges, study materials, job opportunities, and community."
      />
      
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
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
          <Route path="freshers" element={<FreshersPage />} />

          {/* Resources */}
          <Route path="resources/blog" element={<BlogPage />} />
          <Route path="resources/news" element={<NewsPage />} />
          <Route path="resources/materials" element={<MaterialsPage />} />
          <Route path="resources/videos" element={<VideosPage />} />
          <Route path="resources/submit-material" element={<SubmitMaterialPage />} />
          <Route path="quiz" element={<QuizPage />} />

          {/* Classes Route */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="locked-in" element={<LockedInChallenge />} />
          
          {/* Daily Challenge Routes */}
          <Route path="challenge" element={<DailyChallengeLanding />} />
          <Route path="challenge/dashboard" element={<DailyChallengeDashboard />} />
          
          {/* Opportunities */}
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="internship" element={<InternshipsPage />} />
          <Route path="scholarship" element={<ScholarshipsPage />} />
          
          {/* Locum Service */}
          <Route path="locum" element={<LocumPage />} />
          <Route path="locum/register" element={<LocumRegistration />} />
          <Route path="locum/dashboard" element={<LocumDashboard />} />
          <Route path="locum/edit" element={<LocumEditProfile />} />

          {/* Employer Portal */}
          <Route path="employer/register" element={<EmployerRegistration />} />
          <Route path="employer/login" element={<EmployerLogin />} />
          <Route path="employer/forgot-password" element={<EmployerForgotPassword />} />
          <Route path="employer/dashboard" element={<EmployerDashboard />} />
          <Route path="employer/post" element={<PostOpportunity />} />
          <Route path="employer/edit/:type/:id" element={<EditOpportunity />} />
        </Route>

        {/* Daily Challenge Quiz (Standalone - No Header/Footer) */}
        <Route path="challenge/quiz/:dayId" element={<DailyChallengeQuiz />} />

        {/* Admin Section */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/materials" element={<AdminMaterialsPage />} />
        <Route path="admin/review" element={<AdminReviewPage />} />
        <Route path="admin/blog" element={<AdminBlogPage />} />
        <Route path="admin/post-opportunity" element={<AdminPostOpportunity />} />
        <Route path="admin/classes" element={<AdminClassesPage />} />
        <Route path="admin/create-class" element={<AdminCreateClassPage />} />
        <Route path="admin/courses" element={<AdminCoursesPage />} />
        <Route path="admin/create-course" element={<AdminCreateCoursePage />} />
      </Routes>
    </Router>
  );
};

export default App;
