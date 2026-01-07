import { supabase } from "../lib/supabase";
import { createHash } from "crypto";

export type TrustEventType =
  | "profile_view"
  | "follow_provider"
  | "save_provider"
  | "consult_request_sent"
  | "consult_accepted"
  | "consult_completed"
  | "message_thread_active"
  | "followup_marked_complete"
  | "report_submitted";

export type BadgeType =
  | "verified_identity"
  | "verified_practice"
  | "continuity_of_care"
  | "established_practitioner";

export interface Badge {
  badge_type: BadgeType;
  is_active: boolean;
  earned_at: string | null;
  computation_metadata: Record<string, any>;
}

function hashPatientId(userId: string): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return btoa(userId);
  }
  return userId;
}

export async function recordTrustEvent(
  eventType: TrustEventType,
  practitionerId: string,
  metadata: Record<string, any> = {}
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn("No authenticated user for trust event");
      return null;
    }

    const patientIdHash = hashPatientId(user.id);

    const { data, error } = await supabase.rpc("record_trust_event", {
      p_event_type: eventType,
      p_patient_id_hash: patientIdHash,
      p_practitioner_id: practitionerId,
      p_metadata: metadata,
    });

    if (error) {
      console.error("Error recording trust event:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in recordTrustEvent:", error);
    return null;
  }
}

export async function getBadgesForPractitioner(
  practitionerId: string
): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from("trust_badges")
      .select("*")
      .eq("practitioner_id", practitionerId)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching badges:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getBadgesForPractitioner:", error);
    return [];
  }
}

export async function computeBadgesForPractitioner(
  practitionerId: string
): Promise<any> {
  try {
    const { data, error } = await supabase.rpc(
      "compute_badges_for_practitioner",
      {
        p_practitioner_id: practitionerId,
      }
    );

    if (error) {
      console.error("Error computing badges:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in computeBadgesForPractitioner:", error);
    return null;
  }
}

export async function getTrustScore(practitionerId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("practitioners")
      .select("trust_score")
      .eq("id", practitionerId)
      .maybeSingle();

    if (error || !data) {
      return 0;
    }

    return Number(data.trust_score) || 0;
  } catch (error) {
    console.error("Error getting trust score:", error);
    return 0;
  }
}

export function getBadgeInfo(badgeType: BadgeType): {
  name: string;
  description: string;
  icon: string;
  color: string;
} {
  const badgeInfo = {
    verified_identity: {
      name: "Verified Identity",
      description: "Identity and credentials have been verified",
      icon: "✓",
      color: "blue",
    },
    verified_practice: {
      name: "Verified Practice",
      description: "Practice location and insurance verified",
      icon: "🏥",
      color: "green",
    },
    continuity_of_care: {
      name: "Continuity of Care",
      description: "Demonstrates consistent patient follow-up",
      icon: "💙",
      color: "purple",
    },
    established_practitioner: {
      name: "Established Practitioner",
      description: "Long-standing member with strong community presence",
      icon: "⭐",
      color: "yellow",
    },
  };

  return badgeInfo[badgeType];
}