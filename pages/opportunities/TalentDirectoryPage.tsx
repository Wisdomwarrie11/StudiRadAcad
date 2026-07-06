import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Search,
  Filter,
  Loader2,
  Star,
  Check,
  ShieldAlert,
  Award,
  Briefcase,
  FileText,
  Lock,
  Unlock,
  MessageSquare,
  AlertCircle,
  Sparkles,
  User,
  X,
  UserCheck,
  ThumbsUp,
  Mail,
  Phone,
  Copy
} from "lucide-react";
import SEO from "../../components/SEO";

// Predefined medical avatars representing faces (male and female)
const AVATARS = [
  { id: "female_face_1", name: "Female Radiographer", emoji: "👩‍⚕️", bg: "bg-rose-50 border-rose-200" },
  { id: "male_face_2", name: "Male Radiographer", emoji: "👨‍⚕️", bg: "bg-teal-50 border-teal-200" },
];

interface Recommendation {
  id: string;
  writerName: string;
  stars: number;
  comment: string;
  createdAt: string;
}

interface TalentProfile {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  certifications: string[];
  skills: string[];
  avatarId: string;
  availableForJob: boolean;
  availableForInternship: boolean;
  isActiveAvailability?: boolean; // toggle off availability completely
  passcode: string;
  createdAt?: any;
  updatedAt?: any;
  recommendations?: Recommendation[];
  averageRating?: number;
}

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

  // Recommendation Modal State
  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [recName, setRecName] = useState("");
  const [recStars, setRecStars] = useState(5);
  const [recComment, setRecComment] = useState("");
  const [recLoading, setRecLoading] = useState(false);

  // Account Session Management
  const [loggedInUser, setLoggedInUser] = useState<TalentProfile | null>(() => {
    try {
      const session = localStorage.getItem("studirad_talent_session");
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  });

  const [hasAccount, setHasAccount] = useState(true); // default to log in option
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");

  // Registration & Edit Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("Qualified Radiographer");
  const [experience, setExperience] = useState("");
  
  // Certifications & Modalities (Skills) selected arrays
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [customCertsText, setCustomCertsText] = useState("");
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  
  const [selectedAvatarId, setSelectedAvatarId] = useState("female_face_1");
  const [placementType, setPlacementType] = useState<"job" | "internship">("job");
  const [isActiveAvailability, setIsActiveAvailability] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [userAgreed, setUserAgreed] = useState(false);

  // Dropdown states for multi-select
  const [certsDropdownOpen, setCertsDropdownOpen] = useState(false);
  const [modalitiesDropdownOpen, setModalitiesDropdownOpen] = useState(false);

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

  // Sync logged in user session to form fields automatically
  useEffect(() => {
    if (loggedInUser) {
      loadProfileIntoForm(loggedInUser);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      resetForm();
    }
  }, [loggedInUser]);

  const loadProfileIntoForm = (data: TalentProfile) => {
    setFullName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setQualification(data.qualification);
    setExperience(data.experience);
    setSelectedModalities(data.skills || []);
    
    // Parse certifications for UI
    const coreList = ["ARN", "RRBN", "Bsc.Rad", "B.rad"];
    const certsFromDb = data.certifications || [];
    const coreSelected = certsFromDb.filter(c => coreList.includes(c));
    const customSelected = certsFromDb.filter(c => !coreList.includes(c));
    
    if (customSelected.length > 0) {
      setSelectedCerts([...coreSelected, "Other"]);
      setCustomCertsText(customSelected.join(", "));
    } else {
      setSelectedCerts(coreSelected);
      setCustomCertsText("");
    }
    
    setSelectedAvatarId(data.avatarId || "female_face_1");
    setPlacementType(data.availableForInternship ? "internship" : "job");
    setIsActiveAvailability(data.isActiveAvailability !== false);
    setPasscode(data.passcode);
    setUserAgreed(true);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setExperience("");
    setSelectedCerts([]);
    setCustomCertsText("");
    setSelectedModalities([]);
    setSelectedAvatarId("female_face_1");
    setPlacementType("job");
    setIsActiveAvailability(true);
    setPasscode("");
    setUserAgreed(false);
  };

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const snapshot = await getDocs(collection(db, "talentProfiles"));
      const list = snapshot.docs.map((doc) => doc.data() as TalentProfile);
      // Sort: highest rating first, then newest
      list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
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

  const handleOpenRecModal = (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setRecName("");
    setRecStars(5);
    setRecComment("");
    setRecModalOpen(true);
  };

  const handleAddRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !recName.trim() || !recComment.trim()) return;

    setRecLoading(true);
    try {
      const docRef = doc(db, "talentProfiles", selectedProfile.email.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as TalentProfile;
        const currentRecs = data.recommendations || [];
        
        const newRec: Recommendation = {
          id: Date.now().toString(),
          writerName: recName.trim(),
          stars: recStars,
          comment: recComment.trim(),
          createdAt: new Date().toISOString(),
        };

        const updatedRecs = [newRec, ...currentRecs];
        const totalStars = updatedRecs.reduce((acc, r) => acc + r.stars, 0);
        const averageRating = parseFloat((totalStars / updatedRecs.length).toFixed(1));

        await updateDoc(docRef, {
          recommendations: updatedRecs,
          averageRating: averageRating,
        });

        // Update local list
        setProfiles((prev) =>
          prev.map((p) =>
            p.email.toLowerCase() === selectedProfile.email.toLowerCase()
              ? { ...p, recommendations: updatedRecs, averageRating: averageRating }
              : p
          )
        );

        setRecModalOpen(false);
        alert("✅ Thank you! Recommendation added successfully.");
      }
    } catch (error) {
      console.error("Error writing recommendation:", error);
      alert("❌ Failed to add recommendation. Please try again.");
    } finally {
      setRecLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!loginEmail.trim() || !loginPasscode.trim()) {
      setFormError("Please enter your registered email and 4-digit passcode.");
      return;
    }

    setFormLoading(true);
    try {
      const docRef = doc(db, "talentProfiles", loginEmail.toLowerCase().trim());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setFormError("No profile found with this email. Please register a new profile below.");
      } else {
        const data = docSnap.data() as TalentProfile;
        if (data.passcode !== loginPasscode.trim()) {
          setFormError("Incorrect passcode. Please check and try again.");
        } else {
          // Success login
          setLoggedInUser(data);
          localStorage.setItem("studirad_talent_session", JSON.stringify(data));
          setFormSuccess("🎉 Successfully logged into your profile!");
        }
      }
    } catch (err) {
      console.error(err);
      setFormError("Failed to access your profile. Check your internet connection.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("studirad_talent_session");
    setIsEditing(false);
    resetForm();
    setFormSuccess("");
    setFormError("");
  };

  const handleRegisterOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !passcode.trim()) {
      setFormError("All basic fields (Name, Email, Phone, Passcode) are required.");
      return;
    }

    if (qualification === "Student" || qualification === "Non-radiographer") {
      setFormError("Only qualified, practicing radiographers are permitted to register on this board.");
      return;
    }

    if (!placementType) {
      setFormError("Please select a placement desired.");
      return;
    }

    if (!userAgreed) {
      setFormError("You must agree to the declarations and confirm you are a qualified radiographer.");
      return;
    }

    setFormLoading(true);
    try {
      const docRef = doc(db, "talentProfiles", email.toLowerCase().trim());
      
      if (!isEditing) {
        // Prevent registering over an existing profile unless explicitly editing
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormError("An account with this email already exists. Please sign in instead.");
          setFormLoading(false);
          return;
        }
      }

      const cleanSkills = selectedModalities;
      
      // Compute certifications for DB (merging core select and custom others)
      const coreCerts = selectedCerts.filter(c => c !== "Other");
      let cleanCerts = [...coreCerts];
      if (selectedCerts.includes("Other") && customCertsText.trim()) {
        const customs = customCertsText.split(",").map(c => c.trim()).filter(c => c.length > 0);
        cleanCerts = [...cleanCerts, ...customs];
      }

      const profileData: TalentProfile = {
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        qualification: qualification,
        experience: experience.trim(),
        skills: cleanSkills,
        certifications: cleanCerts,
        avatarId: selectedAvatarId,
        availableForJob: placementType === "job",
        availableForInternship: placementType === "internship",
        isActiveAvailability: isActiveAvailability,
        passcode: passcode.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (!isEditing) {
        profileData.createdAt = new Date().toISOString();
        profileData.recommendations = [];
        profileData.averageRating = 0;
      } else {
        // preserve recommendations & rating
        profileData.recommendations = loggedInUser?.recommendations || [];
        profileData.averageRating = loggedInUser?.averageRating || 0;
        profileData.createdAt = loggedInUser?.createdAt || new Date().toISOString();
      }

      await setDoc(docRef, profileData, { merge: true });

      // Automatically keep logged in session updated
      setLoggedInUser(profileData);
      localStorage.setItem("studirad_talent_session", JSON.stringify(profileData));

      setFormSuccess(isEditing ? "🎉 Your profile has been updated!" : "🎉 Your account has been successfully created and logged in!");
      
      // Refresh list
      fetchProfiles();
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong saving the profile. Please try again.");
    } finally {
      setFormLoading(false);
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
    <div className="min-h-screen bg-slate-200 text-slate-900 pt-24 pb-16 px-4 font-sans relative">
      <SEO
        title="Open to Work Career Hub"
        description="Connect with qualified Radiography professionals available for immediate hire or internships. StudiRad Career Hub."
      />

      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">StudiRad Professional Network</span>
          <h1 className="text-4xl md:text-5xl font-serif italic font-light text-slate-900 tracking-tight leading-none mb-4">
            Open to Work <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Career Hub</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
            A trusted portal connecting clinics and imaging centers with verified radiographers and clinical interns.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-300 inline-flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center transition-all ${
                activeTab === "browse" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Search className="w-3.5 h-3.5 mr-2" /> Find Professionals
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center transition-all ${
                activeTab === "register" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 mr-2" /> My Account & Profile
            </button>
          </div>
        </div>

        {activeTab === "browse" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Employer Terms Disclaimer banner */}
            {!employerAgreed ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-amber-900 uppercase tracking-wide">Employer Disclaimer & Verification Required</h3>
                    <p className="text-xs text-amber-700 leading-relaxed max-w-2xl">
                      StudiRad serves as a matchmaking bulletin and does not independently audit background histories. By agreeing, you acknowledge that you will carry out complete professional reference, credentialing, and certification verification before concluding any hiring decisions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAgreeEmployerDisclaimer}
                  className="bg-amber-800 text-white hover:bg-amber-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex-shrink-0"
                >
                  Accept & View Contact Details
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 text-white rounded-2xl p-4 px-6 shadow-sm flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <Check className="text-green-400" size={18} />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300">Employer terms acknowledged: Contact channels unlocked.</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("studirad_employer_talent_agreement");
                    setEmployerAgreed(false);
                  }}
                  className="text-[9px] font-mono text-slate-400 hover:text-white underline uppercase tracking-wider"
                >
                  Revoke Agreement
                </button>
              </div>
            )}

            {/* Filter controls bar */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by Name, Skills, Certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4 items-center justify-end w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Filter size={14} /> Filter:
                </span>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 select-none">
                  <input
                    type="checkbox"
                    checked={filterJob}
                    onChange={(e) => setFilterJob(e.target.checked)}
                    className="accent-brand-primary w-4 h-4"
                  />
                  Job Seekers
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 select-none">
                  <input
                    type="checkbox"
                    checked={filterInternship}
                    onChange={(e) => setFilterInternship(e.target.checked)}
                    className="accent-brand-primary w-4 h-4"
                  />
                  Interns
                </label>
              </div>
            </div>

            {/* Profile cards grid */}
            {loadingProfiles ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-brand-primary" size={36} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading availability roster...</span>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="bg-white/80 rounded-2xl p-16 text-center border border-slate-300">
                <User size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="font-bold text-lg text-slate-700">No Radiographers Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
                  We couldn't find anyone registered matching your search. Try adjusting filters or be the first to declare your availability!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredProfiles.map((candidate, idx) => {
                  const avatar = AVATARS.find((a) => a.id === candidate.avatarId) || AVATARS[2];
                  const isIntern = candidate.availableForInternship;
                  const gradientHeader = isIntern 
                    ? "from-indigo-50/40 via-slate-50/10 to-transparent" 
                    : "from-emerald-50/30 via-slate-50/5 to-transparent";
                  const topAccent = isIntern
                    ? "bg-gradient-to-r from-indigo-400 via-indigo-100 to-purple-300"
                    : "bg-gradient-to-r from-emerald-400 via-emerald-100 to-teal-300";

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/85 hover:border-slate-350 rounded-[28px] shadow-[0_4px_24px_rgba(148,163,184,0.06)] hover:shadow-[0_20px_48px_rgba(148,163,184,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1"
                    >
                      {/* Premium Dynamic Accent Line */}
                      <div className={`h-1.5 ${topAccent}`}></div>

                      {/* Top Header Card */}
                      <div className={`p-6 md:p-8 space-y-6 bg-gradient-to-b ${gradientHeader}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Avatar bubble */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${avatar.bg} shadow-md shadow-slate-100/80 ring-4 ring-white transition-all duration-300 group-hover:scale-105 group-hover:rotate-2`}>
                              {avatar.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-sans font-bold text-lg text-slate-900 tracking-tight">{candidate.name}</h3>
                                <span className={`inline-flex w-2.5 h-2.5 rounded-full ${isIntern ? "bg-indigo-500" : "bg-emerald-500"} animate-pulse`} title="Open to Offers"></span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mt-0.5">{candidate.qualification}</span>
                            </div>
                          </div>

                        
                        </div>

                        {/* Availability Badges */}
                        <div className="flex flex-wrap gap-2.5">
                          {candidate.availableForJob && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/[0.08] text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/15 flex items-center gap-1.5 shadow-sm">
                              <Briefcase size={11} className="text-emerald-600" /> Full-Time Role
                            </span>
                          )}
                          {candidate.availableForInternship && (
                            <span className="px-3 py-1 rounded-full bg-indigo-500/[0.08] text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/15 flex items-center gap-1.5 shadow-sm">
                              <Award size={11} className="text-indigo-600" /> Clinical Intern
                            </span>
                          )}
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Primary Modalities</span>
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1 text-[10px] font-semibold transition-colors duration-200 hover:bg-slate-100"
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
                              <Award size={12} className="text-amber-500" /> Professional Credentials
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.certifications.map((cert, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="bg-amber-500/[0.04] border border-amber-500/10 text-amber-900/90 rounded-xl px-3 py-1 text-[10px] font-bold transition-colors duration-200 hover:bg-amber-100"
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
                              <FileText size={12} className="text-slate-400" /> Executive Profile Summary
                            </span>
                            <div className="bg-gradient-to-r from-slate-50/50 to-indigo-50/10 border border-slate-100/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed italic relative">
                              <p className="line-clamp-3">
                                "{candidate.experience}"
                              </p>
                            </div>
                          </div>
                        )}

                     
                      </div>

                      {/* Contact Section & Rating Actions */}
                      <div className="bg-slate-50/60 px-6 py-5 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="flex-1">
                          {employerAgreed ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                                <Unlock size={11} className="text-emerald-500" /> Contact channels unlocked
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleCopyText(candidate.phone, `${candidate.email}-phone`)}
                                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn"
                                  title="Click to copy phone number"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Phone size={12} className="text-slate-400 group-hover/btn:text-slate-600" />
                                    <span className="text-[11px] font-bold text-slate-700 font-mono">{candidate.phone}</span>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">
                                    {copiedId === `${candidate.email}-phone` ? "Copied!" : "Copy"}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleCopyText(candidate.email, `${candidate.email}-email`)}
                                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm rounded-xl text-left transition-all duration-200 group/btn max-w-full"
                                  title="Click to copy email address"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Mail size={12} className="text-slate-400 group-hover/btn:text-slate-600" />
                                    <span className="text-[11px] font-bold text-slate-700 font-mono truncate max-w-[120px] md:max-w-[180px]">{candidate.email}</span>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">
                                    {copiedId === `${candidate.email}-email` ? "Copied!" : "Copy"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 py-1">
                              <Lock size={12} className="text-slate-300" />
                              <span className="uppercase tracking-wider text-[9px] font-mono font-bold">Contact channels locked</span>
                            </div>
                          )}
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
          <div className="grid lg:grid-cols-3 gap-8 items-start animate-fadeIn">
            
            {/* Guide & Auth/Account Info Column */}
            <div className="lg:col-span-1 space-y-6">
              {loggedInUser ? (
                // Logged In Account Summary Card
                <div className="bg-slate-900 text-white rounded-2xl p-6 border border-white/10 shadow-lg space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                      {AVATARS.find((a) => a.id === loggedInUser.avatarId)?.emoji || "🧑‍⚕️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider">{loggedInUser.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono select-all">{loggedInUser.email}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Quick Status</span>
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActiveAvailability ? "bg-green-400" : "bg-red-400"}`}></span>
                        {isActiveAvailability ? "Visible & Available" : "Hidden / Offline"}
                      </span>
                      <button
                        onClick={async () => {
                          const nextStatus = !isActiveAvailability;
                          setIsActiveAvailability(nextStatus);
                          
                          // Save update immediately for smooth experience
                          try {
                            const docRef = doc(db, "talentProfiles", loggedInUser.email.toLowerCase().trim());
                            await updateDoc(docRef, { isActiveAvailability: nextStatus });
                            
                            const updated = { ...loggedInUser, isActiveAvailability: nextStatus };
                            setLoggedInUser(updated);
                            localStorage.setItem("studirad_talent_session", JSON.stringify(updated));
                            setFormSuccess(`🎉 Visibility status updated to ${nextStatus ? "Active" : "Hidden"}!`);
                            fetchProfiles();
                          } catch (err) {
                            console.error("Failed to quick toggle status", err);
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-700"
                      >
                        Toggle
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-950/40 hover:bg-red-950/75 text-red-300 border border-red-900/50 hover:text-white font-bold text-[10px] uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Log Out of My Account
                  </button>
                </div>
              ) : (
                // Login / Access Account Form
                <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm space-y-6">
                  {hasAccount ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-950 uppercase tracking-wider">Access Your Account</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Enter your professional email and 4-digit passcode to edit your career profile or toggle your current availability.
                        </p>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Email</label>
                          <input
                            type="email"
                            placeholder="yourname@domain.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs mt-1 bg-slate-50 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4-Digit Passcode</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                            value={loginPasscode}
                            onChange={(e) => setLoginPasscode(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs mt-1 bg-slate-50 font-medium tracking-widest text-center"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={formLoading}
                          className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          {formLoading ? <Loader2 className="animate-spin" size={12} /> : "Log In & Manage Profile"}
                        </button>
                      </form>

                      <div className="border-t border-slate-100 pt-4 text-center">
                        <button
                          onClick={() => {
                            setHasAccount(false);
                            setFormError("");
                            setFormSuccess("");
                          }}
                          className="text-xs font-semibold text-brand-primary hover:underline"
                        >
                          Need an account? Create one here
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-950 uppercase tracking-wider">Create Account & Profile</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Once registered, you can log back in at any time to edit your profile, toggle availability, or manage recommendations.
                        </p>
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                        <div className="flex gap-2.5 items-start">
                          <div className="w-5 h-5 bg-slate-100 rounded-md text-slate-700 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                          <p>Fill in your credentials, qualifications, and certified modalities.</p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <div className="w-5 h-5 bg-slate-100 rounded-md text-slate-700 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                          <p>Choose a private 4-digit passcode to secure your profile updates.</p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <div className="w-5 h-5 bg-slate-100 rounded-md text-slate-700 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                          <p>Toggle your profile visibility off when you find employment.</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4 text-center">
                        <button
                          onClick={() => {
                            setHasAccount(true);
                            setFormError("");
                            setFormSuccess("");
                          }}
                          className="text-xs font-semibold text-brand-primary hover:underline"
                        >
                          Already registered? Log in here
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account / Registration Form Column */}
            <div className="lg:col-span-2">
              {(!loggedInUser && hasAccount) ? (
                // Welcome Screen if not logged in and on Login Tab
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-300 p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center min-h-[350px]">
                  <Unlock size={40} className="text-slate-400 mb-2" />
                  <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">Access Your Professional Profile</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Please log into your account using the login form on the left to review your credentials, manage recommendations, or toggle your visibility to active healthcare employers.
                  </p>
                  <button
                    onClick={() => setHasAccount(false)}
                    className="mt-2 bg-slate-950 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Or Register a New Account
                  </button>
                </div>
              ) : (
                // Create or Edit Form
                <div className="bg-white rounded-2xl border border-slate-300 p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="font-bold text-xl text-slate-900">
                        {isEditing ? "Manage Your Career Profile" : "Create Your Professional Account"}
                      </h2>
                      <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mt-1">
                        {isEditing ? "Account Settings & Preferences" : "Professional Network Registration"}
                      </p>
                    </div>
                    {isEditing && !loggedInUser && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider"
                      >
                        <X size={12} /> Exit
                      </button>
                    )}
                  </div>

                  {formError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold">
                      {formSuccess}
                    </div>
                  )}

                  <form onSubmit={handleRegisterOrUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Chinedu Okafor"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium mt-1.5"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Professional Email</label>
                        <input
                          type="email"
                          placeholder="e.g. chinedu@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isEditing}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium mt-1.5 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      </div>
                    </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +234 803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Qualification Title</label>
                      <select
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold mt-1.5 bg-white"
                      >
                        <option value="Qualified Radiographer">Qualified Radiographer (B.Rad)</option>
                        <option value="Clinical Sonographer">Clinical Sonographer</option>
                        <option value="Radiation Therapist">Radiation Therapist</option>
                        <option value="Nuclear Medicine Specialist">Nuclear Medicine Specialist</option>
                      </select>
                    </div>
                  </div>

                  {/* Avatar Selector Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Your Avatar Profile Icon</label>
                    <div className="grid grid-cols-4 gap-3 mt-2 max-w-md">
                      {AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(av.id)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            selectedAvatarId === av.id
                              ? "border-slate-900 bg-slate-900 text-white scale-110 ring-2 ring-slate-950 ring-offset-2"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="text-2xl">{av.emoji}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 italic block mt-1">
                      Chosen Avatar Identity: {AVATARS.find((a) => a.id === selectedAvatarId)?.name}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Certifications (Select all that apply)</label>
                      <div className="relative mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCertsDropdownOpen(!certsDropdownOpen);
                            setModalitiesDropdownOpen(false);
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium text-left flex justify-between items-center"
                        >
                          <span className="text-slate-700 truncate">
                            {selectedCerts.length > 0
                              ? `Selected (${selectedCerts.length}): ${selectedCerts.join(", ")}`
                              : "Choose certifications..."}
                          </span>
                          <span className="text-slate-400 text-[10px]">▼</span>
                        </button>
                        {certsDropdownOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-lg p-3 space-y-2 max-h-60 overflow-y-auto animate-fadeIn">
                            {["ARN", "RRBN", "Bsc.Rad", "B.rad", "Other"].map((certOption) => {
                              const isChecked = selectedCerts.includes(certOption);
                              return (
                                <label
                                  key={certOption}
                                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-semibold select-none text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setSelectedCerts(selectedCerts.filter((c) => c !== certOption));
                                      } else {
                                        setSelectedCerts([...selectedCerts, certOption]);
                                      }
                                    }}
                                    className="accent-brand-primary w-4 h-4 rounded"
                                  />
                                  {certOption}
                                </label>
                              );
                            })}
                            <div className="border-t border-slate-100 pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setCertsDropdownOpen(false)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {selectedCerts.includes("Other") && (
                        <div className="mt-3.5 animate-fadeIn">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Specify Other Certifications (comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. PgD.Ultrasonic, CT-Certified"
                            value={customCertsText}
                            onChange={(e) => setCustomCertsText(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium mt-1.5"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Experience with Modalities (Select all that apply)</label>
                      <div className="relative mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setModalitiesDropdownOpen(!modalitiesDropdownOpen);
                            setCertsDropdownOpen(false);
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium text-left flex justify-between items-center"
                        >
                          <span className="text-slate-700 truncate">
                            {selectedModalities.length > 0
                              ? `Selected (${selectedModalities.length}): ${selectedModalities.join(", ")}`
                              : "Choose modalities..."}
                          </span>
                          <span className="text-slate-400 text-[10px]">▼</span>
                        </button>
                        {modalitiesDropdownOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-lg p-3 space-y-2 max-h-60 overflow-y-auto animate-fadeIn">
                            {[
                              "General Radiography",
                              "Computed Tomography (CT)",
                              "Magnetic Resonance Imaging (MRI)",
                              "Ultrasound / Sonography",
                              "Radiation Therapy",
                              "Nuclear Medicine",
                              "Mammography",
                              "Fluoroscopy"
                            ].map((modOption) => {
                              const isChecked = selectedModalities.includes(modOption);
                              return (
                                <label
                                  key={modOption}
                                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-semibold select-none text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setSelectedModalities(selectedModalities.filter((m) => m !== modOption));
                                      } else {
                                        setSelectedModalities([...selectedModalities, modOption]);
                                      }
                                    }}
                                    className="accent-brand-primary w-4 h-4 rounded"
                                  />
                                  {modOption}
                                </label>
                              );
                            })}
                            <div className="border-t border-slate-100 pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setModalitiesDropdownOpen(false)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Summary of Work Experience & Practice</label>
                      <textarea
                        rows={3}
                        placeholder="Write about yourself, your experience and what makes you different"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium mt-1.5 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Availability settings */}
                  <div className="grid md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-5 rounded-xl">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Placement Desired (Select One)</span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                          <input
                            type="radio"
                            name="placementType"
                            checked={placementType === "job"}
                            onChange={() => setPlacementType("job")}
                            className="accent-brand-primary w-4.5 h-4.5"
                          />
                          Available for Job / Permanent Hire
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                          <input
                            type="radio"
                            name="placementType"
                            checked={placementType === "internship"}
                            onChange={() => setPlacementType("internship")}
                            className="accent-brand-primary w-4.5 h-4.5"
                          />
                          Available for Internship (Interns only)
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Set 4-Digit Passcode</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="e.g. 1234"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs mt-1 bg-white font-medium text-center tracking-widest"
                      />
                      <span className="text-[9px] text-slate-400 block pt-1 leading-snug">
                        Keep this passcode safe. You will need it to edit your profile, toggle availability, or deactivate in the future.
                      </span>
                    </div>
                  </div>

                  {/* Declarations Terms of Agreement Check */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={userAgreed}
                        onChange={(e) => setUserAgreed(e.target.checked)}
                        className="accent-brand-primary w-5 h-5 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I hereby solemnly declare that <strong>I am a qualified, practicing radiographer</strong>. I verify that all qualifications, professional certifications, and work experience listings submitted here are entirely true, accurate, and complete. I acknowledge that falsifying medical credentials may result in blacklist action.
                      </span>
                    </label>
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : isEditing ? (
                      "Save Profile Updates"
                    ) : (
                      "Register Roster Listing"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

   
    </div>
  );
};

export default TalentDirectoryPage;
