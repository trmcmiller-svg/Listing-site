import { supabase } from "../lib/supabase";

export type ConsultStatus = "pending" | "accepted" | "declined" | "cancelled" | "completed";

export interface ConsultRequest {
  id: string;
  patient_id: string;
  practitioner_id: string;
  treatment_interest: string | null;
  message: string;
  patient_notes: string | null;
  status: ConsultStatus;
  response_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultRequestWithDetails extends ConsultRequest {
  patient_name: string;
  patient_avatar: string;
  practitioner_name: string;
  practitioner_avatar: string;
}

export const consultRequestService = {
  async createConsultRequest(
    patientId: string,
    practitionerId: string,
    message: string,
    treatmentInterest?: string,
    patientNotes?: string
  ): Promise<{ success: boolean; request?: ConsultRequest; error?: string }> {
    const { data, error } = await supabase
      .from("consult_requests")
      .insert({
        patient_id: patientId,
        practitioner_id: practitionerId,
        treatment_interest: treatmentInterest,
        message,
        patient_notes: patientNotes,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create consult request error:", error);
      return {
        success: false,
        error: "Failed to create consult request",
      };
    }

    return {
      success: true,
      request: data as ConsultRequest,
    };
  },

  async getConsultRequestsForPractitioner(
    practitionerId: string,
    status?: ConsultStatus
  ): Promise<ConsultRequestWithDetails[]> {
    let query = supabase
      .from("consult_requests")
      .select(
        `
        *,
        profiles!consult_requests_patient_id_fkey (
          full_name,
          avatar_url
        )
      `
      )
      .eq("practitioner_id", practitionerId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Get consult requests error:", error);
      return [];
    }

    return (data || []).map((req: any) => ({
      ...req,
      patient_name: req.profiles?.full_name || "Patient",
      patient_avatar: req.profiles?.avatar_url || "",
      practitioner_name: "",
      practitioner_avatar: "",
    }));
  },

  async getConsultRequestsForPatient(
    patientId: string,
    status?: ConsultStatus
  ): Promise<ConsultRequestWithDetails[]> {
    let query = supabase
      .from("consult_requests")
      .select(
        `
        *,
        practitioners!inner (
          legal_name,
          user_id,
          profiles!inner (
            full_name,
            avatar_url
          )
        )
      `
      )
      .eq("patient_id", patientId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Get consult requests error:", error);
      return [];
    }

    return (data || []).map((req: any) => ({
      ...req,
      patient_name: "",
      patient_avatar: "",
      practitioner_name:
        req.practitioners.profiles.full_name || req.practitioners.legal_name,
      practitioner_avatar: req.practitioners.profiles.avatar_url || "",
    }));
  },

  async acceptConsultRequest(
    requestId: string,
    responseMessage?: string
  ): Promise<{ success: boolean; threadId?: string; error?: string }> {
    const { data: request, error: fetchError } = await supabase
      .from("consult_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return {
        success: false,
        error: "Consult request not found",
      };
    }

    const { error: updateError } = await supabase
      .from("consult_requests")
      .update({
        status: "accepted",
        response_message: responseMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Accept consult error:", updateError);
      return {
        success: false,
        error: "Failed to accept consult request",
      };
    }

    const { data: thread, error: threadError } = await supabase
      .from("consult_threads")
      .insert({
        consult_request_id: requestId,
        patient_id: request.patient_id,
        practitioner_id: request.practitioner_id,
        status: "active",
      })
      .select()
      .single();

    if (threadError) {
      console.error("Create thread error:", threadError);
      return {
        success: false,
        error: "Failed to create message thread",
      };
    }

    const { data: practitioner } = await supabase
      .from("practitioners")
      .select("user_id")
      .eq("id", request.practitioner_id)
      .single();

    if (responseMessage && practitioner) {
      await supabase.from("messages").insert({
        thread_id: thread.id,
        thread_type: "consult",
        sender_id: practitioner.user_id,
        sender_type: "practitioner",
        content: responseMessage,
      });
    }

    return {
      success: true,
      threadId: thread.id,
    };
  },

  async declineConsultRequest(
    requestId: string,
    responseMessage?: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from("consult_requests")
      .update({
        status: "declined",
        response_message: responseMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      console.error("Decline consult error:", error);
      return {
        success: false,
        error: "Failed to decline consult request",
      };
    }

    return { success: true };
  },

  async cancelConsultRequest(
    requestId: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from("consult_requests")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      console.error("Cancel consult error:", error);
      return {
        success: false,
        error: "Failed to cancel consult request",
      };
    }

    return { success: true };
  },

  async completeConsult(
    threadId: string
  ): Promise<{ success: boolean; error?: string }> {
    const { data: thread, error: fetchError } = await supabase
      .from("consult_threads")
      .select("consult_request_id")
      .eq("id", threadId)
      .single();

    if (fetchError || !thread) {
      return {
        success: false,
        error: "Thread not found",
      };
    }

    const { error: updateError } = await supabase
      .from("consult_requests")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", thread.consult_request_id);

    if (updateError) {
      console.error("Complete consult error:", updateError);
      return {
        success: false,
        error: "Failed to complete consult",
      };
    }

    await supabase
      .from("consult_threads")
      .update({ status: "archived" })
      .eq("id", threadId);

    return { success: true };
  },

  async getConsultRequest(
    requestId: string
  ): Promise<ConsultRequestWithDetails | null> {
    const { data, error } = await supabase
      .from("consult_requests")
      .select(
        `
        *,
        profiles!consult_requests_patient_id_fkey (
          full_name,
          avatar_url
        ),
        practitioners!inner (
          legal_name,
          user_id,
          profiles!inner (
            full_name,
            avatar_url
          )
        )
      `
      )
      .eq("id", requestId)
      .single();

    if (error || !data) {
      console.error("Get consult request error:", error);
      return null;
    }

    return {
      ...data,
      patient_name: data.profiles?.full_name || "Patient",
      patient_avatar: data.profiles?.avatar_url || "",
      practitioner_name:
        data.practitioners.profiles.full_name || data.practitioners.legal_name,
      practitioner_avatar: data.practitioners.profiles.avatar_url || "",
    };
  },

  async createDirectThread(
    patientId: string,
    practitionerId: string
  ): Promise<{ success: boolean; threadId?: string; error?: string }> {
    const { data: existingThread } = await supabase
      .from("direct_threads")
      .select("id")
      .eq("patient_id", patientId)
      .eq("practitioner_id", practitionerId)
      .single();

    if (existingThread) {
      return {
        success: true,
        threadId: existingThread.id,
      };
    }

    const { data, error } = await supabase
      .from("direct_threads")
      .insert({
        patient_id: patientId,
        practitioner_id: practitionerId,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Create direct thread error:", error);
      return {
        success: false,
        error: "Failed to create direct thread",
      };
    }

    return {
      success: true,
      threadId: data.id,
    };
  },
};
