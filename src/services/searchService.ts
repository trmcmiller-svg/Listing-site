import { supabase } from "../lib/supabase";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "needs_review";
export type SubscriptionPlan = "free" | "professional" | "premium";

export interface SearchFilters {
  query?: string;
  specialties?: string[];
  city?: string;
  state?: string;
  verificationStatus?: VerificationStatus;
  minYearsExperience?: number;
  acceptsNewPatients?: boolean;
  limit?: number;
  offset?: number;
}

export interface PractitionerSearchResult {
  id: string;
  user_id: string;
  legal_name: string;
  professional_title: string;
  practitioner_type: string;
  bio: string;
  years_experience: number;
  accepts_new_patients: boolean;
  verification_status: VerificationStatus;
  trust_score: number;
  avatar_url: string;
  practice_city: string;
  practice_state: string;
  specialties: Array<{
    id: string;
    name: string;
    category: string;
    years_experience: number;
  }>;
  badges: Array<{
    type: string;
    is_active: boolean;
    earned_at: string;
  }>;
  subscription_plan: SubscriptionPlan;
  relevance_score: number;
}

export interface TrendingSearch {
  query: string;
  search_count: number;
  avg_results: number;
}

export interface PopularPractitioner {
  practitioner_id: string;
  click_count: number;
  legal_name: string;
  professional_title: string;
  trust_score: number;
}

export const searchService = {
  async searchPractitioners(
    filters: SearchFilters = {}
  ): Promise<{ results: PractitionerSearchResult[]; total?: number }> {
    const {
      query = null,
      specialties = null,
      city = null,
      state = null,
      verificationStatus = null,
      minYearsExperience = null,
      acceptsNewPatients = null,
      limit = 20,
      offset = 0,
    } = filters;

    const { data, error } = await supabase.rpc("search_practitioners", {
      p_query: query,
      p_specialties: specialties,
      p_city: city,
      p_state: state,
      p_verification_status: verificationStatus,
      p_min_years_experience: minYearsExperience,
      p_accepts_new_patients: acceptsNewPatients,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error("Search error:", error);
      return { results: [] };
    }

    return {
      results: (data || []) as PractitionerSearchResult[],
      total: data?.length || 0,
    };
  },

  async trackSearch(
    query: string,
    filters: Omit<SearchFilters, "query">,
    resultsCount: number,
    userId?: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("search_analytics")
      .insert({
        query,
        user_id: userId || null,
        filters: filters as any,
        results_count: resultsCount,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Track search error:", error);
      return null;
    }

    return data?.id || null;
  },

  async trackPractitionerClick(
    searchAnalyticsId: string,
    practitionerId: string
  ): Promise<void> {
    await supabase
      .from("search_analytics")
      .update({ clicked_practitioner_id: practitionerId })
      .eq("id", searchAnalyticsId);
  },

  async getTrendingSearches(
    days: number = 7,
    limit: number = 10
  ): Promise<TrendingSearch[]> {
    const { data, error } = await supabase.rpc("get_trending_searches", {
      p_days: days,
      p_limit: limit,
    });

    if (error) {
      console.error("Get trending searches error:", error);
      return [];
    }

    return (data || []) as TrendingSearch[];
  },

  async getPopularPractitioners(
    days: number = 30,
    limit: number = 10
  ): Promise<PopularPractitioner[]> {
    const { data, error } = await supabase.rpc("get_popular_practitioners", {
      p_days: days,
      p_limit: limit,
    });

    if (error) {
      console.error("Get popular practitioners error:", error);
      return [];
    }

    return (data || []) as PopularPractitioner[];
  },

  async getAllSpecialties(): Promise<
    Array<{ id: string; name: string; category: string }>
  > {
    const { data, error } = await supabase
      .from("specialties")
      .select("id, name, category")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Get specialties error:", error);
      return [];
    }

    return data || [];
  },

  async getFeaturedPractitioners(limit: number = 6): Promise<PractitionerSearchResult[]> {
    const { data, error } = await supabase.rpc("search_practitioners", {
      p_query: null,
      p_specialties: null,
      p_city: null,
      p_state: null,
      p_verification_status: "verified",
      p_min_years_experience: null,
      p_accepts_new_patients: true,
      p_limit: limit,
      p_offset: 0,
    });

    if (error) {
      console.error("Get featured practitioners error:", error);
      return [];
    }

    return (data || []) as PractitionerSearchResult[];
  },

  async getPractitionersBySpecialty(
    specialtyId: string,
    limit: number = 10
  ): Promise<PractitionerSearchResult[]> {
    const { data, error } = await supabase.rpc("search_practitioners", {
      p_query: null,
      p_specialties: [specialtyId],
      p_city: null,
      p_state: null,
      p_verification_status: "verified",
      p_min_years_experience: null,
      p_accepts_new_patients: true,
      p_limit: limit,
      p_offset: 0,
    });

    if (error) {
      console.error("Get practitioners by specialty error:", error);
      return [];
    }

    return (data || []) as PractitionerSearchResult[];
  },
};
