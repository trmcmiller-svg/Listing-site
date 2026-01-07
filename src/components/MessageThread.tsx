import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { useMessagingWebSocket } from "../hooks/useWebSocket";
import {
  messagingService,
  Message,
  ThreadType,
  SenderType,
} from "../services/messagingService";

interface MessageThreadProps {
  threadId: string;
  threadType: ThreadType;
  currentUserId: string;
  currentUserType: SenderType;
  onClose?: () => void;
}

export const MessageThread = ({
  threadId,
  threadType,
  currentUserId,
  currentUserType,
  onClose,
}: MessageThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { newMessage, sendTypingIndicator, typingUsers } = useMessagingWebSocket(
    threadId,
    threadType
  );

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [threadId, threadType]);

  useEffect(() => {
    if (newMessage && newMessage.thread_id === threadId) {
      setMessages((prev) => [...prev, newMessage as Message]);
      markAsRead();
    }
  }, [newMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const msgs = await messagingService.getMessages(threadId, threadType);
    setMessages(msgs);
    setLoading(false);
  };

  const markAsRead = async () => {
    await messagingService.markMessagesAsRead(threadId, threadType, currentUserId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setError(null);
    const result = await messagingService.sendMessage(
      threadId,
      threadType,
      currentUserId,
      currentUserType,
      messageText.trim()
    );

    if (result.success) {
      setMessageText("");
    } else {
      setError(result.error || "Failed to send message");
    }
  };

  const handleTyping = () => {
    sendTypingIndicator(currentUserId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(currentUserId, false);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Start a conversation</h3>
            <p className="text-gray-600">Send a message to get started</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === currentUserId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm mb-1 whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p
                      className={`text-xs ${
                        message.sender_id === currentUserId
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                    {message.sender_id === currentUserId && (
                      <span className="text-xs">{message.is_read ? "✓✓" : "✓"}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typingUsers.length > 0 &&
              !typingUsers.includes(currentUserId) && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {error && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
