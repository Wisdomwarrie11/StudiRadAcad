
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Flame, Timer, Building2, ShieldCheck, GraduationCap, CheckCircle2 } from "lucide-react";
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

  const webinars = [
    {
      id: 1,
      title: "Inside Radiography: Stepping into MRI - The roles. The reality. The rewards",
      date: "17th February 2026",
      description:
        "An astute professional shares his journey from Nigeria to becoming a clinical leader in MRI in a well-known hospital in England. In this webinar, he shares roadmaps and advice for young radiographers and students",
      image: "Episode 2.jpg",
      link: "https://meeting.zoho.com/meeting/public/videoprv?recordingId=e12039b9018aa0c2709dfaa42214bb4606c2c8723052b050829ca64e516ef474&x-meeting-org=912113804",
      badge: "Completed",
      isHot: false,
      disabled: false,
      buttonText: "View Archive"
    },
    {
      id: 2,
      title: "Welcome to Radiography Orientation",
      date: "Past Event",
      description:
        "An exclusive orientation for new-year radiography students and prospects. Get the roadmap to a successful radiography career and connect with mentors.",
      image: "WelcomeToRad.jpeg",
      link: "https://meeting.zoho.com/meeting/public/videoprv?recordingId=d773f3a431c4b27afb901502197896b774f11af4e97e79853e5ccfc38974ccff&x-meeting-org=912113804",
      badge: "Completed",
      isHot: false,
      disabled: false,
      buttonText: "View Archive"
    },


    {
      id: 3,
      title: "Inside Radiography: The NeuroImaging Experience",
      date: "Past Event",
      description:
        "An educating session introducing Radiographers to neuroimaging and its role in modern medical Imaging and diagnosis.",
      image: "Episode 1.jpg",
      link: "#",
      badge: "Completed",
      disabled: true,
      buttonText: "View Archive"
    },
    {
      id: 4,
      title: "From Induction to Impact: Navigating the Journey",
      date: "Past Event",
      description:
        "Four keynote speakers share insights on thriving during your induction period and navigating your long-term career path.",
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
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Our Webinars
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Stay ahead with our orientation programs, and specialized educational events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {webinars.map((activity) => {
            const isModal = activity.link === "open-modal";
            const isInternal = !isModal && activity.link.startsWith("/");
            const disabled = activity.disabled;

            return (
              <div
                key={activity.id}
                className={`flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg border hover:shadow-2xl transition-all duration-500 relative group/card ${
                  activity.isHot
                    ? "border-amber-400 ring-4 ring-amber-100/50"
                    : activity.isUrgent
                    ? "border-rose-400 ring-4 ring-rose-100/50"
                    : "border-slate-100"
                }`}
              >
                {/* Status Ribbons */}
                {activity.isHot && (
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-br-2xl z-20 flex items-center uppercase tracking-widest shadow-md">
                    <Flame className="mr-1.5 animate-pulse" size={14} /> {activity.id === 6 ? "Essential" : "New"}
                  </div>
                )}
                {activity.isUrgent && (
                  <div className="absolute top-0 left-0 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-br-2xl z-20 flex items-center uppercase tracking-widest shadow-md">
                    <Timer className="mr-1.5" size={14} /> Closing Soon
                  </div>
                )}

                {/* Image Container with Responsive Aspect Ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest z-10">
                    {activity.badge}
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 p-8 flex flex-col">
                  <div className={`flex items-center text-[10px] font-black mb-4 uppercase tracking-widest ${activity.isUrgent ? 'text-rose-600' : 'text-amber-600'}`}>
                    <Calendar className="mr-2" size={14} />
                    {activity.date}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover/card:text-brand-primary transition-colors">
                    {activity.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                    {activity.description}
                  </p>

                  <div className="mt-auto">
                    {isModal ? (
                      <button
                        onClick={() => setShowOrientationModal(true)}
                        className="inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-2xl transition-all group bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20 active:scale-95"
                      >
                        {activity.buttonText}
                        <ExternalLink
                          className="ml-2 text-xs opacity-70 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                          size={14}
                        />
                      </button>
                    ) : isInternal ? (
                      <Link
                        to={disabled ? "#" : activity.link}
                        onClick={(e) => disabled && e.preventDefault()}
                        className={`inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-2xl transition-all group ${
                          activity.isHot
                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20"
                            : activity.isUrgent
                            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/20"
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10"
                        } ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95"}`}
                      >
                        {disabled ? "Past Event" : activity.buttonText}
                        {!disabled && (
                          <ExternalLink
                            className="ml-2 text-xs opacity-70 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                            size={14}
                          />
                        )}
                      </Link>
                    ) : (
                      <a
                        href={activity.link}
                        onClick={(e) => disabled && e.preventDefault()}
                        className={`inline-flex items-center justify-center w-full px-6 py-4 font-black text-sm rounded-2xl transition-all group ${
                          disabled 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 active:scale-95"
                        }`}
                      >
                        {disabled ? "Archive Closed" : "Learn More"}
                        {!disabled && (
                          <ExternalLink
                            className="ml-2 text-xs opacity-70 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                            size={14}
                          />
                        )}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
       
      </div>
    </div>
  );
};

export default ActivitiesPage;
