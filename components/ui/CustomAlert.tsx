import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertConfig {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  singleButton?: boolean; // If true, acts like alert() (no cancel)
}

interface CustomAlertProps {
  config: AlertConfig;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ config, onClose }) => {
  if (!config.isOpen) return null;

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    onClose();
  };

  const getIcon = () => {
    switch (config.type) {
      case 'success': return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      default: return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (config.type) {
      case 'success': return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200';
      case 'error': return 'bg-red-600 hover:bg-red-700 focus:ring-red-200';
      case 'warning': return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-200';
      default: return 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-slate-50 rounded-full">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {config.title}
          </h3>
          
          <div className="text-slate-600 mb-8 leading-relaxed text-sm">
            {config.message}
          </div>

          <div className="flex gap-3 w-full">
            {!config.singleButton && (
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                {config.cancelText || 'Cancel'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-4 ${getButtonColor()}`}
            >
              {config.confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;