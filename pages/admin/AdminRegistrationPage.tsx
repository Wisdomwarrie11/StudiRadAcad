import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminAuth, db } from "../../firebase";
import SEO from "../../components/SEO";
import { 
  collection, 
  onSnapshot, 
  query, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  User, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Video,
  Send,
  X
} from "lucide-react";

export default function AdminRegistrationsPage() {
  const navigate = useNavigate();
  const [currentSource, setCurrentSource] = useState<"classes" | "courses" | "tutoring" | "orientation" >("classes");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "class" | "course">("all");
  const [selectedItemFilter, setSelectedItemFilter] = useState("all");
  const [itemsList, setItemsList] = useState<string[]>([]);

  // WhatsApp reminder broadcast state helpers
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [targetPhone, setTargetPhone] = useState("");

  const getDynamicMessage = (fullName: string): string => {
    const greetingName = fullName && fullName !== "—" ? fullName.trim() : "Colleague";
    const greetingSalutation = greetingName === "Colleague" ? "Dear Colleague" : `Hello ${greetingName}`;
    return `${greetingSalutation},
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

  const getStudentInfo = (reg: any) => {
    const answers = reg.answers || {};
    return {
      name: answers.fullname || reg.fullname || reg.name || answers.name || "—",
      email: answers.email || reg.email || answers.emailaddress || "—",
      whatsapp: answers.whatsapp || reg.whatsapp || reg.phone || answers.phone || "—",
      qualification: answers.qualification || reg.qualification || "—",
      title: reg.itemTitle || answers.itemTitle || reg.eventTitle || "Radiographic Class"
    };
  };

  // 1. Safe way to decode/classify item category/type if missing, nested, or flat
  const getRegType = (reg: any): "class" | "course" => {
    if (reg.itemType === "class") return "class";
    if (reg.itemType === "course") return "course";
    if (reg.answers?.itemType === "class") return "class";
    if (reg.answers?.itemType === "course") return "course";
    
    // Classify based on itemTitle/eventTitle
    const title = (reg.itemTitle || reg.answers?.itemTitle || reg.eventTitle || "").toLowerCase();
    if (title.includes("critique") || title.includes("class") || title.includes("cohort") || title.includes("live")) {
      return "class";
    }
    if (title.includes("course") || title.includes("pre-recorded") || title.includes("curriculum")) {
      return "course";
    }
    return "class"; // Default fallback
  };

  // 2. Safe way to retrieve registration title regardless of where stored
  const getRegTitle = (reg: any): string => {
    return reg.itemTitle || reg.answers?.itemTitle || reg.eventTitle || "Untitled Course Class";
  };

  // 3. Merges answers map and flat root fields for absolute display safety
  const getMergedAnswers = (reg: any): Record<string, any> => {
    const merged: Record<string, any> = {};
    
    // Extract inside answers map if present
    if (reg.answers && typeof reg.answers === "object") {
      Object.entries(reg.answers).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "" && k !== "itemType" && k !== "itemTitle" && k !== "itemId") {
          let labelKey = k;
          const kLower = k.toLowerCase();
          if (kLower === "fullname" || kLower === "name" || kLower === "full name") labelKey = "Full Name";
          else if (kLower === "email" || kLower === "emailaddress" || kLower === "email address") labelKey = "Email";
          else if (kLower === "whatsapp" || kLower === "phone" || kLower === "whatsapp number") labelKey = "WhatsApp / Phone";
          else if (kLower === "qualification") labelKey = "Qualification";
          
          merged[labelKey] = v;
        }
      });
    }

    // Extract root-level specific data fields if present and not overwritten by correct answers keys
    const rootKeys = ["fullname", "name", "email", "whatsapp", "phone", "qualification", "level", "status", "heardFrom"];
    rootKeys.forEach(k => {
      const val = reg[k];
      if (val !== undefined && val !== null && val !== "") {
        let labelKey = k;
        if (k === "fullname" || k === "name") labelKey = "Full Name";
        else if (k === "email") labelKey = "Email";
        else if (k === "whatsapp" || k === "phone") labelKey = "WhatsApp / Phone";
        else if (k === "qualification") labelKey = "Qualification";
        else if (k === "level") labelKey = "Level";
        else if (k === "status") labelKey = "Status";
        else if (k === "heardFrom") labelKey = "Heard From";
        
        if (!merged[labelKey]) {
          merged[labelKey] = val;
        }
      }
    });

    return merged;
  };

  useEffect(() => {
    const unsubscribeAuth = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });

    let currentCollection = "registrations";
    if (currentSource === "tutoring") {
      currentCollection = "tutoring_enrollments";
    } else if (currentSource === "orientation") {
      currentCollection = "orientation_registrations";
    }

    setLoading(true);
    const q = query(collection(db, currentCollection));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Index-safe Client-Side Sorting to prevent dynamic index failure errors
      data.sort((a, b) => {
        const getMillis = (item: any) => {
          const timeVal = item.registeredAt || item.timestamp || item.createdAt;
          if (timeVal?.toDate) return timeVal.toDate().getTime();
          if (timeVal?.seconds) return timeVal.seconds * 1000;
          if (timeVal) return new Date(timeVal).getTime();
          return 0;
        };
        return getMillis(b) - getMillis(a);
      });

      setRegistrations(data);

      // Extract unique list of item/webinar names for the filter options dropdown
      let items: string[] = [];
      if (currentSource === "classes" || currentSource === "courses") {
        const targetType = currentSource === "classes" ? "class" : "course";
        const filteredData = data.filter((reg: any) => getRegType(reg) === targetType);
        items = Array.from(new Set(filteredData.map((reg: any) => getRegTitle(reg)))).filter(Boolean);
      } else if (currentSource === "tutoring") {
        items = Array.from(new Set(data.flatMap((reg: any) => {
          if (Array.isArray(reg.courses)) return reg.courses;
          if (typeof reg.courses === 'string') return [reg.courses];
          return [];
        }))).filter(Boolean);
      } else if (currentSource === "orientation") {
        items = Array.from(new Set(data.map((reg: any) => reg.eventTitle || ""))).filter(Boolean);
      }
      setItemsList(items);
      setLoading(false);
    }, (error) => {
      console.error(`Error loading ${currentCollection} database:`, error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [navigate, currentSource]);

  const handleDelete = async (id: string) => {
    let currentCollection = "registrations";
    if (currentSource === "tutoring") {
      currentCollection = "tutoring_enrollments";
    } else if (currentSource === "orientation") {
      currentCollection = "orientation_registrations";
    }

    if (window.confirm(`Are you sure you want to delete this registration from ${currentSource} database?`)) {
      try {
        await deleteDoc(doc(db, currentCollection, id));
      } catch (error) {
        console.error("Error deleting registration:", error);
        alert("Failed to delete registration. Please try again.");
      }
    }
  };

  // Search and filter logic
  const filteredRegistrations = registrations.filter(reg => {
    if (currentSource === "classes" && getRegType(reg) !== "class") return false;
    if (currentSource === "courses" && getRegType(reg) !== "course") return false;

    const title = getRegTitle(reg);
    
    // Look inside custom answers or fields for any matching query string
    const mergedAnswers = getMergedAnswers(reg);
    const answersText = Object.entries(mergedAnswers).map(([k, v]) => `${k}:${v}`).join(" ").toLowerCase();

    const topLevelText = `${reg.name || ""} ${reg.email || ""} ${reg.whatsapp || ""} ${reg.level || ""} ${reg.status || ""} ${reg.heardFrom || ""}`.toLowerCase();

    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answersText.includes(searchQuery.toLowerCase()) ||
      topLevelText.includes(searchQuery.toLowerCase());

    const matchesType = true;
    
    let matchesItem = selectedItemFilter === "all";
    if (!matchesItem) {
      if (currentSource === "classes" || currentSource === "courses") {
        matchesItem = title === selectedItemFilter;
      } else if (currentSource === "tutoring") {
        matchesItem = (Array.isArray(reg.courses) && reg.courses.includes(selectedItemFilter)) || reg.courses === selectedItemFilter;
      } else if (currentSource === "orientation") {
        matchesItem = reg.eventTitle === selectedItemFilter;
      }
    }

    return matchesSearch && matchesType && matchesItem;
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    let headers: string[] = [];
    let rows: string[] = [];

    const getFormattedDate = (item: any) => {
      const timeVal = item.registeredAt || item.timestamp || item.createdAt;
      if (timeVal?.toDate) return timeVal.toDate().toLocaleString();
      if (timeVal?.seconds) return new Date(timeVal.seconds * 1000).toLocaleString();
      if (timeVal) return new Date(timeVal).toLocaleString();
      return "N/A";
    };

    if (currentSource === "classes" || currentSource === "courses") {
      // Dynamic header mapping for dynamic form template answers
      const answerKeys = Array.from(
        new Set(
          filteredRegistrations.flatMap(reg => Object.keys(getMergedAnswers(reg)))
        )
      ) as string[];

      headers = ["ID", "Register Date", "Type", "Class/Course Title", ...answerKeys];
      
      rows = filteredRegistrations.map(reg => {
        const dateStr = getFormattedDate(reg);
        const regAnswers = getMergedAnswers(reg);
        const rRow = [
          reg.id,
          `"${dateStr}"`,
          `"${getRegType(reg)}"`,
          `"${getRegTitle(reg).replace(/"/g, '""')}"`
        ];

        answerKeys.forEach((key: string) => {
          let val = regAnswers[key] || "";
          val = val.toString().replace(/"/g, '""');
          rRow.push(`"${val}"`);
        });

        return rRow.join(",");
      });
    } else if (currentSource === "tutoring") {
      headers = [
        "Enrollment ID", 
        "Date Received", 
        "Student Name", 
        "Email Address", 
        "WhatsApp Phone", 
        "Professional Level", 
        "Booking Type", 
        "Plan ID", 
        "Selected Subjects/Courses", 
        "Total Amount Paid", 
        "Intended Start Date", 
        "Target Tutor Email", 
        "Payment Reference", 
        "Payment Status"
      ];

      rows = filteredRegistrations.map(reg => {
        const dateStr = getFormattedDate(reg);
        const rRow = [
          reg.id,
          `"${dateStr}"`,
          `"${(reg.name || "").replace(/"/g, '""')}"`,
          `"${(reg.email || "").replace(/"/g, '""')}"`,
          `"${(reg.whatsapp || "").replace(/"/g, '""')}"`,
          `"${(reg.level || "").replace(/"/g, '""')}"`,
          `"${reg.bookingType || ""}"`,
          `"${reg.planId || ""}"`,
          `"${(reg.courses ? reg.courses.join(", ") : "").replace(/"/g, '""')}"`,
          reg.totalAmount || 0,
          `"${reg.startDate || ""}"`,
          `"${(reg.targetAdminEmail || "").replace(/"/g, '""')}"`,
          `"${(reg.paymentRef || "").replace(/"/g, '""')}"`,
          `"${reg.status || ""}"`
        ];
        return rRow.join(",");
      });
    } else {
      // orientation
      headers = [
        "Registration ID", 
        "Date Registered", 
        "Attendee Name", 
        "Designation", 
        "Referral Channel", 
        "Age Constraint Under 18", 
        "Parental Consent", 
        "Webinar Date", 
        "Webinar Event Title"
      ];

      rows = filteredRegistrations.map(reg => {
        const dateStr = getFormattedDate(reg);
        const rRow = [
          reg.id,
          `"${dateStr}"`,
          `"${(reg.name || "").replace(/"/g, '""')}"`,
          `"${(reg.status || "").replace(/"/g, '""')}"`,
          `"${(reg.heardFrom || "").replace(/"/g, '""')}"`,
          reg.isUnder18 ? "Yes" : "No",
          reg.hasParentalPermission ? "Yes" : "No",
          `"${reg.eventDate || ""}"`,
          `"${(reg.eventTitle || "").replace(/"/g, '""')}"`
        ];
        return rRow.join(",");
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `StudiRad_${currentSource}_Database_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-6">
      <SEO title="Registrations Database | Admin" description="Manage database of all student sign-ups and orientation registrations" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-black text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Form Registrations</h1>
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-black">
                {filteredRegistrations.length} Total
              </span>
            </div>
            <p className="text-slate-500 font-medium tracking-tight mt-1">Review form response cards submitted across various active channels and live classes.</p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-6 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/10"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Dynamic Source Tabs Selector */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => {
              setCurrentSource("classes");
              setSearchQuery("");
              setSelectedItemFilter("all");
              setTypeFilter("all");
            }}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
              currentSource === "classes"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <BookOpen size={14} /> Cohort Classes
          </button>
          <button
            onClick={() => {
              setCurrentSource("courses");
              setSearchQuery("");
              setSelectedItemFilter("all");
              setTypeFilter("all");
            }}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
              currentSource === "courses"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Video size={14} /> Pre-recorded Courses
          </button>
          <button
            onClick={() => {
              setCurrentSource("tutoring");
              setSearchQuery("");
              setSelectedItemFilter("all");
              setTypeFilter("all");
            }}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
              currentSource === "tutoring"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User size={14} /> Private Tutoring
          </button>
          <button
            onClick={() => {
              setCurrentSource("orientation");
              setSearchQuery("");
              setSelectedItemFilter("all");
              setTypeFilter("all");
            }}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
              currentSource === "orientation"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Video size={14} /> Orientation Signups
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder={`Search registered students, emails, key answers inside the ${currentSource} database...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm"
              />
            </div>

            {/* Dynamic Specific Item Selector */}
            <div className="w-full md:w-56 relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={selectedItemFilter}
                onChange={e => setSelectedItemFilter(e.target.value)}
                className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="all">
                  {currentSource === "classes" 
                    ? "All Class Titles"
                    : currentSource === "courses"
                      ? "All Course Titles"
                      : currentSource === "tutoring"
                        ? "All Courses"
                        : "All Webinars"}
                </option>
                {itemsList.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display Panel */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin text-brand-primary mb-4" size={32} />
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Syncing Database in Real-Time...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-sm">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-black text-slate-800">No Signups Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">No records match your selection criteria in the {currentSource} collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRegistrations.map((reg) => {
              const registerDate = reg.registeredAt || reg.timestamp || reg.createdAt;
              const dateString = registerDate?.toDate 
                ? registerDate.toDate().toLocaleString() 
                : registerDate 
                  ? new Date(registerDate).toLocaleString() 
                  : "N/A";

              if (currentSource === "classes" || currentSource === "courses") {
                const isClass = currentSource === "classes";
                const regTitle = getRegTitle(reg);
                const regAnswers = getMergedAnswers(reg);
                return (
                  <div 
                    key={reg.id} 
                    className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-brand-primary/20"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-6 -mt-6 z-0 group-hover:bg-brand-primary/5 transition-colors"></div>

                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            isClass ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <BookOpen size={10} /> {isClass ? 'Cohort Class' : 'Pre-recorded Course'}
                          </span>
                          <h4 className="text-base font-black text-slate-800 tracking-tight leading-snug line-clamp-2 pr-6 mt-1">{regTitle}</h4>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-inner"
                          title="Delete registration"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Answers Loop */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {Object.entries(regAnswers).map(([key, value]: [string, any]) => {
                          const lowerKey = key.toLowerCase();
                          let icon = <ChevronRight size={14} className="text-slate-400 mt-0.5 shrink-0" />;
                          if (lowerKey.includes("name") || lowerKey.includes("fullname")) {
                            icon = <User size={14} className="text-brand-primary mt-0.5 shrink-0" />;
                          } else if (lowerKey.includes("email")) {
                            icon = <Mail size={14} className="text-brand-primary mt-0.5 shrink-0" />;
                          } else if (lowerKey.includes("whatsapp") || lowerKey.includes("phone") || lowerKey.includes("tel")) {
                            icon = <Phone size={14} className="text-brand-primary mt-0.5 shrink-0" />;
                          }

                          return (
                            <div key={key} className="flex gap-2.5 items-start">
                              {icon}
                              <div>
                                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">{key}</span>
                                <span className="text-xs font-bold text-slate-700 block mt-0.5 whitespace-pre-wrap select-all">{value || "—"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Send WhatsApp action */}
                      <div className="relative z-10 pt-3 flex justify-end">
                        <button
                          onClick={() => {
                            const info = getStudentInfo(reg);
                            setSelectedRecipient(reg);
                            setCustomMessage(getDynamicMessage(info.name));
                            setTargetPhone(cleanPhoneNumber(info.whatsapp));
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-xs font-extrabold transition-colors w-full justify-center shadow-sm"
                        >
                          <Send size={11} className="text-emerald-600" /> Send Reminder via WhatsApp Support
                        </button>
                      </div>
                    </div>

                    {/* Footer Date Indicator */}
                    <div className="relative z-10 pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateString}
                      </span>
                      <span className="text-[8px] tracking-wide text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-md font-bold">
                        ID: {reg.id.slice(0, 6)}
                      </span>
                    </div>
                  </div>
                );
              } else if (currentSource === "tutoring") {
                return (
                  <div 
                    key={reg.id} 
                    className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-brand-primary/20"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-6 -mt-6 z-0 group-hover:bg-brand-primary/5 transition-colors"></div>

                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700">
                            <SlidersHorizontal size={10} /> Private Tutoring Enrollment
                          </span>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug pr-6 mt-1">{reg.name || "Unnamed Student"}</h4>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-inner"
                          title="Delete enrollment"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Content Rows */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div className="flex gap-2.5">
                          <Mail size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Email Address</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5 break-all select-all">{reg.email || "—"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <Phone size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">WhatsApp Phone</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5 select-all">{reg.whatsapp || "—"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5 col-span-1 sm:col-span-2">
                          <BookOpen size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Target Subjects / Courses</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(() => {
                                const coursesArr = Array.isArray(reg.courses)
                                  ? reg.courses
                                  : typeof reg.courses === "string"
                                    ? [reg.courses]
                                    : [];
                                return coursesArr.length > 0 ? (
                                  coursesArr.map((course: string) => (
                                    <span key={course} className="px-2 py-0.5 bg-violet-50 text-[10px] font-black uppercase text-violet-600 rounded">
                                      {course}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs font-bold text-slate-500">—</span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <User size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Level</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5">{reg.level || "—"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <Calendar size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Start Date</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5">{reg.startDate || "—"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <SlidersHorizontal size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Booking Type & Cost</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5">
                              {reg.bookingType === "instant" ? "Instant Booking" : "Subscription Plan"}{" "}
                              {reg.totalAmount ? `(₦${reg.totalAmount.toLocaleString()})` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <SlidersHorizontal size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Status & Payment</span>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider block mt-0.5 ${
                              reg.status === "active" || reg.status === "paid" ? "text-emerald-600" : "text-amber-500"
                            }`}>
                              {reg.status || "pending"} {reg.paymentRef ? `[Ref: ${reg.paymentRef}]` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateString}
                      </span>
                      <span className="text-[8px] tracking-wide text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md font-bold">
                        Plan ID: {reg.planId || "N/A"}
                      </span>
                    </div>
                  </div>
                );
              } else {
                // orientation database
                return (
                  <div 
                    key={reg.id} 
                    className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-brand-primary/20"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-6 -mt-6 z-0 group-hover:bg-brand-primary/5 transition-colors"></div>

                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600">
                            <Video size={10} /> Webinar Orientation Signup
                          </span>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug pr-6 mt-1">{reg.name || "Unnamed Student"}</h4>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-inner"
                          title="Delete orientation registration"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Content Rows */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex gap-2.5">
                          <Video size={14} className="text-brand-primary mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Webinar Title</span>
                            <span className="text-xs font-extrabold text-slate-700 block mt-0.5">{reg.eventTitle || "Welcome to Radiography"}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex gap-2.5">
                            <User size={14} className="text-brand-primary mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Role / Level</span>
                              <span className="text-xs font-bold text-slate-700 block mt-0.5">{reg.status || "—"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5">
                            <SlidersHorizontal size={14} className="text-brand-primary mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Heard From</span>
                              <span className="text-xs font-bold text-slate-700 block mt-0.5">{reg.heardFrom || "—"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5">
                            <SlidersHorizontal size={14} className="text-brand-primary mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Age Condition</span>
                              <span className="text-xs font-bold text-slate-700 block mt-0.5">{reg.isUnder18 ? "Under 18 Years" : "18 or Older"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2.5">
                            <SlidersHorizontal size={14} className="text-brand-primary mt-1 shrink-0" />
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Parent Consent</span>
                              <span className={`text-xs font-bold block mt-0.5 ${reg.hasParentalPermission ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {reg.hasParentalPermission ? "Granted" : "Not Needed / No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateString}
                      </span>
                      <span className="text-[8px] tracking-wide text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                        Event: {reg.eventDate || "N/A"}
                      </span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Elegant Preview & Send Modal */}
        {selectedRecipient && (() => {
          const info = getStudentInfo(selectedRecipient);
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 max-w-xl w-full shadow-2xl p-8 space-y-6">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100 mb-1">
                      WhatsApp Broadcast Reminder
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Preview & Send Message</h3>
                    <p className="text-xs font-semibold text-slate-400">Review message details for <strong className="text-slate-700 font-bold">{info.name}</strong></p>
                  </div>
                  <button 
                    onClick={() => setSelectedRecipient(null)}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Number verification */}
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
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Designated WhatsApp Phone</label>
                      <input 
                        type="text" 
                        value={targetPhone}
                        onChange={(e) => setTargetPhone(e.target.value)}
                        placeholder="e.g. 2348031234567"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-xs transition-all"
                      />
                      <span className="text-[9px] text-slate-400 font-medium block ml-1">Include international country code (e.g. 234 for Nigeria)</span>
                    </div>
                  </div>

                  {/* Message Preview Text Area */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Content</label>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{customMessage.length} characters</span>
                    </div>
                    <textarea
                      rows={8}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold text-xs leading-relaxed transition-all resize-none font-mono"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                    ⚠️ Opens WhatsApp Web/App with pre-filled reminder.
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedRecipient(null)}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const encodedMsg = encodeURIComponent(customMessage);
                        const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;
                        window.open(waUrl, "_blank", "noopener,noreferrer");
                        setSelectedRecipient(null);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/10 uppercase tracking-wider"
                    >
                      <Send size={12} /> Send on WhatsApp
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
