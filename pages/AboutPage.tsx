import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  HeartHandshake, 
  Lightbulb, 
  Globe, 
  Laptop, 
  GraduationCap, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { TEAM_MEMBERS, VOLUNTEERS, TeamMember } from './TeamData';

// Framer motion type helper
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionDiv = motion.div as any;

// Helper to get initials from a name
const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'SR';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Team Member Card with fallback placeholder
const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1">
      {/* Avatar Container */}
      <div className="relative w-32 h-40 sm:w-33 sm:h-32 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-inner flex items-center justify-center">
        {!imageError && member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-amber-50 text-slate-700">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-base mb-1 shadow-sm">
              {getInitials(member.name)}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">StudiRad</span>
          </div>
        )}

        {/* Status / Category Badge */}
        <span 
          className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
            member.type === 'member'
              ? 'bg-indigo-600 text-white'
              : member.type === 'volunteer'
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 text-white'
          }`}
        >
{member.type === 'member'
  ? 'Core'
  : member.type === 'volunteer'
    ? 'Volunteer'
    : 'Contributor'}        </span>
      </div>

      {/* Info */}
      <h4 className="text-base font-bold text-slate-900 leading-snug mb-1 group-hover:text-brand-primary transition-colors">
        {member.name}
      </h4>
      <p className="text-xs font-semibold text-brand-primary mb-2 line-clamp-2">
        {member.role}
      </p>
      {member.department && (
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
          {member.department}
        </span>
      )}
    </div>
  );
};

const AboutPage: React.FC = () => {
  // State for collapsible Team sections
  const [activeTab, setActiveTab] = useState<'all' | 'members' | 'volunteers'>('all');
  const [isCoreOpen, setIsCoreOpen] = useState(true);
  const [isVolunteersOpen, setIsVolunteersOpen] = useState(true);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  const displayedMembers = TEAM_MEMBERS;
  const displayedVolunteers = VOLUNTEERS;

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title="About Us"
        description="Meet StudiRad: Powering Radiography learning with innovation, access, and real connection."
      />

      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[520px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Radstudents1.jpg" 
            alt="Radiography Students" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/radioroom.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 mt-2 max-w-4xl">
          <MotionH1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Meet <span className="text-amber-400">StudiRad</span>
          </MotionH1>
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Powering Radiography learning with innovation, access, and real connection.
          </MotionP>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        {/* What We Stand For */}

        <section id="team" className="mb-24 scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-xs font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              The People Behind StudiRad
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Meet the Team
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Our community is powered by dedicated academic educators, and passionate volunteers.
            </p>

            {/* Category Filter Tabs */}
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl mt-6 border border-slate-300/60 max-w-md w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({TEAM_MEMBERS.length + VOLUNTEERS.length})
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'members'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={14} /> Team Members ({TEAM_MEMBERS.length})
              </button>
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'volunteers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HeartHandshake size={14} /> Contributors & Volunteers ({VOLUNTEERS.length})
              </button>
            </div>
          </div>

          {/* Group 1: Team Members (Collapsible section) */}
          {(activeTab === 'all' || activeTab === 'members') && (
            <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Team Members
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-extrabold">
                        {TEAM_MEMBERS.length}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Core leadership, educators, and curriculum coordinators</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCoreOpen(!isCoreOpen)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                  aria-label="Toggle team members"
                >
                  <span className="hidden sm:inline">{isCoreOpen ? 'Collapse' : 'Expand'}</span>
                  {isCoreOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isCoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {displayedMembers.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Group 2: Volunteers (Collapsible section) */}
          {(activeTab === 'all' || activeTab === 'volunteers') && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-12">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Contributors & Volunteers 
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-extrabold">
                        {VOLUNTEERS.length}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Campus leaders, peer tutors, content contributors, and moderators</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsVolunteersOpen(!isVolunteersOpen)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                  aria-label="Toggle volunteers"
                >
                  <span className="hidden sm:inline">{isVolunteersOpen ? 'Collapse' : 'Expand'}</span>
                  {isVolunteersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isVolunteersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {displayedVolunteers.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-28">
          <MotionDiv 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
              <img 
                src="/mission1.jpeg" 
                alt="Our Mission" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = '/radlearning1.jpeg'; }}
              />
            </div>
          </MotionDiv>
          <div className="order-2">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Our Mission</h3>
            </div>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              StudiRad is committed to supporting radiography students and professionals by providing accessible, high-quality digital education, structured mentorship, and timely information on career opportunities—including jobs, internships, and scholarships—thereby bridging the gap between academic training and professional success.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-28">
          <MotionDiv 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
              <img 
                src="/vision.jpeg" 
                alt="Our Vision" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = '/visionpeople.jpg'; }}
              />
            </div>
          </MotionDiv>
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shadow-sm">
                <Globe size={24} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Our Vision</h3>
            </div>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              To become the leading digital learning and mentorship hub that empowers radiography students and professionals globally to achieve academic excellence, clinical competence, and sustainable career growth.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MEET THE TEAM SECTION (Team Members & Volunteers) */}
        {/* ========================================================================= */}
       

        {/* Collaboration Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm">
                  <HeartHandshake size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Support & Collaboration</h3>
              </div>
              <p className="text-base text-slate-600 mb-6 font-normal leading-relaxed">
                Are you a Radiography professional, educator, or organization that believes in this mission? Let’s work together to expand access to quality learning.
              </p>

              {/* Partnership Options */}
              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full shrink-0"></span> Partnering as a tutor or mentor
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full shrink-0"></span> Donating learning materials or access
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full shrink-0"></span> Sponsoring students or specific course series
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full shrink-0"></span> Helping us spread the word across campuses
                </li>
              </ul>

              {/* Collapsible details toggle */}
              <button
                onClick={() => setIsCollabOpen(!isCollabOpen)}
                className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>{isCollabOpen ? 'Hide partnership FAQs' : 'View partnership details'}</span>
                {isCollabOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {isCollabOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                      <p><strong>Educators:</strong> Deliver focused masterclasses or case-study sessions in X-ray, CT, MRI, and Ultrasound.</p>
                      <p><strong>Clinical Facilities:</strong> Share internship openings, locum calls, and scholarship opportunities directly with verified radiography talent.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <a 
                  href="mailto:studiradinfo@gmail.com" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <Mail size={16} /> Contact Us: studiradinfo@gmail.com
                </a>
              </div>
            </div>

            <div className="relative h-64 md:h-full min-h-[300px] rounded-3xl overflow-hidden shadow-md">
              <img 
                src="/colab.jpeg" 
                alt="Collaboration" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/radioroom.jpeg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Values Cards */}
        <div className="text-center mb-10">
          <span className="text-xs font-black tracking-widest text-brand-primary uppercase bg-brand-primary/10 px-3.5 py-1 rounded-full">
            Core Benefits
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">What You’ll Get</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Everything you need to succeed in your radiography education and clinical career.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "On-demand Courses",
              text: "Structured, affordable, and created specifically for Radiography students and interns.",
              icon: Laptop,
              color: "text-blue-500",
              bg: "bg-blue-50"
            },
            {
              title: "Live Classes",
              text: "Join real-time interactive sessions and image critique workshops with top instructors.",
              icon: GraduationCap,
              color: "text-amber-500",
              bg: "bg-amber-50"
            },
            {
              title: "1-on-1 Support",
              text: "Request personal guidance for tough physics, anatomy, and clinical interpretation topics.",
              icon: Users,
              color: "text-emerald-500",
              bg: "bg-emerald-50"
            }
          ].map((item, index) => (
            <MotionDiv 
              key={index}
              whileHover={{ y: -4 }}
              className="bg-white p-7 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 text-center transition-all"
            >
              <div className={`w-14 h-14 mx-auto ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                <item.icon size={28} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">{item.text}</p>
            </MotionDiv>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
