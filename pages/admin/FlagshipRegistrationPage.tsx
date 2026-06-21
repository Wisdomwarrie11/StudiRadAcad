import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { db, adminAuth } from "../../firebase";
import SEO from "../../components/SEO";
import { 
  collection, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  User, 
  RefreshCw, 
  Check, 
  Lock, 
  Unlock,
  AlertCircle,
  Sparkles,
  School,
  Send,
  X
} from "lucide-react";

// Firestore Error Types as required by firebase-integration skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: adminAuth.currentUser?.uid,
      email: adminAuth.currentUser?.email,
      emailVerified: adminAuth.currentUser?.emailVerified,
      isAnonymous: adminAuth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fixed Passcode for convenient, urgent, yet secure access
const SECURE_PASSCODE = "flagship2026";

export default function FlagshipRegistrationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [targetPhone, setTargetPhone] = useState("");
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [targetEmail, setTargetEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("Urgent Reminder: StudiRad Flagship Class Onboarding Sessions");
  
  // Anti-spam Delay & Cooldown state logic
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [pacingCountdown, setPacingCountdown] = useState<number | null>(null);
  const [isPacingActive, setIsPacingActive] = useState(false);

  const getDynamicMessage = (fullName: string): string => {
    const greetingName = fullName && fullName !== "—" ? fullName.trim() : "Colleague";
    return `Hello ${greetingName},
We are delighted to have you join StudiRad flagship class.

Please find the opening session schedule below:
*7:45 PM:* Welcome & Onboarding Session
*8:00 PM:* Commencement of the Core Lecture.


*Link :* https://meet.google.com/xgn-etgn-zyf (Admittance into the class will be open by 7:45 PM)

To maximize your experience, we kindly request that you adjust your schedule accordingly and ensure you are logged in promptly before the onboarding session. 

If you are yet to join the Google Classroom, please click on this link to join: https://classroom.google.com/c/ODY1MjQ3MzU5MzI0?cjc=g5bxu3tn

We look forward to your active participation.


Best Regards,
StudiRad Team`;
  };

  const cleanPhoneNumber = (num: string): string => {
    let cleaned = num.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = "234" + cleaned.substring(1);
    }
    return cleaned;
  };

  // Cooldowns countdown global decrement
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const key in next) {
          if (next[key] > 0) {
            next[key] -= 1;
            changed = true;
          } else {
            delete next[key];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle anti-spam secure paced dispatch logic
  const triggerPacedSend = (recipientId: string, channel: "whatsapp" | "email") => {
    if (isPacingActive) return;
    
    setIsPacingActive(true);
    setPacingCountdown(3); // 3 seconds safety buffer pacing

    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount <= 0) {
        clearInterval(interval);
        
        // Execute real native communication dispatch
        if (channel === "whatsapp") {
          const encodedMsg = encodeURIComponent(customMessage);
          const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;
          window.open(waUrl, "_blank", "noopener,noreferrer");
        } else {
          const encodedSubject = encodeURIComponent(emailSubject);
          const encodedBody = encodeURIComponent(customMessage);
          const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
          window.location.href = mailtoUrl;
        }

        // Set persistent cooldown anti-spam lockout for 20 seconds
        const cooldownKey = `${recipientId}_${channel}`;
        setCooldowns((prev) => ({ ...prev, [cooldownKey]: 20 }));

        // Reset pacing flags and close modal
        setIsPacingActive(false);
        setPacingCountdown(null);
        setSelectedRecipient(null);
      } else {
        setPacingCountdown(currentCount);
      }
    }, 1000);
  };

  // Check auth or URL passcode params on load
  useEffect(() => {
    // 1. Check if they have the token in the URL pre-authorized
    const token = searchParams.get("token") || searchParams.get("passcode") || searchParams.get("pass");
    if (token === SECURE_PASSCODE) {
      setAuthorized(true);
      return;
    }

    // 2. Check if logged in in Firebase Admin session
    const unsubscribeAuth = adminAuth.onAuthStateChanged((user) => {
      if (user) {
        setAuthorized(true);
      }
    });

    return () => unsubscribeAuth();
  }, [searchParams]);

  // Fetch registrations from Firestore when authorized
  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    const collectionPath = "registrations";
    const q = query(collection(db, collectionPath), where("itemType", "==", "class"));

    const unsubscribeData = onSnapshot(q, (snapshot) => {
      try {
        const rawData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter for cohort classes and specifically the chest radiographs "flagship" class
        // (Supports any registration where title incorporates Chest Radiographs, Chest Critique, or is default chest-critique-2026)
        const flagshipData = rawData.filter((reg: any) => {
          const itemType = reg.itemType || reg.answers?.itemType || "";
          const itemTitle = (reg.itemTitle || reg.answers?.itemTitle || reg.eventTitle || "").toLowerCase();
          const itemId = reg.itemId || "";

          const isMatchingTitle = 
            itemTitle.includes("critique") || 
            itemTitle.includes("flagship") || 
            itemTitle.includes("chest") ||
            itemTitle.includes("radiographic image critique");
          
          const isMatchingId = 
            itemId === "chest-critique-2026" || 
            itemId.includes("flagship");

          // Safe fallback - if no specific title/id match but it has the class context, include as well, but prioritize flagship references
          return (itemType === "class" && isMatchingTitle) || isMatchingId;
        });

        // Safe client sorting by registration date
        flagshipData.sort((a, b) => {
          const getMillis = (item: any) => {
            const timeVal = item.registeredAt || item.timestamp || item.createdAt;
            if (timeVal?.toDate) return timeVal.toDate().getTime();
            if (timeVal?.seconds) return timeVal.seconds * 1000;
            if (timeVal) return new Date(timeVal).getTime();
            return 0;
          };
          return getMillis(b) - getMillis(a);
        });

        setRegistrations(flagshipData);
        setLoading(false);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, collectionPath);
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore real-time subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribeData();
  }, [authorized]);

  // Handle Passcode verification
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === SECURE_PASSCODE) {
      setAuthorized(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid access passcode. Please try again.");
    }
  };

  // Extract fields uniformly
  const getStudentInfo = (reg: any) => {
    // Check inside answers map if present
    const answers = reg.answers || {};
    return {
      name: answers.fullname || reg.fullname || reg.name || answers.name || "—",
      email: answers.email || reg.email || answers.emailaddress || "—",
      whatsapp: answers.whatsapp || reg.whatsapp || reg.phone || answers.phone || "—",
      qualification: answers.qualification || reg.qualification || "—",
      title: reg.itemTitle || answers.itemTitle || "Radiographic Image Critique Class"
    };
  };

  // Filter list based on search
  const filteredRegistrations = registrations.filter(reg => {
    const info = getStudentInfo(reg);
    const textQuery = searchQuery.toLowerCase();
    return (
      info.name.toLowerCase().includes(textQuery) ||
      info.email.toLowerCase().includes(textQuery) ||
      info.whatsapp.toLowerCase().includes(textQuery) ||
      info.qualification.toLowerCase().includes(textQuery)
    );
  });

  // Export to CSV
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registered students found to export.");
      return;
    }

    const headers = ["ID", "Registration Date", "Class Title", "Full Name", "Email Address", "WhatsApp Number", "Qualification"];
    const rows = filteredRegistrations.map(reg => {
      const info = getStudentInfo(reg);
      const registerDate = reg.registeredAt || reg.timestamp || reg.createdAt;
      const dateString = registerDate?.toDate 
        ? registerDate.toDate().toLocaleString() 
        : registerDate 
          ? new Date(registerDate).toLocaleString() 
          : "N/A";

      return [
        reg.id,
        `"${dateString}"`,
        `"${info.title.replace(/"/g, '""')}"`,
        `"${info.name.replace(/"/g, '""')}"`,
        `"${info.email.replace(/"/g, '""')}"`,
        `"${info.whatsapp.replace(/"/g, '""')}"`,
        `"${info.qualification.replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Flagship_Class_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authorized yet, show a beautiful, premium lock page
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-12 px-4">
        <SEO title="Secure Registrations Access" description="Access flagship class registrations securely" />
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 max-w-md w-full shadow-xl shadow-slate-100 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure Database Access</h2>
            <p className="text-sm font-semibold text-slate-400">This request is marked as urgent. Enter the verification passcode to fetch flagship class registration logs immediately.</p>
          </div>

          {passcodeError && (
            <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {passcodeError}
            </div>
          )}

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Passcode</label>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode (e.g. flagship2026)"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-sm transition-all text-center"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Unlock size={14} /> Verify & Unlock
            </button>
          </form>

          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Convenience Hint for Urgent Retrieval</span>
            <p className="text-[11px] text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50 mt-1 max-w-xs mx-auto">
              Suggested Passcode: <span className="font-mono font-black border-b border-dashed border-amber-400">{SECURE_PASSCODE}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-6">
      <SEO title="Flagship Class Registrations" description="Secure urgent flagship class registrations dashboard" />
      
      <div className="container mx-auto max-w-5xl">
        {/* Top bar with back-link and export */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/registrations" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-black text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Full Database
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Flagship Class Registrations</h1>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shrink-0 animate-pulse">
                <Check size={14} /> Live Sync Active
              </span>
            </div>
            <p className="text-slate-500 font-medium tracking-tight mt-1 max-w-2xl">
              Urgent roster retrieval for the Radiographic Image Critique Cohort. Lists participant names, email addresses, qualifications, and telephone numbers.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={exportToCSV}
              className="px-6 py-4.5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10"
            >
              <Download size={16} /> Export to Excel / CSV
            </button>
          </div>
        </div>

        {/* Quick Search Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by student name, email, qualification or telephone number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all text-sm"
            />
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 font-mono font-black text-xs text-slate-500 shrink-0 w-full sm:w-auto text-center">
            {filteredRegistrations.length} of {registrations.length} Registers
          </div>
        </div>

        {/* Dynamic Display Panel */}
        {loading ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-emerald-600 mb-4" size={32} />
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Querying registrations live...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-black text-slate-800">No Registrants Match Select Search</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">Please adjust your search text or verify if students registration form was completed in the system.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    <th className="py-4.5 px-6 w-12 text-center">#</th>
                    <th className="py-4.5 px-6">Participant Details</th>
                    <th className="py-4.5 px-6">Contact & Phone</th>
                    <th className="py-4.5 px-6">Qualification</th>
                    <th className="py-4.5 px-6">Register Date</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRegistrations.map((reg, index) => {
                    const info = getStudentInfo(reg);
                    const registerDate = reg.registeredAt || reg.timestamp || reg.createdAt;
                    const dateString = registerDate?.toDate 
                      ? registerDate.toDate().toLocaleDateString() + " " + registerDate.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : registerDate 
                        ? new Date(registerDate).toLocaleDateString() 
                        : "N/A";

                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 px-6 w-12 text-center font-mono text-xs text-slate-400 font-bold bg-slate-50/30">
                          {index + 1}
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-800 text-sm block tracking-tight">{info.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">{info.title}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1.5">
                            <a href={`mailto:${info.email}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-primary transition-colors">
                              <Mail size={12} className="text-slate-400" /> {info.email}
                            </a>
                            <a href={`https://wa.me/${info.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline">
                              <Phone size={12} className="text-emerald-500" /> {info.whatsapp}
                            </a>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="px-2.5 py-1 bg-slate-100 text-[10px] font-black uppercase text-slate-600 rounded-lg">
                            {info.qualification}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-mono text-xs text-slate-400 font-semibold">
                          {dateString}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => {
                                setSelectedRecipient(reg);
                                setCustomMessage(getDynamicMessage(info.name));
                                setTargetPhone(cleanPhoneNumber(info.whatsapp));
                                setTargetEmail(info.email);
                                setEmailSubject("Urgent Reminder: StudiRad Flagship Class Starts Monday, 22 June 2026");
                                setActiveChannel("whatsapp");
                              }}
                              disabled={!!cooldowns[`${reg.id}_whatsapp`]}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-[11px] font-black tracking-tight transition-all shadow-sm ${
                                cooldowns[`${reg.id}_whatsapp`]
                                  ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100"
                              }`}
                            >
                              <Phone size={11} className={cooldowns[`${reg.id}_whatsapp`] ? "text-slate-300" : "text-emerald-500"} />
                              {cooldowns[`${reg.id}_whatsapp`] ? `Wait ${cooldowns[`${reg.id}_whatsapp`]}s` : "WhatsApp"}
                            </button>

                            {/* Email Button */}
                            <button
                              onClick={() => {
                                setSelectedRecipient(reg);
                                setCustomMessage(getDynamicMessage(info.name).replace(/\*/g, ""));
                                setTargetPhone(cleanPhoneNumber(info.whatsapp));
                                setTargetEmail(info.email);
                                setEmailSubject("Urgent Reminder: StudiRad Flagship Class Starts Monday, 22 June 2026");
                                setActiveChannel("email");
                              }}
                              disabled={!!cooldowns[`${reg.id}_email`]}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-[11px] font-black tracking-tight transition-all shadow-sm ${
                                cooldowns[`${reg.id}_email`]
                                  ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
                                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                              }`}
                            >
                              <Mail size={11} className={cooldowns[`${reg.id}_email`] ? "text-slate-300" : "text-indigo-500"} />
                              {cooldowns[`${reg.id}_email`] ? `Wait ${cooldowns[`${reg.id}_email`]}s` : "Email"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Summary Stats */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-bold text-slate-500">
              <div className="flex gap-4 items-center">
                <span>Total Registrants found: <strong className="text-slate-800">{filteredRegistrations.length}</strong></span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                Created securely as requested • StudiRad Admin Database
              </span>
            </div>
          </div>
        )}

        {/* Elegant Preview & Send Modal */}
        {selectedRecipient && (() => {
          const info = getStudentInfo(selectedRecipient);
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 max-w-xl w-full shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block bg-brand-primary/5 px-2.5 py-1 rounded-md w-fit border border-brand-primary/10 mb-1">
                      Multi-Channel Broadcast Reminder
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Preview & Send Message</h3>
                    <p className="text-xs font-semibold text-slate-400">Review notification channel and details for <strong className="text-slate-700 font-bold">{info.name}</strong></p>
                  </div>
                  <button 
                    onClick={() => setSelectedRecipient(null)}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Channel Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChannel("whatsapp");
                      // Convert / load template with WhatsApp formatting (asterisks)
                      setCustomMessage(getDynamicMessage(info.name));
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activeChannel === "whatsapp" 
                        ? "bg-white text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Phone size={13} className="text-emerald-500" /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChannel("email");
                      // Convert / load template for Email formatting (plain text, strip asterisks)
                      setCustomMessage(getDynamicMessage(info.name).replace(/\*/g, ""));
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activeChannel === "email" 
                        ? "bg-white text-indigo-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Mail size={13} className="text-indigo-500" /> Email Form
                  </button>
                </div>

                {/* Dynamic input verification */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Name</label>
                      <input 
                        type="text" 
                        disabled
                        value={info.name}
                        className="w-full px-4 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs border border-transparent cursor-not-allowed"
                      />
                    </div>
                    {activeChannel === "whatsapp" ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Designated WhatsApp Phone</label>
                        <input 
                          type="text" 
                          value={targetPhone}
                          onChange={(e) => setTargetPhone(e.target.value)}
                          placeholder="e.g. 2348031234567"
                          className="w-full px-4 py-3 bg-slate-50 border border-emerald-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-xs transition-all"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block ml-1">Include international country code (e.g. 234 for Nigeria)</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Recipient Email Address</label>
                        <input 
                          type="text" 
                          value={targetEmail}
                          onChange={(e) => setTargetEmail(e.target.value)}
                          placeholder="e.g. doctor@gmail.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-xs transition-all"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block ml-1">Confirm correct destination email address</span>
                      </div>
                    )}
                  </div>

                  {activeChannel === "email" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">Email Subject Line</label>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject of the email"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-xs transition-all"
                      />
                    </div>
                  )}

                  {/* Message Preview Text Area */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Content</label>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{customMessage.length} characters</span>
                    </div>
                    <textarea
                      rows={8}
                      value={customMessage}
                      disabled={isPacingActive}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-brand-primary/20 font-semibold text-xs leading-relaxed transition-all resize-none font-mono text-slate-800"
                    />
                  </div>

                  {/* Delay Indicator / Status Warning */}
                  {isPacingActive && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-xs font-bold space-y-1 animate-pulse">
                      <p className="flex items-center gap-2">
                        <span>🔒</span> 
                        <span>Anti-Spam Safety Buffer Active: Pacing delivery in {pacingCountdown}s...</span>
                      </p>
                      <p className="text-[10px] text-amber-600 font-normal ml-6">
                        This brief pacing delay prevents consecutive action triggers to safeguard accounts from flagging.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50">
                    {activeChannel === "whatsapp" 
                      ? "⚠️ Launches WhatsApp Web/App with pre-filled, rate-paced markdown text." 
                      : "⚠️ Launches your system's default email agent (e.g. Outlook/Mail)."}
                  </div>
                  <div className="flex items-center gap-3 justify-end flex-wrap">
                    <button
                      type="button"
                      disabled={isPacingActive}
                      onClick={() => setSelectedRecipient(null)}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all uppercase tracking-wider disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isPacingActive}
                      onClick={() => triggerPacedSend(selectedRecipient.id, activeChannel)}
                      className={`px-6 py-3 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg uppercase tracking-wider disabled:opacity-50 ${
                        activeChannel === "whatsapp"
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10"
                      }`}
                    >
                      {isPacingActive ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending in {pacingCountdown}s...
                        </>
                      ) : activeChannel === "whatsapp" ? (
                        <>
                          <Send size={12} /> Send on WhatsApp
                        </>
                      ) : (
                        <>
                          <Mail size={12} /> Send Email Remind
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
