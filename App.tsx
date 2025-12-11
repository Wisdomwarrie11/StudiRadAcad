import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Download } from 'lucide-react';
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
import VideosPage from './pages/resources/VideosPage';

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
// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMaterialsPage from './pages/admin/AdminMaterialsPage';
import AdminReviewPage from './pages/admin/AdminReviewPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminPostOpportunity from './pages/admin/AdminPostOpportunity';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

import LocumPage from "./pages/opportunities/LocumPage";
import LocumRegistration from "./pages/opportunities/LocumRegistration";
import LocumDashboard from "./pages/opportunities/LocumDashboard";
import LocumPayment from "./pages/opportunities/LocumPayment";
import LocumEditProfile from "./pages/opportunities/LocumEditProfile";


// Layout wrapper for consistent Header/Footer
const Layout: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstall(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* PWA Install Floating Button */}
      {showInstall && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={handleInstallClick}
            className="bg-brand-dark text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold hover:bg-brand-primary transition-colors border-2 border-white/10"
          >
            <Download size={20} />
            Install App
          </button>
        </div>
      )}
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
          <Route path="resources/videos" element={<VideosPage />} />

          {/* Classes Route */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="locked-in" element={<LockedInChallenge />} />
          
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
        </Route>

        {/* Daily Challenge Quiz (Standalone - No Header/Footer) */}
        <Route path="challenge/quiz/:dayId" element={<DailyChallengeQuiz />} />

      


        {/* Admin Login (Public) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="materials" element={<AdminMaterialsPage />} />
          <Route path="review" element={<AdminReviewPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="post-opportunity" element={<AdminPostOpportunity />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;