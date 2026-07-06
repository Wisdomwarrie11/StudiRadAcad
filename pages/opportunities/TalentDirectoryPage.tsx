import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Search,
  Filter,
  Loader2,
  Heart,
  Check,
  ShieldAlert,
  Award,
  Briefcase,
  FileText,
  Lock,
  Unlock,
  User,
  X,
  UserCheck,
  Mail,
  Phone,
  Eye,
  ArrowRight
} from "lucide-react";
import SEO from "../../components/SEO";
import {
  AVATARS,
  TalentProfile,
  TalentRegistrationSection,
} from "./TalentRegistrationSection";

const TalentDirectoryPage = () => {
  // Navigation tabs - client-facing terminology
  const [activeTab, setActiveTab] = useState<"browse" | "register">("browse");

  // Selected profile for detailed modal view
  const [selectedCandidate, setSelectedCandidate] = useState<TalentProfile | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJob, setFilterJob] = useState(true);
  const [filterInternship, setFilterInternship] = useState(true);

  // Availability List State
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Employer Disclaimer Agreement State
  const [employerAgreed, setEmployerAgreed] = useState(() => {
    return localStorage.getItem("studirad_employer_talent_agreement") === "true";
  });

  // Likes system state
  const [likedEmails, setLikedEmails] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("studirad_liked_emails") || "[]");
    } catch (e) {
      return [];
    }
  });

  // Clipboard copy helper
  const [copiedId, setCopiedId] = useState<string>("");
  const handleCopyText = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCandidate(null);
      }
    };
    if (selectedCandidate) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCandidate]);

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const snapshot = await getDocs(collection(db, "talentProfiles"));
      const list = snapshot.docs.map((doc) => doc.data() as TalentProfile);
      // Sort: highest likesCount first, then newest
      list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      setProfiles(list);
    } catch (err) {
      console.error("Error fetching talent profiles:", err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleAgreeEmployerDisclaimer = () => {
    localStorage.setItem("studirad_employer_talent_agreement", "true");
    setEmployerAgreed(true);
  };

  const handleToggleLike = async (candidate: TalentProfile) => {
    const emailKey = candidate.email.toLowerCase();
    const isLiked = likedEmails.includes(emailKey);
    
    // Update local state and local storage first (optimistic update)
    let updatedLikedEmails: string[];
    if (isLiked) {
      updatedLikedEmails = likedEmails.filter(e => e !== emailKey);
    } else {
      updatedLikedEmails = [...likedEmails, emailKey];
    }
    setLikedEmails(updatedLikedEmails);
    localStorage.setItem("studirad_liked_emails", JSON.stringify(updatedLikedEmails));

    // Optimistically update candidate likes Count in the profiles list
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.email.toLowerCase() === emailKey) {
          const count = p.likesCount || 0;
          return { ...p, likesCount: Math.max(0, isLiked ? count - 1 : count + 1) };
        }
        return p;
      })
    );

    // Optimistically update selectedCandidate if it matches
    if (selectedCandidate && selectedCandidate.email.toLowerCase() === emailKey) {
      const count = selectedCandidate.likesCount || 0;
      setSelectedCandidate({
        ...selectedCandidate,
        likesCount: Math.max(0, isLiked ? count - 1 : count + 1)
      });
    }

    try {
      const docRef = doc(db, "talentProfiles", emailKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentLikes = docSnap.data().likesCount || 0;
        const newLikes = Math.max(0, isLiked ? currentLikes - 1 : currentLikes + 1);
        
        await updateDoc(docRef, {
          likesCount: newLikes
        });

        // Sync with exact server count
        setProfiles((prev) =>
          prev.map((p) =>
            p.email.toLowerCase() === emailKey
              ? { ...p, likesCount: newLikes }
              : p
          )
        );

        if (selectedCandidate && selectedCandidate.email.toLowerCase() === emailKey) {
          setSelectedCandidate(prev => prev ? { ...prev, likesCount: newLikes } : null);
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert state on failure
      setLikedEmails(likedEmails);
      localStorage.setItem("studirad_liked_emails", JSON.stringify(likedEmails));
      fetchProfiles(); // refetch to correct counts
    }
  };

  // Filter list
  const filteredProfiles = profiles.filter((p) => {
    // Hide completely inactive profiles
    if (p.isActiveAvailability === false) {
      return false;
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.skills && p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (p.certifications && p.certifications.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      p.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      (filterJob && p.availableForJob) || (filterInternship && p.availableForInternship);

    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 pt-20 sm:pt-24 pb-16 px-3 sm:px-4 font-sans relative">
      <SEO
        title="Open to Work Directory"
        description="Connect with qualified Radiography professionals available for immediate hire or internships. StudiRad Career Hub."
      />

      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-light text-slate-900 tracking-tight leading-tight sm:leading-none mb-4">
            Open to Work <span className="font-sans font-black uppercase tracking-tighter text-amber-550">hub</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-550 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
            A direct directory connecting clinics and hospitals with available radiographers and imaging interns.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10 px-2">
          <div className="bg-slate-100 p-1.5 rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row w-full max-w-md sm:w-auto gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center transition-all w-full sm:w-auto cursor-pointer ${
                activeTab === "browse" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Search className="w-3.5 h-3.5 mr-2" /> Browse Professionals
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center transition-all w-full sm:w-auto cursor-pointer ${
                activeTab === "register" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 mr-2" /> Create or Edit Profile
            </button>
          </div>
        </div>

        {activeTab === "browse" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Employer Terms Disclaimer banner */}
            {!employerAgreed ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">Verification Notice for Employers</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      StudiRad is a connecting platform and does not pre-vet candidates. We strongly advise employers to conduct standard credential checks and verify professional references before making any hiring decisions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAgreeEmployerDisclaimer}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex-shrink-0 animate-pulse cursor-pointer hover:scale-[1.02]"
                >
                  I Understand, Show Contacts
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 text-slate-800 rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200">
                <div className="flex items-start sm:items-center gap-3">
                  <Check className="text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" size={18} />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-600 leading-relaxed">Notice accepted</span>
                </div>
            
              </div>
            )}

            {/* Filter controls bar */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, specialties, or certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all duration-200"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-start md:justify-end w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Filter size={14} /> Filter by Role:
                </span>
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 select-none shadow-sm transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterJob}
                    onChange={(e) => setFilterJob(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  Job seekers
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 select-none shadow-sm transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterInternship}
                    onChange={(e) => setFilterInternship(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  Intern Candidates
                </label>
              </div>
            </div>

            {/* Profile cards grid */}
            {loadingProfiles ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-amber-500" size={36} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading available professionals...</span>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="bg-slate-50/80 rounded-2xl p-16 text-center border border-slate-200">
                <User size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="font-bold text-lg text-slate-700">No Candidates Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                  No profiles match your search criteria. Try adjusting your filters, or register your profile to get listed!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((candidate, idx) => {
                  const avatar = (AVATARS && AVATARS.find((a) => a.id === candidate.avatarId)) || (AVATARS && AVATARS[2]) || {
                    id: "female_face_1",
                    name: "Imaging Sonographer (Female)",
                    emoji: "👩‍⚕️",
                    bg: "bg-rose-50/50 border-rose-100"
                  };
                  const isIntern = candidate.availableForInternship;
                  const gradientHeader = isIntern 
                    ? "from-indigo-50/40 via-slate-50/5 to-transparent" 
                    : "from-amber-50/40 via-slate-50/5 to-transparent";
                  const topAccent = isIntern
                    ? "bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500"
                    : "bg-gradient-to-r from-brand-accent via-amber-350 to-amber-500";

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/80 hover:border-amber-400/40 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1"
                    >
                      {/* Premium Dynamic Accent Line */}
                      <div className={`h-1.5 ${topAccent}`}></div>

                      {/* Snippet Card Body */}
                      <div className={`p-5 space-y-4 bg-gradient-to-b ${gradientHeader} flex-1 flex flex-col justify-between`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Avatar bubble */}
                              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl border ${avatar?.bg || "bg-rose-50/50 border-rose-100"} shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 flex-shrink-0`}>
                                {avatar?.emoji || "👩‍⚕️"}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 tracking-tight truncate max-w-[130px] sm:max-w-[170px]">{candidate.name}</h3>
                                  <span className={`inline-flex w-2 h-2 rounded-full ${isIntern ? "bg-indigo-500" : "bg-amber-500"} animate-pulse flex-shrink-0`} title="Active Status"></span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block truncate max-w-[130px] sm:max-w-[170px] mt-0.5">{candidate.qualification}</span>
                              </div>
                            </div>

                            {/* Likes Quick Heart */}
                            <button
                              onClick={() => handleToggleLike(candidate)}
                              className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex-shrink-0 ${
                                likedEmails.includes(candidate.email.toLowerCase())
                                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"
                              }`}
                              title={likedEmails.includes(candidate.email.toLowerCase()) ? "Remove Save" : "Save Profile"}
                            >
                              <Heart
                                className={likedEmails.includes(candidate.email.toLowerCase()) ? "fill-rose-500 text-rose-500" : ""}
                                size={12}
                              />
                            </button>
                          </div>

                          {/* Availability Badge */}
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {candidate.availableForJob && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-850 text-[9px] font-bold uppercase tracking-wider border border-amber-200/40 flex items-center gap-1 shadow-sm">
                                <Briefcase size={9} className="text-amber-600" /> Permanent
                              </span>
                            )}
                            {candidate.availableForInternship && (
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-850 text-[9px] font-bold uppercase tracking-wider border border-indigo-200/40 flex items-center gap-1 shadow-sm">
                                <Award size={9} className="text-indigo-600" /> Intern
                              </span>
                            )}
                          </div>

                          {/* Specialties snapshot (limited to 3) */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Core Modalities</span>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 3).map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-2 py-0.5 text-[9px] font-semibold truncate max-w-[100px]"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                  <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded-lg px-2 py-0.5 text-[8px] font-bold">
                                    +{candidate.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive View Details Button */}
                        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 font-medium">
                            {candidate.likesCount || 0} Saves
                          </span>
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all hover:translate-x-0.5 active:translate-x-0 cursor-pointer"
                          >
                            <span>View Profile</span>
                            <Eye size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <TalentRegistrationSection onProfileChange={fetchProfiles} />
        )}
      </div>

      {/* Interactive Profile Details Modal Overlay */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Ambient Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setSelectedCandidate(null)}
          />

          {/* Modal Container Card */}
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 transform transition-all duration-300 animate-scaleUp flex flex-col max-h-[85vh] z-10">
            {/* Top Decorative Specialty Strip */}
            <div className={`h-2.5 w-full shrink-0 ${
              selectedCandidate.availableForInternship 
                ? "bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500" 
                : "bg-gradient-to-r from-brand-accent via-amber-350 to-amber-500"
            }`}></div>

            {/* Circular Close Button */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer border border-slate-200/50 hover:rotate-90"
              title="Close Profile"
            >
              <X size={18} />
            </button>

            {/* Scrollable Container Body */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-7">
              {/* Profile Header Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-slate-100">
                {/* Large Avatar Bubble */}
                {(() => {
                  const avatar = (AVATARS && AVATARS.find((a) => a.id === selectedCandidate.avatarId)) || (AVATARS && AVATARS[2]) || {
                    id: "female_face_1",
                    name: "Imaging Sonographer (Female)",
                    emoji: "👩‍⚕️",
                    bg: "bg-rose-50/50 border-rose-100"
                  };
                  return (
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl border ${avatar?.bg || "bg-rose-50/50 border-rose-100"} shadow-md flex-shrink-0 ring-4 ring-slate-50`}>
                      {avatar?.emoji || "👩‍⚕️"}
                    </div>
                  );
                })()}

                {/* Candidate Core Identity */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 tracking-tight leading-tight break-words">
                      {selectedCandidate.name}
                    </h2>
                    <span 
                      className={`inline-flex w-2.5 h-2.5 rounded-full ${selectedCandidate.availableForInternship ? "bg-indigo-500" : "bg-amber-500"} animate-pulse flex-shrink-0`} 
                      title="Open to offers"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block break-words">
                    {selectedCandidate.qualification}
                  </span>

                  {/* Active Availability Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedCandidate.availableForJob && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-850 text-[9px] font-bold uppercase tracking-wider border border-amber-200/40 flex items-center gap-1.5 shadow-xs">
                        <Briefcase size={10} className="text-amber-600" /> Permanent Role
                      </span>
                    )}
                    {selectedCandidate.availableForInternship && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-850 text-[9px] font-bold uppercase tracking-wider border border-indigo-200/40 flex items-center gap-1.5 shadow-xs">
                        <Award size={10} className="text-indigo-600" /> Clinical Intern
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Summary Segment */}
              {selectedCandidate.experience && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" /> Professional Background Summary
                  </span>
                  <div className="bg-gradient-to-r from-slate-50/80 to-indigo-50/15 border border-slate-100 rounded-2xl p-5 text-xs sm:text-sm text-slate-600 leading-relaxed italic relative">
                    <span className="absolute top-2 left-2 text-slate-200 text-3xl font-serif select-none pointer-events-none">“</span>
                    <p className="relative z-10 pl-3">
                      {selectedCandidate.experience}
                    </p>
                  </div>
                </div>
              )}

              {/* Specialties & Modalities Detailed Badge Cloud */}
              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Specialties & Clinical Modalities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-50 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-100 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Detailed Cloud */}
              {selectedCandidate.certifications && selectedCandidate.certifications.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Award size={12} className="text-amber-500" /> Professional Qualifications & Registrations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        className="bg-amber-50/50 border border-amber-200/50 text-amber-700 rounded-xl px-3.5 py-1.5 text-xs font-bold hover:bg-amber-100/30 transition-colors"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Employer Disclaimer Agreement Block */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                {employerAgreed ? (
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                      <Unlock size={12} className="text-emerald-600" /> Contact channels unlocked
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {/* Phone Channel */}
                      <button
                        onClick={() => handleCopyText(selectedCandidate.phone, `modal-${selectedCandidate.email}-phone`)}
                        className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn cursor-pointer"
                        title="Click to copy phone number"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone size={14} className="text-slate-400 group-hover/btn:text-amber-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-700 font-mono truncate">{selectedCandidate.phone}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-550 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded border border-slate-200 flex-shrink-0">
                          {copiedId === `modal-${selectedCandidate.email}-phone` ? "Copied!" : "Copy"}
                        </span>
                      </button>

                      {/* Email Channel */}
                      <button
                        onClick={() => handleCopyText(selectedCandidate.email, `modal-${selectedCandidate.email}-email`)}
                        className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn cursor-pointer"
                        title="Click to copy email address"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail size={14} className="text-slate-400 group-hover/btn:text-amber-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-700 font-mono truncate">{selectedCandidate.email}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-550 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded border border-slate-200 flex-shrink-0">
                          {copiedId === `modal-${selectedCandidate.email}-email` ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/30 border border-amber-100/60 rounded-2xl p-5 space-y-4 text-center">
                    <div className="flex flex-col items-center gap-1 text-amber-850">
                      <Lock size={20} className="text-amber-600 mb-1" />
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">Candidate Contact Channels Locked</h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mt-1">
                        To protect medical professionals from unsolicited communications, you must accept the employer disclosure agreement before viewing channels.
                      </p>
                    </div>
                    <button
                      onClick={() => handleAgreeEmployerDisclaimer()}
                      className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md inline-block cursor-pointer"
                    >
                      Acknowledge & Unlock Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="bg-slate-50 px-6 sm:px-8 py-5 border-t border-slate-150 flex items-center justify-between gap-4 shrink-0 mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  {likedEmails.includes(selectedCandidate.email.toLowerCase()) ? "Saved Profile" : "Profile Saves"}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-2.5 py-1 rounded-lg font-mono">
                  {selectedCandidate.likesCount || 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLike(selectedCandidate)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm transform active:scale-95 cursor-pointer ${
                    likedEmails.includes(selectedCandidate.email.toLowerCase())
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <Heart size={14} className={likedEmails.includes(selectedCandidate.email.toLowerCase()) ? "fill-white text-white" : "text-slate-400"} />
                  {likedEmails.includes(selectedCandidate.email.toLowerCase()) ? "Saved" : "Save Profile"}
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentDirectoryPage;
