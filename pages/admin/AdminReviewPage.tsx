import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Check, X, FileText, User, Tag } from "lucide-react";
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

  const handleApprove = async (material: any) => {
    try {
      if (!material.fileUrl) {
        alert("⚠️ This material has no uploaded file link. Please reject or re-upload it.");
        return;
      }
      setLoading(true);

      await addDoc(collection(db, "materials"), {
        title: material.title || "Untitled Material",
        description: material.description || "",
        uploader: material.uploader || "Anonymous",
        course: material.course || "Uncategorized",
        link: material.fileUrl,
        createdAt: new Date(),
      });

      await deleteDoc(doc(db, "pendingMaterials", material.id));

      alert("✅ Material approved successfully!");
      setSelectedMaterial(null);
    } catch (error) {
      console.error("Error approving material:", error);
      alert("❌ Failed to approve material.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (material: any) => {
    const confirmDelete = window.confirm("Are you sure you want to reject this material?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "pendingMaterials", material.id));
      alert("Material rejected");
      setSelectedMaterial(null);
    } catch (error) {
      console.error("Error rejecting material:", error);
      alert("Failed to reject material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-4">Pending Submissions</h2>
        <p className="text-center text-gray-500 mb-12">Review materials submitted by users</p>

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
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{material.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-brand-primary" />
                    <span>{material.course}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-brand-primary" />
                    <span>{material.uploader}</span>
                  </div>
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
        title="Review Material"
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
                    <span className="text-xs font-bold text-gray-400 uppercase">Course</span>
                    <p className="font-medium text-brand-primary">{selectedMaterial.course}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Uploader</span>
                    <p className="font-medium text-gray-900">{selectedMaterial.uploader}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                    <p className="font-medium text-gray-900">{selectedMaterial.email || 'N/A'}</p>
                  </div>
               </div>
            </div>

            <div className="h-[400px] border border-gray-200 rounded-xl overflow-hidden bg-gray-100">
              {selectedMaterial.fileUrl && selectedMaterial.fileUrl.endsWith(".pdf") ? (
                <iframe
                  src={selectedMaterial.fileUrl}
                  title="Material Preview"
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FileText size={48} className="mb-4 opacity-50" />
                  <p>Preview not available for this file type.</p>
                  <a href={selectedMaterial.fileUrl} target="_blank" rel="noreferrer" className="text-brand-primary underline mt-2">Download to view</a>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleApprove(selectedMaterial)}
                disabled={loading}
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} /> Approve
              </button>
              <button 
                onClick={() => handleReject(selectedMaterial)}
                disabled={loading}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} /> Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReviewPage;