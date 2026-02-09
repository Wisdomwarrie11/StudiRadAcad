
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, ArrowUp, ChevronRight } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // iOS detection
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Capture install prompt for Chrome/Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a small delay
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we show the prompt if not in standalone
    if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[100] animate-in slide-in-from-bottom duration-700">
      <div className="bg-navy/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Smartphone size={120} />
        </div>

        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-4 right-4 p-1 text-white/30 hover:text-white transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-brandOrange text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brandOrange/20">
            <Download size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Add to Home Screen</h4>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium leading-tight">
              {isIOS 
                ? 'Install Meditin for the best mobile experience and offline access.'
                : 'Get fast access to mocks & results directly from your home screen.'}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          {isIOS ? (
            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <Share size={18} />
                </div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Tap Share</span>
              </div>
              {/* Added missing ChevronRight import */}
              <ChevronRight className="text-white/20" size={16} />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <PlusSquare size={18} />
                </div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Add to Home</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleInstall}
              className="w-full py-4 bg-brandOrange text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brandOrange/20 active:scale-95"
            >
              Install Application
            </button>
          )}
        </div>
      </div>
      
      {isIOS && (
        <div className="mt-4 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-10 h-10 bg-brandOrange rounded-full flex items-center justify-center text-white shadow-xl">
             <ArrowUp size={20} />
          </div>
          <p className="text-[8px] font-black text-navy/40 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-slate-100">
             Menu is at the bottom center
          </p>
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
