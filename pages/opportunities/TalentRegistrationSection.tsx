import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Loader2,
  Check,
  Award,
  Briefcase,
  AlertCircle,
  X,
  ShieldCheck,
  User,
  ChevronDown,
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";

// Professional profile avatars with friendly, human-centric labels
export const AVATARS = [
    { id: "male_face_2", name: "Male Radiographer", emoji: "👨‍⚕️", bg: "bg-teal-50/50 border-teal-100" },
  { id: "female_face_1", name: "Female Radiographer", emoji: "👩‍⚕️", bg: "bg-rose-50/50 border-rose-100" },
];

export interface TalentProfile {
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
  likesCount?: number;
}

interface TalentRegistrationSectionProps {
  onProfileChange: () => void;
}

export const TalentRegistrationSection: React.FC<TalentRegistrationSectionProps> = ({
  onProfileChange,
}) => {
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

  // Save feedback states
  const [justSaved, setJustSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [leftCardSuccess, setLeftCardSuccess] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!loginEmail.trim() || !loginPasscode.trim()) {
      setFormError("Please enter your registered email and 4-digit PIN.");
      return;
    }

    setFormLoading(true);
    try {
      const docRef = doc(db, "talentProfiles", loginEmail.toLowerCase().trim());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setFormError("No profile found with this email. Please register a new profile.");
      } else {
        const data = docSnap.data() as TalentProfile;
        if (data.passcode !== loginPasscode.trim()) {
          setFormError("Incorrect PIN. Please check and try again.");
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

  const handleRegisterOrUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !passcode.trim()) {
      setFormError("All basic fields (Name, Email, Phone, and PIN) are required.");
      return;
    }

    if (qualification === "Student" || qualification === "Non-radiographer") {
      setFormError("Only qualified, practicing radiographers are permitted to register on this board.");
      return;
    }

    if (!placementType) {
      setFormError("Please select an availability type.");
      return;
    }

    if (!userAgreed) {
      setFormError("You must confirm you are a qualified professional to publish your profile.");
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
        profileData.likesCount = 0;
      } else {
        // preserve likes count
        profileData.likesCount = loggedInUser?.likesCount || 0;
        profileData.createdAt = loggedInUser?.createdAt || new Date().toISOString();
      }

      await setDoc(docRef, profileData, { merge: true });

      // Automatically keep logged in session updated
      setLoggedInUser(profileData);
      localStorage.setItem("studirad_talent_session", JSON.stringify(profileData));

      setFormSuccess(isEditing ? "🎉 Your profile has been updated!" : "🎉 Your professional profile has been successfully published!");
      
      // Set justSaved state for visual feedback on button
      setJustSaved(true);
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setTimeout(() => {
        setJustSaved(false);
      }, 5000);

      // Refresh list in parent
      onProfileChange();
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong saving the profile. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Check if form should show based on login or register state
  const isFormVisible = loggedInUser || !hasAccount;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn pb-24 md:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Account Session Management Panel (Span 4) */}
        <div className="lg:col-span-4 space-y-6 w-full">
          {loggedInUser ? (
            // Logged In Account Summary Card
            <div className="bg-white text-slate-800 rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  {AVATARS.find((a) => a.id === loggedInUser.avatarId)?.emoji || "🧑‍⚕️"}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-0.5">Signed In</span>
                  <h3 className="font-bold text-base text-slate-900 truncate leading-snug">{loggedInUser.name}</h3>
                  <p className="text-xs text-slate-400 font-mono select-all truncate mt-0.5">{loggedInUser.email}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Visibility on Directory</span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse ${isActiveAvailability ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                    <span className="truncate">{isActiveAvailability ? "Online & Available" : "Offline / Hidden"}</span>
                  </span>
                  <button
                    onClick={async () => {
                      const nextStatus = !isActiveAvailability;
                      setIsActiveAvailability(nextStatus);
                      
                      try {
                        const docRef = doc(db, "talentProfiles", loggedInUser.email.toLowerCase().trim());
                        await updateDoc(docRef, { isActiveAvailability: nextStatus });
                        
                        const updated = { ...loggedInUser, isActiveAvailability: nextStatus };
                        setLoggedInUser(updated);
                        localStorage.setItem("studirad_talent_session", JSON.stringify(updated));
                        setFormSuccess(`🎉 Visibility status updated to ${nextStatus ? "Online" : "Offline"}!`);
                        setLeftCardSuccess(`✓ Status is now ${nextStatus ? "Online" : "Offline"}`);
                        setTimeout(() => setLeftCardSuccess(""), 4000);
                        onProfileChange();
                      } catch (err) {
                        console.error("Failed to quick toggle status", err);
                      }
                    }}
                    className="bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-slate-200 transition-all text-center shadow-sm cursor-pointer hover:scale-[1.02]"
                  >
                    Change Status
                  </button>
                </div>
                {leftCardSuccess && (
                  <div className="p-2.5 text-center bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold animate-fadeIn mt-2">
                    {leftCardSuccess}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full h-11 bg-rose-50/50 hover:bg-rose-50 text-rose-600 border border-rose-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            // Login / Access Account Form Card
            <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
              {hasAccount ? (
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Job Board Account</span>
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight">Access Your Profile</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Enter your email and 4-digit security PIN to update your profile, check messages, or toggle your visibility on the job directory.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Your Registered Email</label>
                      <input
                        type="email"
                        placeholder="e.g. yourname@domain.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 hover:bg-slate-50 focus:bg-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">4-Digit Security PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={loginPasscode}
                        onChange={(e) => setLoginPasscode(e.target.value)}
                        required
                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium tracking-widest text-center placeholder:text-slate-400 hover:bg-slate-50 focus:bg-white transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                    >
                      {formLoading ? <Loader2 className="animate-spin" size={14} /> : "Log In & Manage Profile"}
                    </button>
                  </form>

                  <div className="border-t border-slate-100 pt-4 text-center">
                    <button
                      onClick={() => {
                        setHasAccount(false);
                        setFormError("");
                        setFormSuccess("");
                      }}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors cursor-pointer"
                    >
                      No account? Create one here &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">New to the Directory?</span>
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight">Register Your Profile</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Create a polished professional card to showcase your specialties, qualifications, and employment preferences. Secure it with a simple 4-digit PIN.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-amber-50 rounded-lg border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-xs font-mono">1</div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                        <strong className="text-slate-800 font-semibold">Add your details:</strong> Showcase your imaging qualifications, specialties, and contact info.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-amber-50 rounded-lg border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-xs font-mono">2</div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                        <strong className="text-slate-800 font-semibold">Secure your profile:</strong> Create a private 4-digit PIN to access and edit your profile anytime.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-amber-50 rounded-lg border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-xs font-mono">3</div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                        <strong className="text-slate-800 font-semibold">Control visibility:</strong> Turn your profile online or offline whenever you start a new job.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-center">
                    <button
                      onClick={() => {
                        setHasAccount(true);
                        setFormError("");
                        setFormSuccess("");
                      }}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors cursor-pointer"
                    >
                      Already registered? Log in here &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Form Roster Entry Column (Span 8) */}
        <div className="lg:col-span-8 w-full">
          {!isFormVisible ? (
            // Welcome Screen when not logged in and on the login state
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-5 h-full flex flex-col items-center justify-center min-h-[400px] text-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                <Unlock size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg sm:text-xl text-slate-950 uppercase tracking-tight">Access Your Directory Profile</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Please log into your verified professional account using the sign-in widget on the left to edit your specialties, update contact details, or toggle availability.
                </p>
              </div>
              <button
                onClick={() => setHasAccount(false)}
                className="bg-slate-900 text-white hover:bg-slate-800 px-6 h-11 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-slate-900/10 active:scale-[0.98] cursor-pointer flex items-center gap-2 hover:scale-[1.01]"
              >
                Or Create a New Profile
              </button>
            </div>
          ) : (
            // Create or Edit Form - Beautifully polished with section cards and improved touch spaces
            <div className="bg-white text-slate-800 rounded-3xl border border-slate-100 p-5 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-all duration-300 space-y-8">
              
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    {isEditing ? "Manage Profile Settings" : "Join the Professional Directory"}
                  </h2>
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-amber-500" />
                    {isEditing ? "Account Settings & Practice Status" : "Professional Directory Registration"}
                  </p>
                </div>
                {isEditing && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <X size={14} /> Exit Form
                  </button>
                )}
              </div>

              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fadeIn">
                  <AlertCircle size={18} className="flex-shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fadeIn">
                  <Check size={18} className="flex-shrink-0 text-emerald-500" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form id="talent-registration-form" onSubmit={handleRegisterOrUpdate} className="space-y-8">
                
                {/* Visual Section Group 1: Personal Details */}
                <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-5 sm:p-6 rounded-2xl space-y-6 transition-all duration-300">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                    <User size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Basic Details</h4>
                  </div>

                  {/* Avatar Grid Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pick a profile icon</label>
                    <div className="grid grid-cols-4 gap-3 max-w-sm mt-1">
                      {AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(av.id)}
                          className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            selectedAvatarId === av.id
                              ? "border-amber-400 bg-amber-50/50 text-slate-900 scale-[1.04] ring-4 ring-amber-500/10"
                              : "border-slate-200/60 bg-white hover:bg-slate-100/50 text-slate-400 hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl">{av.emoji}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 italic block mt-1.5">
                      Chosen Badge: <strong className="text-slate-600 font-medium">{AVATARS.find((a) => a.id === selectedAvatarId)?.name}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Chinedu Okafor"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Your Professional Email</label>
                      <input
                        type="email"
                        placeholder="e.g. chinedu@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isEditing}
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 transition-all duration-200 disabled:bg-slate-100/80 disabled:text-slate-400 disabled:border-slate-200/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Active Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +234 803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Your Professional Title</label>
                      <div className="relative">
                        <select
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full h-11 pl-4 pr-10 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-semibold appearance-none transition-all duration-200 cursor-pointer"
                        >
                          <option value="Radiographer" className="bg-white text-slate-900">Radiographer </option>
                          <option value="Sonographer" className="bg-white text-slate-900">Sonographer</option>
                          <option value="Radiation Therapist" className="bg-white text-slate-900">Radiation Therapist</option>
                          <option value="Nuclear Medicine Specialist" className="bg-white text-slate-900">Nuclear Medicine Specialist</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Section Group 2: Specialties & Qualifications */}
                <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-5 sm:p-6 rounded-2xl space-y-6 transition-all duration-300">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                    <Award size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Specialties & Qualifications</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Certifications dropdown multi-select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Certifications (select all that apply)</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setCertsDropdownOpen(!certsDropdownOpen);
                            setModalitiesDropdownOpen(false);
                          }}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium text-left flex justify-between items-center text-slate-800 transition-all cursor-pointer hover:bg-slate-50/50"
                        >
                          <span className="truncate">
                            {selectedCerts.length > 0
                              ? `Selected (${selectedCerts.length})`
                              : "Select certifications..."}
                          </span>
                          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                        </button>
                        {certsDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-1.5 max-h-64 overflow-y-auto animate-fadeIn text-slate-800">
                            {["ARN", "RRBN", "Bsc.Rad", "B.rad", "Other"].map((certOption) => {
                              const isChecked = selectedCerts.includes(certOption);
                              return (
                                <label
                                  key={certOption}
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold select-none text-slate-700 transition-all"
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
                                    className="accent-amber-500 w-5 h-5 rounded cursor-pointer"
                                  />
                                  <span>{certOption}</span>
                                </label>
                              );
                            })}
                            <div className="border-t border-slate-100 pt-2.5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setCertsDropdownOpen(false)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 h-8 rounded-lg cursor-pointer transition-all active:scale-95"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Premium Interactive Selected Tags */}
                      {selectedCerts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedCerts.map((cert) => (
                            <span
                              key={cert}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg text-xs font-medium"
                            >
                              <span>{cert}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedCerts(selectedCerts.filter((c) => c !== cert))}
                                className="hover:bg-amber-100 text-amber-600 rounded p-0.5 transition-colors cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {selectedCerts.includes("Other") && (
                        <div className="mt-3.5 animate-fadeIn">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Other Certifications (separate with commas)</label>
                          <input
                            type="text"
                            placeholder="e.g. PgD.Ultrasonic, CT-Certified"
                            value={customCertsText}
                            onChange={(e) => setCustomCertsText(e.target.value)}
                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 transition-all duration-200"
                          />
                        </div>
                      )}
                    </div>

                    {/* Modalities multi select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Specialties & Modalities</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setModalitiesDropdownOpen(!modalitiesDropdownOpen);
                            setCertsDropdownOpen(false);
                          }}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium text-left flex justify-between items-center text-slate-800 transition-all cursor-pointer hover:bg-slate-50/50"
                        >
                          <span className="truncate">
                            {selectedModalities.length > 0
                              ? `Selected (${selectedModalities.length})`
                              : "Select your specialties..."}
                          </span>
                          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                        </button>
                        {modalitiesDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-1.5 max-h-64 overflow-y-auto animate-fadeIn text-slate-800">
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
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold select-none text-slate-700 transition-all"
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
                                    className="accent-amber-500 w-5 h-5 rounded cursor-pointer"
                                  />
                                  <span>{modOption}</span>
                                </label>
                              );
                            })}
                            <div className="border-t border-slate-100 pt-2.5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setModalitiesDropdownOpen(false)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 h-8 rounded-lg cursor-pointer transition-all active:scale-95"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Premium Interactive Selected Tags */}
                      {selectedModalities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedModalities.map((mod) => (
                            <span
                              key={mod}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200/60 rounded-lg text-xs font-medium"
                            >
                              <span>{mod}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedModalities(selectedModalities.filter((m) => m !== mod))}
                                className="hover:bg-blue-100 text-blue-600 rounded p-0.5 transition-colors cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">About Your Clinical Experience</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Describe your clinical background, equipment you have worked with (e.g. GE, Siemens, Philips), and years of experience."
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium placeholder:text-slate-400 transition-all duration-200 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Visual Section Group 3: Availability & Security */}
                <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-5 sm:p-6 rounded-2xl space-y-6 transition-all duration-300">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                    <Briefcase size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Availability & Security</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">What kind of work are you looking for?</span>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none text-slate-700 bg-white border border-slate-200 p-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                          <input
                            type="radio"
                            name="placementType"
                            checked={placementType === "job"}
                            onChange={() => setPlacementType("job")}
                            className="accent-amber-500 w-5 h-5 cursor-pointer"
                          />
                          <span>Permanent / Full-Time Position</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none text-slate-700 bg-white border border-slate-200 p-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                          <input
                            type="radio"
                            name="placementType"
                            checked={placementType === "internship"}
                            onChange={() => setPlacementType("internship")}
                            className="accent-amber-500 w-5 h-5 cursor-pointer"
                          />
                          <span>Clinical Internship</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Create a 4-Digit PIN to secure edits</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        required
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-medium text-center tracking-widest placeholder:text-slate-400 transition-all duration-200"
                      />
                      <span className="text-xs text-slate-400 block pt-1.5 leading-relaxed">
                        Keep this PIN safe. You will need it to update your profile specialties or turn your online status on or off.
                      </span>
                    </div>
                  </div>

                  {/* Declaration Checklist */}
                  <div className="border-t border-slate-200/40 pt-5">
                    <label className="flex items-start gap-4 cursor-pointer select-none group bg-white border border-slate-200/60 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={userAgreed}
                        onChange={(e) => setUserAgreed(e.target.checked)}
                        className="accent-amber-550 w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                        I confirm that I am a qualified imaging professional. I verify that all listed qualifications, licenses, and background history are fully accurate.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Desktop and Tablet Submit Button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`w-full h-12 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer mt-4 hover:scale-[1.01] ${
                    justSaved 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10" 
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/15"
                  }`}
                >
                  {formLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : justSaved ? (
                    <span className="flex items-center gap-1.5 animate-fadeIn">
                      <Check size={16} /> All Changes Saved!
                    </span>
                  ) : isEditing ? (
                    "Save Profile Changes"
                  ) : (
                    "Create Professional Profile"
                  )}
                </button>
                {lastSavedTime && (
                  <div className="text-center mt-3 animate-fadeIn">
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Profile changes saved at {lastSavedTime}
                    </span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Submit Bar */}
      {isFormVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-2xl z-40 flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Profile Status</span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {isEditing ? "Editing Profile" : "Creating Account"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleRegisterOrUpdate()}
            disabled={formLoading}
            className={`h-11 px-6 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer duration-300 ${
              justSaved
                ? "bg-emerald-600 text-white shadow-emerald-600/10"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/15"
            }`}
          >
            {formLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : justSaved ? (
              <span className="flex items-center gap-1">
                <Check size={12} /> Saved!
              </span>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Submit Profile"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
