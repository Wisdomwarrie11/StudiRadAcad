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
  Phone
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

    try {
      const docRef = doc(db, "talentProfiles", emailKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentLikes = docSnap.data().likesCount || 0;
        const newLikes = Math.max(0, isLiked ? currentLikes - 1 : currentLikes + 1);
        
        await updateDoc(docRef, {
          likesCount: newLikes
        });

        // Update local list
        setProfiles((prev) =>
          prev.map((p) =>
            p.email.toLowerCase() === emailKey
              ? { ...p, likesCount: newLikes }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert state on failure
      setLikedEmails(likedEmails);
      localStorage.setItem("studirad_liked_emails", JSON.stringify(likedEmails));
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
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-600 leading-relaxed">Notice accepted: Contact details unlocked.</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("studirad_employer_talent_agreement");
                    setEmployerAgreed(false);
                  }}
                  className="text-[9px] font-mono text-slate-450 hover:text-slate-700 underline uppercase tracking-wider whitespace-nowrap self-end sm:self-auto cursor-pointer"
                >
                  Lock Contacts
                </button>
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
                  Permanent Candidates
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
              <div className="grid md:grid-cols-2 gap-8">
                {filteredProfiles.map((candidate, idx) => {
                  const avatar = AVATARS.find((a) => a.id === candidate.avatarId) || AVATARS[2];
                  const isIntern = candidate.availableForInternship;
                  const gradientHeader = isIntern 
                    ? "from-indigo-50/60 via-slate-50/10 to-transparent" 
                    : "from-amber-50/60 via-slate-50/10 to-transparent";
                  const topAccent = isIntern
                    ? "bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500"
                    : "bg-gradient-to-r from-brand-accent via-amber-350 to-amber-500";

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/80 hover:border-amber-400/60 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1"
                    >
                      {/* Premium Dynamic Accent Line */}
                      <div className={`h-1.5 ${topAccent}`}></div>

                      {/* Top Header Card */}
                      <div className={`p-5 sm:p-6 md:p-8 space-y-6 bg-gradient-to-b ${gradientHeader}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                            {/* Avatar bubble */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${avatar.bg} shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 flex-shrink-0`}>
                              {avatar.emoji}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 tracking-tight break-words">{candidate.name}</h3>
                                <span className={`inline-flex w-2.5 h-2.5 rounded-full ${isIntern ? "bg-indigo-500" : "bg-amber-500"} animate-pulse flex-shrink-0`} title="Open to Offers"></span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mt-0.5 break-words">{candidate.qualification}</span>
                            </div>
                          </div>

                          {/* Likes Display */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 bg-slate-50 sm:bg-transparent p-2 rounded-xl sm:p-0">
                            <span className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider block sm:hidden">Profile Saves</span>
                            <div className="text-right">
                              <button
                                onClick={() => handleToggleLike(candidate)}
                                className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-xl transition-all duration-300 transform active:scale-95 hover:scale-105 cursor-pointer ${
                                  likedEmails.includes(candidate.email.toLowerCase())
                                    ? "bg-rose-50/60 border-rose-200 text-rose-600 animate-pulse"
                                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200"
                                }`}
                                title={likedEmails.includes(candidate.email.toLowerCase()) ? "Remove Save" : "Save Profile"}
                              >
                                <Heart
                                  className={likedEmails.includes(candidate.email.toLowerCase()) ? "fill-rose-500 text-rose-500" : "text-slate-400"}
                                  size={13}
                                />
                                <span className="text-xs font-bold font-mono">
                                  {candidate.likesCount || 0}
                                </span>
                              </button>
                              <span className="text-[9px] font-mono font-medium text-slate-400 hidden sm:block mt-1.5 uppercase tracking-wider">
                                {likedEmails.includes(candidate.email.toLowerCase()) ? "Saved" : "Saves"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Availability Badges */}
                        <div className="flex flex-wrap gap-2.5">
                          {candidate.availableForJob && (
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-850 text-[10px] font-bold uppercase tracking-wider border border-amber-200/50 flex items-center gap-1.5 shadow-sm">
                              <Briefcase size={11} className="text-amber-600" /> Permanent Role
                            </span>
                          )}
                          {candidate.availableForInternship && (
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-850 text-[10px] font-bold uppercase tracking-wider border border-indigo-200/50 flex items-center gap-1.5 shadow-sm">
                              <Award size={11} className="text-indigo-600" /> Clinical Intern
                            </span>
                          )}
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Specialties & Modalities</span>
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-3 py-1 text-[10px] font-semibold transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {candidate.certifications && candidate.certifications.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Award size={12} className="text-amber-500" /> Qualifications & Certifications
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.certifications.map((cert, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="bg-amber-50 border border-amber-200/60 text-amber-700 rounded-xl px-3 py-1 text-[10px] font-bold transition-colors duration-200 hover:bg-amber-100/50"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Work Experience */}
                        {candidate.experience && (
                          <div className="space-y-2 border-t border-slate-100 pt-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <FileText size={12} className="text-slate-400" /> Professional Background
                            </span>
                            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed italic relative">
                              <p className="line-clamp-3">
                                "{candidate.experience}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Section & Rating Actions */}
                      <div className="bg-slate-50/60 px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {employerAgreed ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                                <Unlock size={11} className="text-amber-500" /> Contact channels unlocked
                              </div>
                              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                                <button
                                  onClick={() => handleCopyText(candidate.phone, `${candidate.email}-phone`)}
                                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn w-full sm:w-auto cursor-pointer"
                                  title="Click to copy phone number"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Phone size={12} className="text-slate-400 group-hover/btn:text-amber-500 flex-shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-700 font-mono truncate">{candidate.phone}</span>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-550 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 flex-shrink-0">
                                    {copiedId === `${candidate.email}-phone` ? "Copied!" : "Copy"}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleCopyText(candidate.email, `${candidate.email}-email`)}
                                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn w-full sm:w-auto max-w-full cursor-pointer"
                                  title="Click to copy email address"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Mail size={12} className="text-slate-400 group-hover/btn:text-amber-500 flex-shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-700 font-mono truncate max-w-[120px] md:max-w-[180px]">{candidate.email}</span>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-550 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 flex-shrink-0">
                                    {copiedId === `${candidate.email}-email` ? "Copied!" : "Copy"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 py-1">
                              <Lock size={12} className="text-slate-400" />
                              <span className="uppercase tracking-wider text-[9px] font-mono font-bold">Locked (Accept notice to view)</span>
                            </div>
                          )}
                        </div>

                        {/* Save profile action */}
                        <div className="flex items-end justify-end">
                          <button
                            onClick={() => handleToggleLike(candidate)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm transform active:scale-95 cursor-pointer ${
                              likedEmails.includes(candidate.email.toLowerCase())
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                            }`}
                          >
                            <Heart size={12} className={likedEmails.includes(candidate.email.toLowerCase()) ? "fill-white" : ""} />
                            {likedEmails.includes(candidate.email.toLowerCase()) ? "Saved" : "Save Profile"}
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
    </div>
  );
};

export default TalentDirectoryPage;
