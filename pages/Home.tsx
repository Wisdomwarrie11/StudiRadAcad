import React from 'react';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import ClassesPreview from '../components/home/ClassesPreview';
import OpportunitiesPreview from '../components/home/OpportunitiesPreview';
import Testimonials from '../components/home/Testimonials';
import WeeklyQuiz from '../components/home/WeeklyQuiz';
import NewsletterSignup from '../components/home/NewsletterSignup';
import FloatingCTA from '../components/home/FloatingCTA';
import HowItWorks from '../components/home/HowItWorks';
import TargetAudience from '../components/home/TargetAudience';
import TargetAudienceNew from './TargetAudienceNew';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <TargetAudience />
      <Features />
      <ClassesPreview />
      <TargetAudienceNew />
      <Testimonials />
      <OpportunitiesPreview />
      <WeeklyQuiz />
      <NewsletterSignup />
      <FloatingCTA />
    </div>
  );
};

export default Home;