import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Flame } from "lucide-react";
import SEO from "../components/SEO";

const ActivitiesPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for the challenge-specific session key OR persistent local storage
    const user = sessionStorage.getItem("studiRad_challenge_email") || localStorage.getItem("studiRad_challenge_email");
    setLoggedIn(!!user);
  }, []);

  const activities = [
    {
      id: 4,
      title: "Daily Radiography Challenge",
      date: "Starts Daily",
      description:
        "A 6-day intensive challenge tailored to your level. Physics, Technique, MRI, CT and more. Join the leaderboard!",
      image:
        "Radstudent.jpg",
      link: loggedIn ? "/challenge/dashboard" : "/challenge",
      badge: "New Feature",
      isHot: true,
      disabled: false,
    },
    {
      id: 3,
      title: "6 Weeks Locked-In Challenge",
      date: "Coming Soon",
      description:
        "6 weeks of intense studies and assessment designed to push your limits and master core concepts.",
      image: "LockedIn.jpg",
      link: "#",
      badge: "Challenge",
      disabled: true,
    },
    {
      id: 2,
      title: "Inside Radiography: The NeuroImaging Experience",
      date: "Past Event",
      description:
        "An educating session introducing Radiographers to neuroimaging and its role in medical Imaging.",
      image: "Episode 1.jpg",
      link: "#",
      badge: "Past Event",
      disabled: true,
    },
    {
      id: 1,
      title: "From Induction to Impact: Navigating the Radiographer’s Journey",
      date: "Past Event",
      description:
        "Four keynote speakers share insights on thriving during your induction period and navigating your career path.",
      image: "StudiRad.jpg",
      link: "#",
      badge: "Past Event",
      disabled: true,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20 mt-16">
      <SEO 
        title="Events & Activities"
        description="Join StudiRad's radiography challenges, webinars, and events. Participate in the Daily 6-Day Challenge to master Physics, MRI, and CT concepts."
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Activities & Events
          </h2>
          <p className="text-lg text-slate-600">
            Stay updated with our latest challenges, webinars, and events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const isInternal = activity.link.startsWith("/");
            const disabled = activity.disabled;

            return (
              <div
                key={activity.id}
                className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border hover:shadow-2xl transition-all duration-300 relative ${
                  activity.isHot
                    ? "border-amber-400 ring-4 ring-amber-100"
                    : "border-slate-100"
                }`}
              >
                {activity.isHot && (
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 flex items-center">
                    <Flame className="mr-1" size={14} /> HOT
                  </div>
                )}

                {/* Image */}
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
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
                    {activity.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center text-sm text-amber-600 font-semibold mb-3">
                    <Calendar className="mr-2" size={16} />
                    {activity.date}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {activity.title}
                  </h3>

                  <p className="text-slate-600 mb-6 flex-grow">
                    {activity.description}
                  </p>

                  {/* Button */}
                  {isInternal ? (
                    <Link
                      to={disabled ? "#" : activity.link}
                      onClick={(e) => disabled && e.preventDefault()}
                      className={`mt-auto inline-flex items-center justify-center w-full px-6 py-3 font-bold rounded-xl transition-colors group ${
                        activity.isHot
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {disabled
                        ? activity.badge === "Past Event"
                          ? "Past Event"
                          : "Coming Soon"
                        : "View"}
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
                      className={`mt-auto inline-flex items-center justify-center w-full px-6 py-3 font-bold rounded-xl transition-colors group ${
                        activity.isHot
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {disabled ? "Unavailable" : "Learn More"}
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