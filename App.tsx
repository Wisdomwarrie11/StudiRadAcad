import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import SEO from './components/SEO';
// import InstallPWA from './components/InstallPWA';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage';
import FreshersPage from './pages/FreshersPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Resources
import BlogPage from './pages/resources/BlogPage';
import MaterialsPage from './pages/resources/MaterialsPage';
import NewsPage from './pages/resources/NewsPage';
import SubmitMaterialPage from './pages/resources/SubmitMaterialPage';
import QuizPage from './pages/resources/QuizPage';
import VideosPage from './pages/resources/VideosPage';
import QuizChallenge from './pages/resources/QuizChallenge';
// Classes
import ClassesPage from './pages/classes/ClassesPage';
import LockedInChallenge from './pages/LockedInChallenge';
import TutoringBookingPage from './pages/classes/tutorialBookingPage';

// Daily Challenge
import DailyChallengeLanding from './pages/challenge/DailyChallengeLanding';
import DailyChallengeDashboard from './pages/challenge/DailyChallengeDashboard';
import DailyChallengeQuiz from './pages/challenge/DailyChallengeQuiz';

// Opportunities
import OpportunitiesPage from './pages/opportunities/OpportunitiesPage';
import JobsPage from './pages/opportunities/JobsPage';
import InternshipsPage from './pages/opportunities/InternshipsPage';
import ScholarshipsPage from './pages/opportunities/ScholarshipsPage';

// Employer Routes
import EmployerRegistration from './pages/opportunities/EmployerRegistration';
import EmployerLogin from './pages/opportunities/EmployerLogin';
import EmployerDashboard from './pages/opportunities/EmployerDashboard';
import PostOpportunity from './pages/opportunities/PostOpportunity';
import EmployerVerify from './pages/opportunities/EmployerVerify';
import EditOpportunity from './pages/opportunities/EditOpportunity';
import EmployerForgotPassword from './pages/opportunities/EmployerForgotPassword';

// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMaterialsPage from './pages/admin/AdminMaterialsPage';
import AdminReviewPage from './pages/admin/AdminReviewPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminPostOpportunity from './pages/admin/AdminPostOpportunity';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AdminClassesPage from './pages/admin/AdminClassesPage';
import AdminCreateClassPage from './pages/admin/AdminCreateClassPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminOpportunitiesSpreadsheet from './pages/admin/SpreadSheet';
import AdminEmployerList from './pages/opportunities/AdminEmployerList';

import LocumPage from "./pages/opportunities/LocumPage";
import LocumRegistration from "./pages/opportunities/LocumRegistration";
import LocumDashboard from "./pages/opportunities/LocumDashboard";
import LocumPayment from "./pages/opportunities/LocumPayment";
import LocumEditProfile from "./pages/opportunities/LocumEditProfile";
import LocumLogin from './pages/opportunities/LocumLogin';
import CommunitySection from './components/home/CommunitySection';
import AdminCreateCoursePage from './pages/admin/AdminCreateCoursePage';
import CoursesPage from './pages/classes/CoursesPage';

// Scroll Restoration Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


// Layout wrapper for consistent Header/Footer
const Layout: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen">
      {/* Default Global SEO - Pages can override this */}
      <Analytics />
      <SEO 
        title="Home"
        description="StudiRad is the premier platform for Radiography students and professionals in Nigeria. Access up-to-date information on Job openings, internship and scholarship opportunities. Daily challenges, study materials, and community."
      />
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
      <SEO title="Admin Portal" description="StudiRad Administration" />
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
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="webinars" element={<ActivitiesPage />} />
          <Route path="freshers" element={<FreshersPage />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="terms" element={<TermsOfService />} />



          {/* Resources */}
          <Route path="resources/blog" element={<BlogPage />} />
          <Route path="resources/news" element={<NewsPage />} />
          <Route path="resources/materials" element={<MaterialsPage />} />
          <Route path="resources/submit-material" element={<SubmitMaterialPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="resources/videos" element={<VideosPage />} />
          <Route path="resources/QuizChallenge" element={<QuizChallenge />} />


          {/* Classes Route */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="locked-in" element={<LockedInChallenge />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="tutoring-booking" element={<TutoringBookingPage />} />
          
          
          {/* Daily Challenge Routes */}
          <Route path="challenge" element={<DailyChallengeLanding />} />
          <Route path="challenge/dashboard" element={<DailyChallengeDashboard />} />
          
          {/* Opportunities */}
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="internship" element={<InternshipsPage />} />
          <Route path="scholarship" element={<ScholarshipsPage />} />

          <Route path="locum" element={<LocumPage />} />
          <Route path="locum/register" element={<LocumRegistration />} />
          <Route path="locum/dashboard" element={<LocumDashboard />} />
          <Route path="locum/payment" element={<LocumPayment />} />
          <Route path="locum/edit" element={<LocumEditProfile />} />
          <Route path="locum/login" element={<LocumLogin/>} />

        </Route>

        {/* Daily Challenge Quiz (Standalone - No Header/Footer) */}
        <Route path="challenge/quiz/:dayId" element={<DailyChallengeQuiz />} />

            {/* Employer Portal */}
            <Route path="employer/register" element={<EmployerRegistration />} />
          <Route path="employer/login" element={<EmployerLogin />} />
          <Route path="employer/forgot-password" element={<EmployerForgotPassword />} />
          <Route path="employer/dashboard" element={<EmployerDashboard />} />
          <Route path="employer/post" element={<PostOpportunity />} />
          <Route path="employer/edit/:type/:id" element={<EditOpportunity />} />


        {/* Admin Login (Public) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        <Route path="community" element={<CommunitySection/>} />
        <Route path="admin/classes" element={<AdminClassesPage />} />
          <Route path="admin/classes/create" element={<AdminCreateClassPage />} />
          <Route path="admin/courses" element={<AdminCoursesPage />} />
          <Route path="admin/create-course" element={<AdminCreateCoursePage />} />
          <Route path="admin/opportunities-database" element={<AdminOpportunitiesSpreadsheet />} />
          <Route path="admin/employers-database" element={<AdminEmployerList />} />


       

        {/* Admin Protected Routes */}
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
        <Route path="admin/employers-database" element={<AdminEmployerList />} />
      </Routes>

      {/* <InstallPWA /> */}

    </Router>
  );
};

export default App;