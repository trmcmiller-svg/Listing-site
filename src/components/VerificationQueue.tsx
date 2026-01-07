import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface QueueItem {
  id: string;
  practitioner_id: string;
  status: string;
  submitted_at: string;
  practitioner: {
    legal_name: string;
    professional_title: string;
    practitioner_type: string;
    years_experience: number;
    bio: string;
    education: string[];
  };
  licenses: Array<{
    license_number: string;
    issuing_state: string;
    expiration_date: string;
    document_url: string;
  }>;
}

export function VerificationQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);

    const { data: queueData, error: queueError } = await supabase
      .from("verification_queue")
      .select(`
        *,
        practitioner:practitioner_id (
          legal_name,
          professional_title,
          practitioner_type,
          years_experience,
          bio,
          education
        )
      `)
      .in("status", ["pending", "needs_review"])
      .order("submitted_at", { ascending: true });

    if (queueError) {
      console.error("Error loading queue:", queueError);
      setLoading(false);
      return;
    }

    const enrichedQueue = await Promise.all(
      (queueData || []).map(async (item) => {
        const { data: licenses } = await supabase
          .from("practitioner_licenses")
          .select("*")
          .eq("practitioner_id", item.practitioner_id);

        return {
          ...item,
          licenses: licenses || [],
        };
      })
    );

    setQueue(enrichedQueue as any);
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedItem) return;

    setActionLoading(true);

    try {
      const { error } = await supabase.rpc("update_verification_status", {
        p_practitioner_id: selectedItem.practitioner_id,
        p_new_status: "verified",
        p_admin_notes: actionNotes || "Approved - all credentials verified",
      });

      if (error) throw error;

      setSelectedItem(null);
      setActionNotes("");
      loadQueue();
    } catch (error: any) {
      alert("Error approving: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedItem || !actionNotes) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);

    try {
      const { error } = await supabase.rpc("update_verification_status", {
        p_practitioner_id: selectedItem.practitioner_id,
        p_new_status: "rejected",
        p_admin_notes: actionNotes,
      });

      if (error) throw error;

      setSelectedItem(null);
      setActionNotes("");
      loadQueue();
    } catch (error: any) {
      alert("Error rejecting: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleNeedsReview = async () => {
    if (!selectedItem || !actionNotes) {
      alert("Please provide details about what needs review");
      return;
    }

    setActionLoading(true);

    try {
      const { error } = await supabase.rpc("update_verification_status", {
        p_practitioner_id: selectedItem.practitioner_id,
        p_new_status: "needs_review",
        p_admin_notes: actionNotes,
      });

      if (error) throw error;

      setSelectedItem(null);
      setActionNotes("");
      loadQueue();
    } catch (error: any) {
      alert("Error updating: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
        <p className="text-gray-600">No pending verifications at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Verification Queue</h2>
          <p className="text-gray-600">{queue.length} pending application{queue.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={loadQueue}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Queue List */}
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedItem?.id === item.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold">{item.practitioner?.legal_name}</h3>
                  <p className="text-sm text-gray-600">{item.practitioner?.professional_title}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>Type: {item.practitioner?.practitioner_type}</p>
                <p>Experience: {item.practitioner?.years_experience} years</p>
                <p>Submitted: {new Date(item.submitted_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail View */}
        <div className="border border-gray-200 rounded-lg p-6 sticky top-6">
          {selectedItem ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">{selectedItem.practitioner?.legal_name}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Professional Title</label>
                    <p className="text-gray-900">{selectedItem.practitioner?.professional_title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Practitioner Type</label>
                    <p className="text-gray-900">{selectedItem.practitioner?.practitioner_type}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                    <p className="text-gray-900">{selectedItem.practitioner?.years_experience}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                    <p className="text-gray-900 text-sm">{selectedItem.practitioner?.bio}</p>
                  </div>

                  {selectedItem.practitioner?.education && selectedItem.practitioner.education.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
                      <ul className="list-disc list-inside text-sm text-gray-900">
                        {selectedItem.practitioner.education.map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.licenses && selectedItem.licenses.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Licenses</label>
                      {selectedItem.licenses.map((license, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-sm"><strong>License #:</strong> {license.license_number}</p>
                          <p className="text-sm"><strong>State:</strong> {license.issuing_state}</p>
                          <p className="text-sm"><strong>Expires:</strong> {new Date(license.expiration_date).toLocaleDateString()}</p>
                          {license.document_url && (
                            <a
                              href={license.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                            >
                              View Document →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about this application..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400"
                >
                  {actionLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={handleNeedsReview}
                  disabled={actionLoading}
                  className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-yellow-400"
                >
                  Needs Review
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>Select an application to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}