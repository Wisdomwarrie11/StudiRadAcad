
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Flame, Timer, Building2, ShieldCheck, GraduationCap } from "lucide-react";
import SEO from "../components/SEO";
import OrientationRegistrationModal from "../components/orientation/OrientationRegistrationModal";

const ActivitiesPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showOrientationModal, setShowOrientationModal] = useState(false);

  useEffect(() => {
    // Check if user is registered for the challenge
    const user = sessionStorage.getItem("studiRad_challenge_email") || localStorage.getItem("studiRad_challenge_email");
    setLoggedIn(!!user);
  }, []);

  const activities = [
    {
      id: 6,
      title: "Welcome to Radiography Orientation",
      date: "Feb 6, 2026 • 7:00 PM",
      description:
        "An exclusive orientation for new-year radiography students and prospects. Get the roadmap to a successful radiography career.",
      image: "WelcomeToRad.jpeg", // Users will replace with their flyer
      link: "open-modal",
      badge: "Incoming",
      isHot: true,
      disabled: false,
      buttonText: "Register for Orientation"
    },
    {
      id: 4,
      title: "Daily Radiography Challenge",
      date: "Starts Daily",
      description:
        "A 6-day intensive challenge tailored to your level. Physics, Technique, MRI, CT and more. Join the leaderboard!",
      image: "Radstudent.jpg",
      link: loggedIn ? "/challenge/dashboard" : "/challenge",
      badge: loggedIn ? "Active Account" : "New Feature",
      isHot: false,
      disabled: false,
      buttonText: loggedIn ? "Go to Dashboard" : "Start Challenge"
    },
    // {
    //   id: 3,
    //   title: "6 Weeks Locked-In Challenge",
    //   date: "Registration Closing Soon",
    //   description:
    //     "6 weeks of intense studies and assessment designed to push your limits and master core concepts. Final slots available.",
    //   image: "LockedIn.jpg",
    //   link: "/locked-in",
    //   badge: "Final Call",
    //   isUrgent: true,
    //   disabled: true,
    //   buttonText: "Register Now"
    // },
    {
      id: 2,
      title: "Inside Radiography: The NeuroImaging Experience",
      date: "Past Event",
      description:
        "An educating session introducing Radiographers to neuroimaging and its role in medical Imaging.",
      image: "Episode 1.jpg",
      link: "#",
      badge: "Completed",
      disabled: true,
      buttonText: "View Archive"
    },
    {
      id: 1,
      title: "From Induction to Impact: Navigating the Radiographer’s Journey",
      date: "Past Event",
      description:
        "Four keynote speakers share insights on thriving during your induction period and navigating your career path.",
      image: "StudiRad.jpg",
      link: "#",
      badge: "Completed",
      disabled: true,
      buttonText: "View Archive"
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20 mt-16">
      <SEO 
        title="Events & Activities"
        description="Join StudiRad's radiography challenges, orientation programs, and events. Master Physics, MRI, and CT concepts."
      />
      
      <OrientationRegistrationModal 
        isOpen={showOrientationModal} 
        onClose={() => setShowOrientationModal(false)} 
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Activities & Events
          </h2>
          <p className="text-lg text-slate-600">
            Stay ahead with our community challenges, orientation programs, and educational events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const isModal = activity.link === "open-modal";
            const isInternal = !isModal && activity.link.startsWith("/");
            const disabled = activity.disabled;

            return (
              <div
                key={activity.id}
                className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border hover:shadow-2xl transition-all duration-300 relative ${
                  activity.isHot
                    ? "border-amber-400 ring-4 ring-amber-100"
                    : activity.isUrgent
                    ? "border-rose-400 ring-4 ring-rose-100"
                    : "border-slate-100"
                }`}
              >
                {activity.isHot && (
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-br-lg z-10 flex items-center uppercase tracking-widest">
                    <Flame className="mr-1" size={14} /> {activity.id === 6 ? "ESSENTIAL" : "NEW"}
                  </div>
                )}
                {activity.isUrgent && (
                  <div className="absolute top-0 left-0 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-br-lg z-10 flex items-center uppercase tracking-widest">
                    <Timer className="mr-1" size={14} /> Closing Soon
                  </div>
                )}

                <div className="relative h-56 overflow-hidden bg-slate-200 group">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest">
                    {activity.badge}
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <div className={`flex items-center text-xs font-black mb-3 uppercase tracking-wider ${activity.isUrgent ? 'text-rose-600' : 'text-amber-600'}`}>
                    <Calendar className="mr-2" size={14} />
                    {activity.date}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {activity.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                    {activity.description}
                  </p>

                  {isModal ? (
                    <button
                        onClick={() => setShowOrientationModal(true)}
                        className={`mt-auto inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-xl transition-all group bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 active:scale-95`}
                    >
                        {activity.buttonText}
                        <ExternalLink
                          className="ml-2 text-xs opacity-70 group-hover:translate-x-1 transition-transform"
                          size={14}
                        />
                    </button>
                  ) : isInternal ? (
                    <Link
                      to={disabled ? "#" : activity.link}
                      onClick={(e) => disabled && e.preventDefault()}
                      className={`mt-auto inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-xl transition-all group ${
                        activity.isHot
                          ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                          : activity.isUrgent
                          ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
                    >
                      {disabled ? "Past Event" : activity.buttonText}
                      {!disabled && (
                        <ExternalLink
                          className="ml-2 text-xs opacity-70 group-hover:translate-x-1 transition-transform"
                          size={14}
                        />
                      )}
                    </Link>
                  ) : (
                    <a
                      href={activity.link}
                      onClick={(e) => disabled && e.preventDefault()}
                      className="mt-auto inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-xl transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:scale-95"
                    >
                      {disabled ? "Archive" : "Learn More"}
                      {!disabled && (
                        <ExternalLink
                          className="ml-2 text-xs opacity-70 group-hover:translate-x-1 transition-transform"
                          size={14}
                        />
                      )}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
