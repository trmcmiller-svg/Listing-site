import { supabase } from "../lib/supabase";

export type SubscriptionPlan = "free" | "professional" | "premium";
export type ThreadType = "consult" | "direct";
export type SenderType = "patient" | "practitioner";

export interface RateLimitCheck {
  allowed: boolean;
  reason?: string;
  current_count: number;
  limit: number;
  remaining?: number;
  plan: SubscriptionPlan;
}

export interface Thread {
  id: string;
  type: ThreadType;
  participant_id: string;
  participant_name: string;
  participant_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  practitioner_plan?: SubscriptionPlan;
}

export interface Message {
  id: string;
  thread_id: string;
  thread_type: ThreadType;
  sender_id: string;
  sender_type: SenderType;
  content: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const messagingService = {
  async checkRateLimit(
    senderId: string,
    threadId: string,
    threadType: ThreadType
  ): Promise<RateLimitCheck> {
    const { data, error } = await supabase.rpc("check_message_rate_limit", {
      p_sender_id: senderId,
      p_thread_id: threadId,
      p_thread_type: threadType,
    });

    if (error) {
      console.error("Rate limit check error:", error);
      return {
        allowed: false,
        reason: "Error checking rate limit",
        current_count: 0,
        limit: 0,
        plan: "free",
      };
    }

    return data as RateLimitCheck;
  },

  async sendMessage(
    threadId: string,
    threadType: ThreadType,
    senderId: string,
    senderType: SenderType,
    content: string,
    metadata: any = {}
  ): Promise<{ success: boolean; message?: Message; error?: string }> {
    const rateLimitCheck = await this.checkRateLimit(
      senderId,
      threadId,
      threadType
    );

    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: rateLimitCheck.reason,
      };
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        thread_id: threadId,
        thread_type: threadType,
        sender_id: senderId,
        sender_type: senderType,
        content,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error("Send message error:", error);
      return {
        success: false,
        error: "Failed to send message",
      };
    }

