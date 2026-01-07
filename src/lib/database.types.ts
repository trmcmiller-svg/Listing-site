export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'patient' | 'practitioner' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'needs_review';
export type PractitionerType = 'md' | 'do' | 'np' | 'pa' | 'rn' | 'aesthetician' | 'laser_tech' | 'other';
export type SubscriptionPlan = 'free' | 'professional' | 'premium';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
export type ConsultStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';
export type ThreadStatus = 'active' | 'archived' | 'blocked';
export type TrustEventType =
  | 'profile_view'
  | 'follow_provider'
  | 'save_provider'
  | 'consult_request_sent'
  | 'consult_accepted'
  | 'consult_completed'
  | 'message_thread_active'
  | 'followup_marked_complete'
  | 'report_submitted';
export type BadgeType = 'verified_identity' | 'verified_practice' | 'continuity_of_care' | 'established_practitioner';
export type NiccyboxModuleType = 'identity' | 'information' | 'collection' | 'your_why' | 'connection';
export type ReportType = 'spam' | 'inappropriate' | 'harassment' | 'fraud' | 'other';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      practitioners: {
        Row: {
          id: string;
          user_id: string;
          legal_name: string;
          professional_title: string;
          practitioner_type: PractitionerType;
          bio: string | null;
          years_experience: number | null;
          accepts_new_patients: boolean;
          professional_email: string | null;
          professional_phone: string | null;
          website_url: string | null;
          verification_status: VerificationStatus;
          verified_at: string | null;
          trust_score: number;
          search_vector: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          legal_name: string;
          professional_title: string;
          practitioner_type: PractitionerType;
          bio?: string | null;
          years_experience?: number | null;
          accepts_new_patients?: boolean;
          professional_email?: string | null;
          professional_phone?: string | null;
          website_url?: string | null;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          trust_score?: number;
          search_vector?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          legal_name?: string;
          professional_title?: string;
          practitioner_type?: PractitionerType;
          bio?: string | null;
          years_experience?: number | null;
          accepts_new_patients?: boolean;
          professional_email?: string | null;
          professional_phone?: string | null;
          website_url?: string | null;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          trust_score?: number;
          search_vector?: unknown;
          created_at?: string;
          updated_at?: string;
        };
      };
      practitioner_licenses: {
        Row: {
          id: string;
          practitioner_id: string;
          license_type: string;
          license_number: string;
          issuing_state: string;
          issue_date: string | null;
          expiration_date: string | null;
          is_active: boolean;
          document_url: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          license_type: string;
          license_number: string;
          issuing_state: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          is_active?: boolean;
          document_url?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          license_type?: string;
          license_number?: string;
          issuing_state?: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          is_active?: boolean;
          document_url?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      practitioner_specialties: {
        Row: {
          id: string;
          practitioner_id: string;
          specialty_id: string;
          years_experience: number | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          specialty_id: string;
          years_experience?: number | null;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          specialty_id?: string;
          years_experience?: number | null;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      trust_events: {
        Row: {
          id: string;
          event_type: TrustEventType;
          patient_id_hash: string;
          practitioner_id: string;
          event_weight: number;
          metadata: Json;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: TrustEventType;
          patient_id_hash: string;
          practitioner_id: string;
          event_weight?: number;
          metadata?: Json;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: TrustEventType;
          patient_id_hash?: string;
          practitioner_id?: string;
          event_weight?: number;
          metadata?: Json;
          source?: string;
          created_at?: string;
        };
      };
      trust_badges: {
        Row: {
          id: string;
          practitioner_id: string;
          badge_type: BadgeType;
          is_active: boolean;
          earned_at: string | null;
          revoked_at: string | null;
          last_computed_at: string;
          computation_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          badge_type: BadgeType;
          is_active?: boolean;
          earned_at?: string | null;
          revoked_at?: string | null;
          last_computed_at?: string;
          computation_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          badge_type?: BadgeType;
          is_active?: boolean;
          earned_at?: string | null;
          revoked_at?: string | null;
          last_computed_at?: string;
          computation_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      niccybox_modules: {
        Row: {
          id: string;
          practitioner_id: string;
          module_type: NiccyboxModuleType;
          module_data: Json;
          display_order: number;
          is_visible: boolean;
          is_approved: boolean;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          module_type: NiccyboxModuleType;
          module_data?: Json;
          display_order?: number;
          is_visible?: boolean;
          is_approved?: boolean;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          module_type?: NiccyboxModuleType;
          module_data?: Json;
          display_order?: number;
          is_visible?: boolean;
          is_approved?: boolean;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consult_requests: {
        Row: {
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
        };
        Insert: {
          id?: string;
          patient_id: string;
          practitioner_id: string;
          treatment_interest?: string | null;
          message: string;
          patient_notes?: string | null;
          status?: ConsultStatus;
          response_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          practitioner_id?: string;
          treatment_interest?: string | null;
          message?: string;
          patient_notes?: string | null;
          status?: ConsultStatus;
          response_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          thread_type: 'consult' | 'direct';
          sender_id: string;
          sender_type: 'patient' | 'practitioner';
          content: string;
          is_read: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          thread_type: 'consult' | 'direct';
          sender_id: string;
          sender_type: 'patient' | 'practitioner';
          content: string;
          is_read?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          thread_type?: 'consult' | 'direct';
          sender_id?: string;
          sender_type?: 'patient' | 'practitioner';
          content?: string;
          is_read?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          practitioner_id: string;
          plan_type: SubscriptionPlan;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          plan_type?: SubscriptionPlan;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          plan_type?: SubscriptionPlan;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      verification_queue: {
        Row: {
          id: string;
          practitioner_id: string;
          status: VerificationStatus;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id: string;
          status?: VerificationStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string;
          status?: VerificationStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      practitioner_type: PractitionerType;
      subscription_plan: SubscriptionPlan;
      subscription_status: SubscriptionStatus;
      consult_status: ConsultStatus;
      thread_status: ThreadStatus;
      trust_event_type: TrustEventType;
      badge_type: BadgeType;
      niccybox_module_type: NiccyboxModuleType;
      report_type: ReportType;
      report_status: ReportStatus;
    };
  };
}
