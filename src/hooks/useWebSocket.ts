import { useEffect, useState, useCallback } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type MessagePayload = {
  id: string;
  thread_id: string;
  thread_type: string;
  sender_id: string;
  sender_type: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type TypingPayload = {
  thread_id: string;
  user_id: string;
  is_typing: boolean;
};

export const useMessagingWebSocket = (threadId: string | null, threadType: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState<MessagePayload | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!threadId || !threadType) return;

    const channelName = `thread:${threadType}:${threadId}`;

    const realtimeChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          setNewMessage(payload.new as MessagePayload);
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        const data = payload.payload as TypingPayload;
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          if (data.is_typing) {
            updated.add(data.user_id);
          } else {
            updated.delete(data.user_id);
          }
          return updated;
        });
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
      setChannel(null);
      setIsConnected(false);
    };
  }, [threadId, threadType]);

  const sendTypingIndicator = useCallback(
    (userId: string, isTyping: boolean) => {
      if (!channel || !threadId) return;

      channel.send({
        type: "broadcast",
        event: "typing",
        payload: {
          thread_id: threadId,
          user_id: userId,
          is_typing: isTyping,
        },
      });
    },
    [channel, threadId]
  );

  return {
    isConnected,
    newMessage,
    typingUsers: Array.from(typingUsers),
    sendTypingIndicator,
  };
};
