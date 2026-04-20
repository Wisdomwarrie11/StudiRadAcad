import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  singleButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface Props {
  config: AlertConfig;
  onClose: () => void;
}

const CustomAlert: React.FC<Props> = ({ config, onClose }) => {
  if (!config.isOpen) return null;

  const getIcon = () => {
    switch (config.type) {
      case 'success': return <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />;
      case 'error': return <XCircle className="w-12 h-12 text-red-500 mb-4" />;
      case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />;
      default: return <Info className="w-12 h-12 text-blue-500 mb-4" />;
    }
  };

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-[scaleIn_0.2s_ease-out]">
        <div className="flex justify-center">{getIcon()}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{config.title}</h3>
        <p className="text-slate-600 mb-6">{config.message}</p>
        
        <div className="flex gap-3 justify-center">
          {!config.singleButton && (
            <button 
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              {config.cancelText || 'Cancel'}
            </button>
          )}
          <button 
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl text-white font-bold transition-colors
              ${config.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                config.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                config.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                'bg-slate-900 hover:bg-slate-800'
              }
            `}
          >
            {config.confirmText || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;