import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Check, X, FileText, User, Tag, Video, Link as LinkIcon, ExternalLink, Mail } from "lucide-react";
import Modal from "../../components/ui/Modal";

const AdminReviewPage = () => {
  const [pendingMaterials, setPendingMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pendingMaterials"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingMaterials(data);
    });
    return () => unsub();
  }, []);

  // Helper to open mail client
  const openEmailDraft = (to: string, subject: string, body: string) => {
    if (!to) return;
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // window.open helps avoid navigating away from the admin panel
    window.open(mailtoLink, '_blank');
  };

  const handleApprove = async (material: any) => {
    try {
      // Compatibility with old submissions that might use 'fileUrl'
      const link = material.link || material.fileUrl;
      
      if (!link) {
        alert("⚠️ This material has no link/file. Please reject.");
        return;
      }
      setLoading(true);

      const commonData = {
        title: material.title || "Untitled",
        description: material.description || "",
        uploader: material.uploader || "Anonymous",
        course: material.course || "Uncategorized",
        link: link,
        createdAt: new Date(),
      };

      if (material.type === "video") {
        // Add to videos collection
        await addDoc(collection(db, "videos"), {
          ...commonData,
          thumbnailUrl: material.thumbnailUrl || "",
        });
      } else {
        // Add to materials collection (Handles 'file' and 'link')
        await addDoc(collection(db, "materials"), {
          ...commonData,
          type: material.type || 'file', // Default to file if undefined
        });
      }

      await deleteDoc(doc(db, "pendingMaterials", material.id));

      alert(`✅ ${material.type === 'video' ? 'Video' : 'Material'} approved successfully! An email draft will open to notify the user.`);
      
      // Open Email Draft for Approval
      openEmailDraft(
        material.email,
        "Your StudiRad Submission is Live!",
        `Hi ${material.uploader},\n\nThe material '${material.title}' you posted has been approved and is now live on StudiRad.\n\nThank you for contributing!`
      );

      setSelectedMaterial(null);
    } catch (error) {
      console.error("Error approving material:", error);
      alert("❌ Failed to approve material.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (material: any) => {
    const confirmDelete = window.confirm("Are you sure you want to reject this item?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      
      // Prepare Email Body
      const type = material.type || 'material';
      const rejectionBody = `We are sorry, our review team went through your ${type} and noticed that it doesnt align with our rules. The materials must be clear and relates to the topic and course it is posted under. It must not be more than 10mb. The links must not contain improper contents and contents that do not relate the topic or course. The links must not be suspicious. The videos should be that of the person posting it. We dont not accept third-party videos. The videos must not contain improper contents and must align with the topic and course being posted under.`;
      
      await deleteDoc(doc(db, "pendingMaterials", material.id));
      alert("Item rejected. An email draft will open to notify the user.");
      
      // Open Email Draft for Rejection
      openEmailDraft(
        material.email,
        "Update on your StudiRad Submission",
        rejectionBody
      );

      setSelectedMaterial(null);
    } catch (error) {
      console.error("Error rejecting material:", error);
      alert("Failed to reject material.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
        case 'video': return <Video size={16} className="text-red-500" />;
        case 'link': return <LinkIcon size={16} className="text-blue-500" />;
        default: return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-4">Pending Submissions</h2>
        <p className="text-center text-gray-500 mb-12">Review materials and videos submitted by users</p>

        {pendingMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendingMaterials.map((material) => (
              <div 
                key={material.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-t-4 border-brand-accent p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        {getTypeIcon(material.type)}
                        <span>{material.type || 'file'}</span>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2">{material.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-brand-primary" />
                    <span>{material.course}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-brand-primary" />
                    <span>{material.uploader}</span>
                  </div>
                  {material.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail size={12} />
                        <span className="truncate">{material.email}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMaterial(material)}
                  className="mt-auto w-full py-2 bg-gray-50 hover:bg-brand-primary hover:text-white text-brand-dark font-semibold rounded-lg transition-colors border border-gray-100"
                >
                  Review Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title="Review Item"
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Title</span>
                    <p className="font-medium text-gray-900">{selectedMaterial.title}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Type</span>
                    <p className="font-medium capitalize">{selectedMaterial.type || 'File'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Uploader</span>
                    <p className="font-medium text-gray-900">{selectedMaterial.uploader}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Course</span>
                    <p className="font-medium text-brand-primary">{selectedMaterial.course}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Link/URL</span>
                    <p className="font-medium text-blue-600 truncate">{selectedMaterial.link || selectedMaterial.fileUrl}</p>
                  </div>
                  {selectedMaterial.email && (
                     <div className="col-span-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                        <p className="font-medium text-gray-700">{selectedMaterial.email}</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="h-[400px] border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
              {(selectedMaterial.link || selectedMaterial.fileUrl) ? (
                 selectedMaterial.type === 'video' ? (
                     <div className="text-center">
                        {selectedMaterial.thumbnailUrl && <img src={selectedMaterial.thumbnailUrl} alt="Thumbnail" className="h-48 object-cover rounded mb-4 mx-auto" />}
                        <a href={selectedMaterial.link || selectedMaterial.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
                             <Video size={20} /> Open Video Link
                        </a>
                     </div>
                 ) : (selectedMaterial.link || selectedMaterial.fileUrl).endsWith(".pdf") ? (
                    <iframe
                    src={selectedMaterial.link || selectedMaterial.fileUrl}
                    title="Material Preview"
                    className="w-full h-full"
                    ></iframe>
                ) : (
                    <div className="text-center">
                        <ExternalLink size={48} className="mb-4 text-gray-400 mx-auto" />
                        <p className="mb-4 text-gray-600">External Link or Non-Previewable File</p>
                        <a href={selectedMaterial.link || selectedMaterial.fileUrl} target="_blank" rel="noreferrer" className="text-brand-primary underline font-bold">Open Link</a>
                    </div>
                )
              ) : (
                 <p className="text-red-500">No Link Provided</p>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleApprove(selectedMaterial)}
                disabled={loading}
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} /> Approve & Notify
              </button>
              <button 
                onClick={() => handleReject(selectedMaterial)}
                disabled={loading}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} /> Reject & Notify
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReviewPage;