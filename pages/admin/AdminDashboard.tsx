import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminAuth } from "../../firebase";
import { FileText, Book, Bell, Settings, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminAuth.signOut();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const dashboardItems = [
    {
      title: "Post Blog",
      description: "Write articles, manage content, and share news.",
      icon: FileText,
      path: "/admin/blog",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Manage Materials",
      description: "Upload study resources and organize the library.",
      icon: Book,
      path: "/admin/materials",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Review Submissions",
      description: "Approve or reject user-submitted materials.",
      icon: Bell,
      path: "/admin/review",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Settings",
      description: "Manage admin preferences and account details.",
      icon: Settings,
      path: "#",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-brand-dark text-white pt-24 pb-12 rounded-b-[3rem] shadow-xl relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <LayoutDashboard size={24} className="text-brand-accent" />
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 text-white rounded-lg border border-white/10 hover:border-red-500/50 transition-all text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
             <h2 className="text-xl font-bold mb-1">Welcome back, Admin</h2>
             <p className="text-gray-400 text-sm">Manage your platform content and users from here.</p>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 pb-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100"
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center text-sm font-semibold text-brand-primary">
                Access Tool <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats or Recent Activity Placeholder */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4">System Status</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Database Connection</span>
                   </div>
                   <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Storage Bucket</span>
                   </div>
                   <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Operational</span>
                </div>
             </div>
           </div>
           
           <div className="bg-brand-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <h3 className="font-bold text-xl mb-2 relative z-10">StudiRad Admin</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">Need technical assistance? Contact the development team.</p>
              <button className="w-full py-2 bg-white text-brand-primary font-bold rounded-lg relative z-10 hover:bg-gray-100 transition-colors">
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;