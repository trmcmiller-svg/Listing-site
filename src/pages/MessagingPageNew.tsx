import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ThreadList } from "../components/ThreadList";
import { MessageThread } from "../components/MessageThread";
import { Thread, SenderType } from "../services/messagingService";
import { supabase } from "../lib/supabase";

export const MessagingPageNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [userRole, setUserRole] = useState<"patient" | "practitioner">("patient");
  const [practitionerId, setPractitionerId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    loadUserRole();
  }, [user]);

  const loadUserRole = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "practitioner") {
      setUserRole("practitioner");

      const { data: practitioner } = await supabase
        .from("practitioners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (practitioner) {
        setPractitionerId(practitioner.id);
      }
    }
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleArchive = async (threadId: string, threadType: "consult" | "direct") => {
    const confirmed = confirm("Are you sure you want to archive this conversation?");
    if (!confirmed) return;

    const table = threadType === "consult" ? "consult_threads" : "direct_threads";
    await supabase.from(table).update({ status: "archived" }).eq("id", threadId);

    setSelectedThread(null);
    window.location.reload();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
          <div className="flex h-full">
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <ThreadList
                userId={user.id}
                userRole={userRole}
                selectedThreadId={selectedThread?.id || null}
                onSelectThread={handleSelectThread}
              />
            </div>

            {selectedThread ? (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          selectedThread.participant_avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        }
                        alt={selectedThread.participant_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{selectedThread.participant_name}</h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {selectedThread.type === "consult" ? "Consultation" : "Direct Message"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {userRole === "patient" && (
                        <Link
                          to={`/provider/${selectedThread.participant_id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Profile
                        </Link>
                      )}
                      <button
                        onClick={() => handleArchive(selectedThread.id, selectedThread.type)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Archive conversation"
                      >
                        <span className="text-xl">📦</span>
                      </button>
                    </div>
                  </div>
                </div>

                <MessageThread
                  threadId={selectedThread.id}
                  threadType={selectedThread.type}
                  currentUserId={user.id}
                  currentUserType={userRole as SenderType}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
                  <p className="text-gray-600">
                    Choose a {userRole === "patient" ? "provider" : "patient"} from the list to start
                    messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
