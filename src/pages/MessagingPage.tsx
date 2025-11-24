import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "patient" | "provider";
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Array<{ name: string; url: string; type: string }>;
  calendarLink?: string; // New field for calendar link
};

type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantImage: string;
  participantType: "patient" | "provider";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  providerPlan?: "free" | "pro" | "premium";
};

export const MessagingPage = () => {
  const [userType] = useState<"patient" | "provider">("patient"); // This would come from auth context
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCalendarLinkOption, setShowCalendarLinkOption] = useState(false); // New state for calendar link option
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock data - would come from API
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      participantId: "p1",
      participantName: "Dr. Sarah Johnson",
      participantImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      participantType: "provider",
      lastMessage: "I'd be happy to schedule a consultation with you.",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 2,
      providerPlan: "premium",
    },
    {
      id: "2",
      participantId: "p2",
      participantName: "Jessica Martinez, NP",
      participantImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
      participantType: "provider",
      lastMessage: "Thank you for your interest in our services.",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      providerPlan: "pro",
    },
    {
      id: "3",
      participantId: "p3",
      participantName: "Emily Chen",
      participantImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      participantType: "provider",
      lastMessage: "Please upgrade to Pro to message me directly.",
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 0,
      providerPlan: "free",
    },
  ]);

  const [messages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        senderId: "p1",
        senderName: "Dr. Sarah Johnson",
        senderType: "provider",
        content: "Hello! Thank you for reaching out. How can I help you today?",
        timestamp: new Date(Date.now() - 7200000),
        read: true,
      },
      {
        id: "m2",
        senderId: "patient1",
        senderName: "You",
        senderType: "patient",
        content: "Hi Dr. Johnson! I'm interested in learning more about Botox treatments. What's the process like?",
        timestamp: new Date(Date.now() - 5400000),
        read: true,
      },
      {
        id: "m3",
        senderId: "p1",
        senderName: "Dr. Sarah Johnson",
        senderType: "provider",
        content: "Great question! Botox is a quick, minimally invasive treatment. The procedure typically takes 10-15 minutes. I'd be happy to schedule a consultation with you.",
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
    ],
    "2": [
      {
        id: "m4",
        senderId: "patient1",
        senderName: "You",
        senderType: "patient",
        content: "Hello, I'd like to know more about your dermal filler services.",
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: "m5",
        senderId: "p2",
        senderName: "Jessica Martinez, NP",
        senderType: "provider",
        content: "Thank you for your interest in our services. Please note that I can only respond to 3 messages per conversation on my current plan. For unlimited messaging, please book a consultation.",
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: "m6",
        senderId: "p2",
        senderName: "Jessica Martinez, NP",
        senderType: "provider",
        content: "You can book a consultation directly through my calendar here:",
        calendarLink: "https://calendly.com/jessica-martinez-np/consultation",
        timestamp: new Date(Date.now() - 86400000 + 10000),
        read: true,
      },
    ],
    "3": [],
  });

  const getProviderPlanFeatures = (plan: "free" | "pro" | "premium") => {
    const features = {
      free: {
        canMessage: false,
        messageLimit: 0,
        responseTime: "N/A",
        attachments: false,
        videoCall: false,
        prioritySupport: false,
        canSendCalendarLink: false, // Free plan cannot send calendar links
      },
      pro: {
        canMessage: true,
        messageLimit: 3,
        responseTime: "24-48 hours",
        attachments: false,
        videoCall: false,
        prioritySupport: false,
        canSendCalendarLink: true, // Pro plan can send calendar links
      },
      premium: {
        canMessage: true,
        messageLimit: Infinity,
        responseTime: "Within 12 hours",
        attachments: true,
        videoCall: true,
        prioritySupport: true,
        canSendCalendarLink: true, // Premium plan can send calendar links
      },
    };
    return features[plan];
  };

  const handleSendCalendarLink = () => {
    const conversation = conversations.find((c) => c.id === selectedConversation);
    if (!conversation) return;

    const features = getProviderPlanFeatures(conversation.providerPlan || "free");

    if (!features.canSendCalendarLink) {
      alert("Your current plan does not allow sending calendar links.");
      return;
    }

    // Mock sending a calendar link message
    const newCalendarMessage: Message = {
      id: Math.random().toString(),
      senderId: userType === "patient" ? "patient1" : conversation.participantId,
      senderName: userType === "patient" ? "You" : conversation.participantName,
      senderType: userType,
      content: "Here is a direct link to my calendar to book a consultation:",
      calendarLink: "https://calendly.com/your-provider-calendar/consultation", // Replace with actual provider's calendar link
      timestamp: new Date(),
      read: false,
    };

    // In a real app, you'd update the messages state and send via WebSocket
    // For this mock, we'll just alert
    alert("Calendar link sent: " + newCalendarMessage.calendarLink);
    setShowCalendarLinkOption(false);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const conversation = conversations.find((c) => c.id === selectedConversation);
    if (!conversation) return;

    const features = getProviderPlanFeatures(conversation.providerPlan || "free");

    // Check if provider is on free plan
    if (!features.canMessage) {
      setShowUpgradeModal(true);
      return;
    }

    // Check message limit for pro plan
    const conversationMessages = messages[selectedConversation!] || [];
    const patientMessages = conversationMessages.filter((m) => m.senderType === "patient");
    
    if (conversation.providerPlan === "pro" && patientMessages.length >= features.messageLimit) {
      setShowUpgradeModal(true);
      return;
    }

    // Send message logic here
    setMessageText("");
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  // Simulate typing indicator
  useEffect(() => {
    if (messageText) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [messageText]);

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowAttachmentMenu(false);
    }
  };

  const handleArchiveConversation = (conversationId: string) => {
    // Archive logic here
    alert("Conversation archived");
  };

  const handleBlockUser = (conversationId: string) => {
    if (confirm("Are you sure you want to block this user?")) {
      // Block logic here
      alert("User blocked");
    }
  };

  const handleReportUser = (conversationId: string) => {
    // Report logic here
    alert("Report submitted");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E8E8E4]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Messages</h2>
                  <button className="text-gray-600 hover:text-gray-900">
                    <span className="text-xl">⚙️</span>
                  </button>
                </div>
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
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-600">No conversations found</p>
                  </div>
                ) : (
                  <>
                    {filteredConversations.map((conversation) => {
                      const features = getProviderPlanFeatures(conversation.providerPlan || "free");
                      
                      return (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedConversation === conversation.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <img
                                src={conversation.participantImage}
                                alt={conversation.participantName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {conversation.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                  {conversation.unreadCount}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate">{conversation.participantName}</h3>
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                              
                              {/* Plan Badge */}
                              <div className="mt-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    conversation.providerPlan === "premium"
                                      ? "bg-purple-100 text-purple-800"
                                      : conversation.providerPlan === "pro"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {conversation.providerPlan === "premium"
                                    ? "✓ Unlimited Messaging"
                                    : conversation.providerPlan === "pro"
                                    ? `${features.messageLimit} messages available`
                                    : "Messaging unavailable"}
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

            {/* Message Thread */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            conversations.find((c) => c.id === selectedConversation)?.participantImage
                          }
                          alt="Provider"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {conversations.find((c) => c.id === selectedConversation)?.participantName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {isTyping ? (
                            <span className="text-blue-600">Typing...</span>
                          ) : (
                            (() => {
                              const conv = conversations.find((c) => c.id === selectedConversation);
                              const features = getProviderPlanFeatures(conv?.providerPlan || "free");
                              return `Responds ${features.responseTime}`;
                            })()
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const conv = conversations.find((c) => c.id === selectedConversation);
                        const features = getProviderPlanFeatures(conv?.providerPlan || "free");
                        return features.videoCall && (
                          <button 
                            onClick={() => setShowVideoCall(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Start video call"
                          >
                            <span className="text-xl">📹</span>
                          </button>
                        );
                      })()}
                      <div className="relative">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <span className="text-xl">⋮</span>
                        </button>
                        <div className="hidden absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-10">
                          <button 
                            onClick={() => handleArchiveConversation(selectedConversation!)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                          >
                            📦 Archive Conversation
                          </button>
                          <button 
                            onClick={() => handleBlockUser(selectedConversation!)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-600"
                          >
                            🚫 Block User
                          </button>
                          <button 
                            onClick={() => handleReportUser(selectedConversation!)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-600"
                          >
                            ⚠️ Report User
                          </button>
                        </div>
                      </div>
                      <Link
                        to={`/provider/${conversations.find((c) => c.id === selectedConversation)?.participantId}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(messages[selectedConversation] || []).map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === "patient" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="group relative">
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderType === "patient"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm mb-1">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white bg-opacity-20 rounded p-2">
                                  <span className="text-xs">📎</span>
                                  <span className="text-xs">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {message.calendarLink && (
                            <div className="mt-2">
                              <a
                                href={message.calendarLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
                              >
                                📅 Book on Calendar
                              </a>
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <p
                              className={`text-xs ${
                                message.senderType === "patient" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                            {message.senderType === "patient" && (
                              <span className="text-xs">
                                {message.read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Message Actions (on hover) */}
                        <div className="absolute top-0 -right-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded" title="Reply">
                            ↩️
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />

                  {/* Empty State */}
                  {(!messages[selectedConversation] || messages[selectedConversation].length === 0) && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-bold mb-2">Start a conversation</h3>
                      <p className="text-gray-600">
                        {(() => {
                          const conv = conversations.find((c) => c.id === selectedConversation);
                          const features = getProviderPlanFeatures(conv?.providerPlan || "free");
                          
                          if (!features.canMessage) {
                            return "This provider is on a Free plan and cannot receive messages. Please book a consultation instead.";
                          }
                          
                          return "Send a message to get started";
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  {(() => {
                    const conv = conversations.find((c) => c.id === selectedConversation);
                    const features = getProviderPlanFeatures(conv?.providerPlan || "free");
                    const conversationMessages = messages[selectedConversation] || [];
                    const patientMessages = conversationMessages.filter((m) => m.senderType === "patient");

                    // Show upgrade prompt for free plan
                    if (!features.canMessage) {
                      return (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-yellow-800 mb-3">
                            <strong>{conv?.participantName}</strong> is on a Free plan and cannot receive direct messages.
                          </p>
                          <Link
                            to={`/provider/${conv?.participantId}`}
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                          >
                            Book Consultation Instead
                          </Link>
                        </div>
                      );
                    }

                    // Show message limit warning for pro plan
                    if (conv?.providerPlan === "pro" && patientMessages.length >= features.messageLimit - 1) {
                      return (
                        <div className="space-y-3">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                            <p className="text-sm text-orange-800">
                              {patientMessages.length >= features.messageLimit
                                ? `You've reached the ${features.messageLimit} message limit for Pro plan providers.`
                                : `You have 1 message remaining with this provider.`}
                            </p>
                          </div>
                          {patientMessages.length < features.messageLimit && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleSendMessage}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                              >
                                Send
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Normal message input for premium
                    return (
                      <div className="space-y-3">
                        {/* Selected File Preview */}
                        {selectedFile && (
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📎</span>
                              <span className="text-sm">{selectedFile.name}</span>
                            </div>
                            <button 
                              onClick={() => setSelectedFile(null)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {features.attachments && (
                            <div className="relative">
                              <button 
                                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                className="p-3 hover:bg-gray-100 rounded-lg"
                                title="Attach file"
                              >
                                <span className="text-xl">📎</span>
                              </button>
                              
                              {showAttachmentMenu && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-10">
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                                  >
                                    📄 Upload Document
                                  </button>
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                                  >
                                    🖼️ Upload Image
                                  </button>
                                </div>
                              )}
                              
                              <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                              />
                            </div>
                          )}
                          
                          {userType === "provider" && features.canSendCalendarLink && (
                            <div className="relative">
                              <button 
                                onClick={() => setShowCalendarLinkOption(!showCalendarLinkOption)}
                                className="p-3 hover:bg-gray-100 rounded-lg"
                                title="Send calendar link"
                              >
                                <span className="text-xl">📅</span>
                              </button>
                              {showCalendarLinkOption && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-10">
                                  <button 
                                    onClick={handleSendCalendarLink}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                                  >
                                    🔗 Insert Calendar Link
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <button className="p-3 hover:bg-gray-100 rounded-lg" title="Emoji">
                            <span className="text-xl">😊</span>
                          </button>
                          
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          
                          <button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() && !selectedFile}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a provider from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Video Call</h3>
              <button 
                onClick={() => setShowVideoCall(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-xl mb-2">Video Call Interface</p>
                <p className="text-sm text-gray-400">This would integrate with a video call service like Twilio, Agora, or Daily.co</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700">
                <span className="text-xl">🔇</span>
              </button>
              <button className="p-4 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                <span className="text-xl">📹</span>
              </button>
              <button 
                onClick={() => setShowVideoCall(false)}
                className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <span className="text-xl">📞</span>
              </button>
              <button className="p-4 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                <span className="text-xl">💬</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-2">Message Limit Reached</h3>
              <p className="text-gray-600">
                This provider's plan has messaging limitations. To continue the conversation, please book a consultation.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to={`/provider/${conversations.find((c) => c.id === selectedConversation)?.participantId}`}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                onClick={() => setShowUpgradeModal(false)}
              >
                Book Consultation
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
