import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { messagingService, Thread, SubscriptionPlan } from "../services/messagingService";

interface ThreadListProps {
  userId: string;
  userRole: "patient" | "practitioner";
  selectedThreadId: string | null;
  onSelectThread: (thread: Thread) => void;
}

export const ThreadList = ({
  userId,
  userRole,
  selectedThreadId,
  onSelectThread,
}: ThreadListProps) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, [userId, userRole]);

  const loadThreads = async () => {
    setLoading(true);
    const data = await messagingService.getThreads(userId, userRole);
    setThreads(data);
    setLoading(false);
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    const badges = {
      free: {
        text: "Messaging unavailable",
        className: "bg-gray-100 text-gray-800",
      },
      professional: {
        text: "3 messages available",
        className: "bg-blue-100 text-blue-800",
      },
      premium: {
        text: "Unlimited Messaging",
        className: "bg-green-100 text-green-800",
      },
    };

    return badges[plan];
  };

  const filteredThreads = threads.filter((thread) =>
    thread.participant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-gray-600">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <>
            {filteredThreads.map((thread) => {
              const badge = thread.practitioner_plan
                ? getPlanBadge(thread.practitioner_plan)
                : null;

              return (
                <div
                  key={thread.id}
                  onClick={() => onSelectThread(thread)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedThreadId === thread.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={
                          thread.participant_avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        }
                        alt={thread.participant_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {thread.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {thread.unread_count}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {thread.participant_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(thread.last_message_time), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {thread.last_message || "No messages yet"}
                      </p>

                      {badge && userRole === "patient" && (
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${badge.className}`}
                          >
                            {badge.text}
                          </span>
                        </div>
                      )}

                      <div className="mt-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {thread.type === "consult" ? "Consult" : "Direct Message"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
