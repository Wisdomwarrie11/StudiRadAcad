
import React from 'react';
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

const activities = [
  {
    id: 3,
    title: "6 Weeks Locked-In Challenge",
    date: "Coming Soon",
    description: "6 weeks of intense Studies and assessment designed to push your limits and master core concepts.",
    image: "LockedIn.jpg",
    link: "#/locked-in",
    badge: "Challenge"
  },
  {
    id: 2,
    title: "Inside Radiography: The NeuroImaging Experience",
    date: "7th November 2025",
    description: "An educating session designed to introduce Radiographers to the concept of neuroimaging and its role in medical Imaging.",
    image: "Episode 1.jpg",
    link: "#",
    badge: "Webinar"
  },
  {
    id: 1,
    title: "From Induction to Impact: Navigating the Radiographer’s Journey",
    date: "September 20, 2025, 8:00 PM (WAT)",
    description: "Join four keynote speakers as they share insights on making the best use of your induction period and navigating your career path.",
    image: "StudiRad.jpg",
    link: "/webinarRegistration",
    badge: "Past Event"
  },
];

const ActivitiesPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20 mt-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Activities & Events</h2>
          <p className="text-lg text-slate-600">
            Stay updated with our latest challenges, webinars, and conferences designed for the modern radiographer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-slate-200 group">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'; }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
                  {activity.badge}
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center text-sm text-amber-600 font-semibold mb-3">
                  <FaCalendarAlt className="mr-2" />
                  {activity.date}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                  {activity.title}
                </h3>
                
                <p className="text-slate-600 mb-6 flex-grow">
                  {activity.description}
                </p>
                
                <a
                  href={activity.link}
                  className="mt-auto inline-flex items-center justify-center w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors group"
                >
                  {activity.link.startsWith('#') ? 'Learn More' : 'Register Now'}
                  <FaExternalLinkAlt className="ml-2 text-xs opacity-70 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
