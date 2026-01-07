import { SearchFilters } from "../services/searchService";

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export const EXPERIENCE_OPTIONS = [
  { value: 0, label: "Any experience" },
  { value: 1, label: "1+ years" },
  { value: 3, label: "3+ years" },
  { value: 5, label: "5+ years" },
  { value: 10, label: "10+ years" },
  { value: 15, label: "15+ years" },
];

export const buildSearchQuery = (filters: SearchFilters): string => {
  const params = new URLSearchParams();

  if (filters.query) params.append("q", filters.query);
  if (filters.city) params.append("city", filters.city);
  if (filters.state) params.append("state", filters.state);
  if (filters.minYearsExperience) params.append("exp", filters.minYearsExperience.toString());
  if (filters.acceptsNewPatients) params.append("accepting", "true");
  if (filters.specialties && filters.specialties.length > 0) {
    filters.specialties.forEach(s => params.append("specialty", s));
  }

  return params.toString();
};

export const parseSearchQuery = (search: string): SearchFilters => {
  const params = new URLSearchParams(search);

  return {
    query: params.get("q") || undefined,
    city: params.get("city") || undefined,
    state: params.get("state") || undefined,
    minYearsExperience: params.get("exp") ? parseInt(params.get("exp")!) : undefined,
    acceptsNewPatients: params.get("accepting") === "true" || undefined,
    specialties: params.getAll("specialty"),
  };
};

export const formatLocation = (city?: string, state?: string): string => {
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return "Location not specified";
};

export const formatExperience = (years: number): string => {
  if (years === 0) return "Less than 1 year";
  if (years === 1) return "1 year";
  return `${years} years`;
};

export const getPractitionerTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    md: "Medical Doctor (MD)",
    do: "Doctor of Osteopathic Medicine (DO)",
    np: "Nurse Practitioner (NP)",
    pa: "Physician Assistant (PA)",
    rn: "Registered Nurse (RN)",
    aesthetician: "Aesthetician",
    laser_tech: "Laser Technician",
    other: "Other Professional",
  };
  return labels[type] || type;
};

export const getBadgeLabel = (badgeType: string): string => {
  const labels: Record<string, string> = {
    verified_identity: "Verified Identity",
    verified_practice: "Verified Practice",
    continuity_of_care: "Continuity of Care",
    established_practitioner: "Established Practitioner",
  };
  return labels[badgeType] || badgeType;
};

export const getBadgeIcon = (badgeType: string): string => {
  const icons: Record<string, string> = {
    verified_identity: "✓",
    verified_practice: "🏢",
    continuity_of_care: "💙",
    established_practitioner: "⭐",
  };
  return icons[badgeType] || "✓";
};

export const getSubscriptionPlanLabel = (plan: string): string => {
  const labels: Record<string, string> = {
    free: "Free",
    professional: "Professional",
    premium: "Premium",
  };
  return labels[plan] || plan;
};

export const formatTrustScore = (score: number): string => {
  return Math.round(score).toString();
};

export const getTrustScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-gray-600";
};

export const getVerificationBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    verified: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    unverified: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
    needs_review: "bg-orange-100 text-orange-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
