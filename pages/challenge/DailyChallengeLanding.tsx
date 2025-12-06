import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Zap,
  Brain,
  ChevronRight,
  Activity,
  Layers,
  Award,
} from "lucide-react";

const DailyChallengeLanding: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in for the challenge using the specific session key
    const user = sessionStorage.getItem("studiRad_challenge_email");
    if (user) {
      navigate("/challenge/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: <Target className="text-amber-500" size={32} />,
      title: "Daily Focus",
      description: "New topics every day: Physics, Anatomy, MRI, CT, and more.",
    },
    {
      icon: <Layers className="text-blue-500" size={32} />,
      title: "Adaptive Levels",
      description:
        "Choose from Basic, Advanced, or Master difficulty levels to suit your expertise.",
    },
    {
      icon: <Trophy className="text-yellow-500" size={32} />,
      title: "Leaderboard",
      description:
        "Compete with peers and climb the ranks by maintaining your streak.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-amber-400 font-semibold text-sm mb-8 border border-slate-700">
            <Zap size={16} className="mr-2" />
            <span>Daily streaks are now live!</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            Master Radiography <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              One Day at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the community of radiographers pushing their limits. 6 days, 6
            topics, infinite growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/challenge/register"
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-500/25 flex items-center justify-center"
            >
              Start Challenge
              <ChevronRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/activities"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-lg transition-all flex items-center justify-center"
            >
              View All Activities
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Why Join the Challenge?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Strip */}
      <div className="py-12 bg-slate-100 border-y border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Technique", "Physics", "MRI", "CT", "Ultrasound", "Safety"].map(
              (topic) => (
                <span
                  key={topic}
                  className="text-xl md:text-2xl font-black text-slate-400 uppercase tracking-widest"
                >
                  {topic}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <Award className="mx-auto text-amber-400 mb-6" size={64} />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to test your knowledge?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Create your profile, select your level, and start your Day 1
            challenge immediately.
          </p>
          <Link
            to="/challenge/register"
            className="inline-flex items-center px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl hover:bg-amber-50 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeLanding;
