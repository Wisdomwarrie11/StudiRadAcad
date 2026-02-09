
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, ArrowUp, ChevronRight } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      return;
    }

    // Improved iOS detection (including iPadOS which identifies as MacIntel)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    setIsIOS(isIOSDevice);

    // Capture install prompt for Chrome/Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show if not standalone
    if (isIOSDevice && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 3000);
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
          className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors z-20 rounded-full hover:bg-white/5"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-brandOrange text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brandOrange/20">
            <Download size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Install Meditin</h4>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium leading-tight">
              {isIOS 
                ? 'Add to home screen for the best mobile experience and offline access.'
                : 'Get fast access to mocks & results directly from your home screen.'}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          {isIOS ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    <Share size={18} />
                  </div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">1. Tap Share</span>
                </div>
                <ChevronRight className="text-white/20" size={16} />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    <PlusSquare size={18} />
                  </div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">2. Add to Home</span>
                </div>
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
          <div className="w-10 h-10 bg-brandOrange rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-brandOrange/20">
             <ArrowUp size={20} />
          </div>
          <p className="text-[8px] font-black text-navy/60 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
             Tap the Share button below
          </p>
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