    if (threadType === "direct") {
      await supabase
        .from("direct_threads")
        .update({
          message_count_by_patient:
            senderType === "patient"
              ? supabase.rpc("increment", { row_id: threadId })
              : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", threadId);
    }

    return {
      success: true,
      message: data as Message,
    };
  },

  async getThreads(
    userId: string,
    userRole: "patient" | "practitioner"
  ): Promise<Thread[]> {
    if (userRole === "patient") {
      const { data: consultThreads } = await supabase
        .from("consult_threads")
        .select(
          `
          id,
          practitioner_id,
          created_at,
          practitioners!inner (
            user_id,
            legal_name,
            subscriptions (
              plan_type
            ),
            profiles!inner (
              full_name,
              avatar_url
            )
          )
        `
        )
        .eq("patient_id", userId)
        .eq("status", "active");

      const { data: directThreads } = await supabase
        .from("direct_threads")
        .select(
          `
          id,
          practitioner_id,
          created_at,
          practitioners!inner (
            user_id,
            legal_name,
            subscriptions (
              plan_type
            ),
            profiles!inner (
              full_name,
              avatar_url
            )
          )
        `
        )
        .eq("patient_id", userId)
        .eq("status", "active");

      const threads: Thread[] = [];

      if (consultThreads) {
        for (const thread of consultThreads) {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("thread_id", thread.id)
            .eq("thread_type", "consult")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .eq("thread_type", "consult")
            .eq("is_read", false)
            .neq("sender_id", userId);

          threads.push({
            id: thread.id,
            type: "consult",
            participant_id: thread.practitioner_id,
            participant_name:
              thread.practitioners.profiles.full_name ||
              thread.practitioners.legal_name,
            participant_avatar: thread.practitioners.profiles.avatar_url || "",
            last_message: lastMsg?.content || "",
            last_message_time: lastMsg?.created_at || thread.created_at,
            unread_count: count || 0,
            practitioner_plan:
              (thread.practitioners.subscriptions?.[0]
                ?.plan_type as SubscriptionPlan) || "free",
          });
        }
      }

      if (directThreads) {
        for (const thread of directThreads) {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("thread_id", thread.id)
            .eq("thread_type", "direct")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .eq("thread_type", "direct")
            .eq("is_read", false)
            .neq("sender_id", userId);

          threads.push({
            id: thread.id,
            type: "direct",
            participant_id: thread.practitioner_id,
            participant_name:
              thread.practitioners.profiles.full_name ||
              thread.practitioners.legal_name,
            participant_avatar: thread.practitioners.profiles.avatar_url || "",
            last_message: lastMsg?.content || "",
            last_message_time: lastMsg?.created_at || thread.created_at,
            unread_count: count || 0,
            practitioner_plan:
              (thread.practitioners.subscriptions?.[0]
                ?.plan_type as SubscriptionPlan) || "free",
          });
        }
      }

      return threads.sort(
        (a, b) =>
          new Date(b.last_message_time).getTime() -
          new Date(a.last_message_time).getTime()
      );
    } else {
      const { data: practitioner } = await supabase
        .from("practitioners")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!practitioner) return [];

      const { data: consultThreads } = await supabase
        .from("consult_threads")
        .select(
          `
          id,
          patient_id,
          created_at,
          profiles!inner (
            full_name,
            avatar_url
          )
        `
        )
        .eq("practitioner_id", practitioner.id)
        .eq("status", "active");

      const { data: directThreads } = await supabase
        .from("direct_threads")
        .select(
          `
          id,
          patient_id,
          created_at,
          profiles!inner (
            full_name,
            avatar_url
          )
        `
        )
        .eq("practitioner_id", practitioner.id)
        .eq("status", "active");

      const threads: Thread[] = [];

      if (consultThreads) {
        for (const thread of consultThreads) {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("thread_id", thread.id)
            .eq("thread_type", "consult")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .eq("thread_type", "consult")
            .eq("is_read", false)
            .neq("sender_id", userId);

          threads.push({
            id: thread.id,
            type: "consult",
            participant_id: thread.patient_id,
            participant_name: thread.profiles.full_name || "Patient",
            participant_avatar: thread.profiles.avatar_url || "",
            last_message: lastMsg?.content || "",
            last_message_time: lastMsg?.created_at || thread.created_at,
            unread_count: count || 0,
          });
        }
      }

      if (directThreads) {
        for (const thread of directThreads) {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("thread_id", thread.id)
            .eq("thread_type", "direct")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .eq("thread_type", "direct")
            .eq("is_read", false)
            .neq("sender_id", userId);

          threads.push({
            id: thread.id,
            type: "direct",
            participant_id: thread.patient_id,
            participant_name: thread.profiles.full_name || "Patient",
            participant_avatar: thread.profiles.avatar_url || "",
            last_message: lastMsg?.content || "",
            last_message_time: lastMsg?.created_at || thread.created_at,
            unread_count: count || 0,
          });
        }
      }

      return threads.sort(
        (a, b) =>
          new Date(b.last_message_time).getTime() -
          new Date(a.last_message_time).getTime()
      );
    }
  },

  async getMessages(
    threadId: string,
    threadType: ThreadType
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .eq("thread_type", threadType)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Get messages error:", error);
      return [];
    }

    return data as Message[];
  },

  async markMessagesAsRead(
    threadId: string,
    threadType: ThreadType,
    userId: string
  ): Promise<void> {
    await supabase.rpc("mark_messages_read", {
      p_thread_id: threadId,
      p_thread_type: threadType,
      p_user_id: userId,
    });
  },

  async archiveThread(threadId: string, threadType: ThreadType): Promise<void> {
    const table = threadType === "consult" ? "consult_threads" : "direct_threads";
    await supabase
      .from(table)
      .update({ status: "archived" })
      .eq("id", threadId);
  },

  async blockThread(threadId: string, threadType: ThreadType): Promise<void> {
    const table = threadType === "consult" ? "consult_threads" : "direct_threads";
    await supabase
      .from(table)
      .update({ status: "blocked" })
      .eq("id", threadId);
  },
};
