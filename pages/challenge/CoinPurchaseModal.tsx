import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Coins, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { addCoins } from '../../services/challengeService';

interface CoinPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSuccess: () => void;
}

const PAYSTACK_PUBLIC_KEY = "pk_live_a35b5eef4a79e10f6f06b9f1a7a56a7424ccfbc6";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const CoinPurchaseModal: React.FC<CoinPurchaseModalProps> = ({ isOpen, onClose, userEmail, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = (amount: number, coins: number) => {
    if (!window.PaystackPop) {
      alert("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: amount * 100, // Paystack takes amount in kobo
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: "Purchase Type",
            variable_name: "purchase_type",
            value: "Daily Challenge Coins"
          },
          {
            display_name: "Coins Amount",
            variable_name: "coins_amount",
            value: coins.toString()
          }
        ]
      },
      callback: async function(response: any) {
        try {
          // In a production app, you'd verify this reference on your server
          // For now, we'll trust the callback and update Firestore
          await addCoins(userEmail, coins);
          onSuccess();
          onClose();
        } catch (error) {
          console.error("Error adding coins after payment", error);
          alert("Payment was successful, but we encountered an error updating your balance. Please contact support with your reference: " + response.reference);
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: function() {
        setIsProcessing(false);
        alert('Transaction cancelled.');
      }
    });

    handler.openIframe();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get More Coins">
      <div className="space-y-6">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins size={32} />
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-2">Refill Your Balance</h4>
          <p className="text-slate-500 text-sm">Coins allow you to unlock past challenges and get hints.</p>
        </div>

        <div className="grid gap-4">
          <button 
            onClick={() => handlePurchase(500, 50)}
            disabled={isProcessing}
            className="w-full p-4 bg-white border-2 border-slate-100 hover:border-amber-500 rounded-2xl flex items-center justify-between group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 rounded-xl flex items-center justify-center transition-colors">
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900">50 Coins</p>
                <p className="text-xs text-slate-400">Basic Pack</p>
              </div>
            </div>
            <span className="font-black text-brand-primary">₦500</span>
          </button>

          <button 
            onClick={() => handlePurchase(1000, 120)}
            disabled={isProcessing}
            className="w-full p-4 bg-white border-2 border-slate-100 hover:border-amber-500 rounded-2xl flex items-center justify-between group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 rounded-xl flex items-center justify-center transition-colors">
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900">120 Coins</p>
                <p className="text-xs text-slate-400">Value Pack</p>
              </div>
            </div>
            <span className="font-black text-brand-primary">₦1,000</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          <ShieldCheck size={12} /> Secure Payment via Paystack
        </div>
      </div>
    </Modal>
  );
};

export default CoinPurchaseModal;
