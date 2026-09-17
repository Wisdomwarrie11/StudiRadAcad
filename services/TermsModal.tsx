import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  accepted?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  accepted = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Oxford Blue */}
        <div className="bg-[#002147] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <h3 className="text-xl font-bold text-white">
            Terms and Conditions
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Guidelines for StudiRad research assistance.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#002147]" />
              1. Exclusively for Radiographers & Imaging Students
            </h4>
            <p className="text-gray-600">
              This service is only for students, trainees, and practicing professionals in Radiography and Medical Imaging.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#002147]" />
              2. Scope of Help
            </h4>
            <p className="text-gray-600 mb-1.5">
              We provide professional support with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Topic and Planning:</strong> Helping you choose a viable research topic and organize your chapters.</li>
              <li><strong>Editing and Proofreading:</strong> Correcting grammar, improving flow, and checking your references.</li>
              <li><strong>Data Analysis:</strong> Running statistics in SPSS or Excel, creating charts, and helping interpret results.</li>
            </ul>
            <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Please note: StudiRad assists and guides you. We do not write entire projects from scratch on your behalf.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#002147]" />
              3. Privacy and Confidentiality
            </h4>
            <p className="text-gray-600">
              Your research drafts, patient information, and survey data are kept strictly confidential and will never be shared or used elsewhere.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#002147]" />
              4. WhatsApp Contact
            </h4>
            <p className="text-gray-600">
              Submitting the form connects you directly to our team on WhatsApp, where you can discuss your project timelines and pricing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2 bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold rounded-lg transition-colors"
            >
              {accepted ? 'Agreed' : 'I Agree to Terms'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
