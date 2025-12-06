import React, { useState, useEffect } from 'react';
import { X, Coins, Check, ShieldCheck, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { addCoins } from '../../services/challengeService';
import CustomAlert, { AlertConfig } from '../../components/ui/CustomAlert';

interface CoinPackage {
  id: string;
  coins: number;
  price: number; // in Naira
  label?: string;
  popular?: boolean;
}

const PACKAGES: CoinPackage[] = [
  { id: 'starter', coins: 1, price: 100, label: 'Starter' },
  { id: 'basic', coins: 5, price: 450, label: 'Standard (10% Off)' },
  { id: 'pro', coins: 10, price: 850, label: 'Pro (15% Off)', popular: true },
  { id: 'elite', coins: 20, price: 1600, label: 'Elite (20% Off)' },
  { id: 'master', coins: 50, price: 3500, label: 'Master (30% Off)' },
];

// REPLACE WITH YOUR ACTUAL PAYSTACK PUBLIC KEY
const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY_HERE';

interface CoinPurchaseModalProps {
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CoinPurchaseModal: React.FC<CoinPurchaseModalProps> = ({ userEmail, onClose, onSuccess }) => {
  const [selectedPkg, setSelectedPkg] = useState<CoinPackage>(PACKAGES[2]);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [longProcess, setLongProcess] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    singleButton: true
  });

  const showAlert = (config: Partial<AlertConfig>) => {
    setAlertConfig({
        isOpen: true,
        title: config.title || 'Notification',
        message: config.message || '',
        type: config.type || 'info',
        singleButton: true,
        confirmText: 'OK',
        onConfirm: config.onConfirm,
    });
  };

  // Safe mounted check
  const mountedRef = React.useRef(true);
  useEffect(() => {
      mountedRef.current = true;
      return () => { mountedRef.current = false; };
  }, []);

  // Monitor processing time to offer a way out if it gets stuck
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (processing) {
        setLongProcess(false);
        timer = setTimeout(() => setLongProcess(true), 8000); // 8 seconds threshold
    } else {
        setLongProcess(false);
    }
    return () => clearTimeout(timer);
  }, [processing]);

  const handleManualReset = () => {
      setProcessing(false);
      setProcessingMessage("");
      setLongProcess(false);
  };

  const handlePayment = () => {
    setProcessing(true);
    setProcessingMessage("Initializing Gateway...");

    const paystack = (window as any).PaystackPop;
    
    if (!paystack) {
        showAlert({ title: "Connection Error", message: "Paystack failed to load. Please check your internet connection.", type: 'error' });
        setProcessing(false);
        return;
    }

    try {
        const handler = paystack.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: selectedPkg.price * 100, // Paystack expects amount in Kobo
        currency: 'NGN',
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a random ref
        metadata: {
            custom_fields: [
            {
                display_name: "Coins",
                variable_name: "coins",
                value: selectedPkg.coins.toString()
            }
            ]
        },
        callback: function(response: any) {
            // Payment successful at Paystack level
            setProcessingMessage("Confirming Transaction...");
            
            // Define async logic inside synchronous callback to satisfy Paystack type check
            const processTransaction = async () => {
                try {
                    // Wrap DB update in a race with a timeout to prevent infinite spinning
                    await Promise.race([
                        addCoins(userEmail, selectedPkg.coins),
                        new Promise((_, reject) => setTimeout(() => reject(new Error("Verification Timeout")), 15000))
                    ]);
                    
                    if (mountedRef.current) {
                        onSuccess();
                        onClose();
                    }
                } catch (error) {
                    console.error("Failed to add coins after payment", error);
                    // Important: User actually paid, but DB update failed/timed out.
                    showAlert({ 
                        title: "Payment Successful", 
                        message: `However, we couldn't automatically update your coin balance due to a connection issue. \n\nTransaction Ref: ${response.reference} \n\nPlease contact support with this reference code.`,
                        type: 'warning',
                        onConfirm: onClose
                    });
                } finally {
                    if (mountedRef.current) setProcessing(false);
                }
            };

            processTransaction();
        },
        onClose: function() {
            if (mountedRef.current) {
                setProcessing(false);
                setProcessingMessage("");
            }
        }
        });

        handler.openIframe();
    } catch (err) {
        console.error("Paystack Init Error", err);
        setProcessing(false);
        showAlert({ title: "Initialization Error", message: "Could not initialize payment gateway. Please try again.", type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <CustomAlert config={alertConfig} onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))} />
      
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-400" />
              Top Up Grey Coins
            </h2>
            <p className="text-slate-400 text-sm mt-1">Unlock quizzes and switch levels faster.</p>
          </div>
          <button onClick={onClose} disabled={processing} className="p-2 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow relative">
          
          {processing && (
              <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center text-center p-6">
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{processingMessage || "Processing..."}</h3>
                    <p className="text-slate-500 text-sm">Please complete the payment in the popup window.</p>
                    
                    {longProcess && (
                        <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-xs text-amber-600 mb-2 font-medium flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Taking longer than usual?
                            </p>
                            <button 
                                onClick={handleManualReset}
                                className="text-xs text-slate-400 underline hover:text-slate-600"
                            >
                                Reset Form (if popup didn't open)
                            </button>
                        </div>
                    )}
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPkg.id === pkg.id;
              return (
                <div 
                  key={pkg.id}
                  onClick={() => !processing && setSelectedPkg(pkg)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between
                    ${isSelected ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-200 hover:border-amber-200 bg-white'}
                    ${processing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold text-lg ${isSelected ? 'text-amber-900' : 'text-slate-700'}`}>
                      {pkg.coins} Coins
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-amber-600" />}
                  </div>
                  
                  <div className="text-sm text-slate-500 mb-4">{pkg.label}</div>
                  
                  <div className="flex justify-between items-end mt-auto">
                    <div className="text-xs text-slate-400">
                       {Math.round(pkg.price / pkg.coins)}₦ / coin
                    </div>
                    <div className={`font-black text-xl ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      ₦{pkg.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>
              Payments are securely processed by Paystack. Coins are added to your wallet immediately after a successful transaction.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-slate-500">Total to pay:</span>
            <div className="text-2xl font-black text-slate-900">₦{selectedPkg.price.toLocaleString()}</div>
          </div>
          <button 
            onClick={handlePayment}
            disabled={processing}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center min-w-[140px] justify-center"
          >
            {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : "Pay Now"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CoinPurchaseModal;