
import React from 'react';
import Modal from '../ui/Modal';
import { ExternalLink } from 'lucide-react';

interface MaterialReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: any;
}

const MaterialReaderModal: React.FC<MaterialReaderModalProps> = ({ isOpen, onClose, material }) => {
  if (!material) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{material.title}</h2>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{material.course}</span>
          <span>•</span>
          <span>By {material.uploader}</span>
        </div>
        
        <div className="prose max-w-none mb-8">
          <p className="text-slate-600 font-medium leading-relaxed">
            {material.description || 'This resource was shared by a community member to help others in their radiography journey.'}
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={material.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
          >
            Open Full Document <ExternalLink size={18} />
          </a>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MaterialReaderModal;
