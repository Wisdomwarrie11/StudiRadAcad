import React from 'react';
import Modal from '../ui/Modal';
import { Download, ExternalLink, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface MaterialReaderModalProps {
  show: boolean;
  onHide: () => void;
  material: any;
}

const MaterialReaderModal: React.FC<MaterialReaderModalProps> = ({ show, onHide, material }) => {
  if (!material) return null;

  const isPDF = material.link?.toLowerCase().endsWith('.pdf');
  const isImage = material.link?.match(/\.(jpeg|jpg|gif|png)$/i);
  
  // Google Drive Viewer/Preview logic
  // If it's not PDF/Image, we try to embed it or show link
  // If it's a google drive view link, convert to preview
  const embedLink = material.link.includes('drive.google.com') && material.link.includes('/view')
    ? material.link.replace('/view', '/preview')
    : material.link;

  return (
    <Modal isOpen={show} onClose={onHide} title={material.title} size="xl">
      <div className="flex flex-col h-full min-h-[70vh]">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light p-4 rounded-xl border border-brand-primary/10">
          <div>
            <p className="text-sm text-gray-500">Uploaded by <span className="font-semibold text-brand-dark">{material.uploader}</span></p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded">{material.course}</span>
            </div>
          </div>
          <a 
            href={material.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors text-sm font-medium shadow-sm"
          >
            <Download size={16} /> Download / Open Original
          </a>
        </div>

        <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
          {isPDF ? (
            <iframe
              src={material.link}
              className="w-full h-[700px]"
              title="PDF Viewer"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full bg-gray-900 overflow-auto">
               <img src={material.link} alt={material.title} className="max-w-full max-h-[700px] object-contain p-4" />
            </div>
          ) : (
            // Fallback for Docs/Slides/Drive Links
            <iframe
              src={embedLink}
              className="w-full h-[700px]"
              title="Document Viewer"
              onError={(e) => {
                 // Fallback if iframe fails (e.g. X-Frame-Options)
                 console.log("Iframe load error", e);
              }}
            />
          )}
          
          {/* Overlay hint for users if content doesn't load */}
          {!isPDF && !isImage && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-500 shadow-sm border border-gray-200 flex items-center gap-2 pointer-events-none">
                <AlertCircle size={12} /> If the document doesn't load, use the Download button above.
             </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MaterialReaderModal;