import { Link } from "react-router-dom";
import { PractitionerSearchResult } from "../services/searchService";
import {
  formatLocation,
  formatExperience,
  getBadgeIcon,
  getBadgeLabel,
  formatTrustScore,
  getTrustScoreColor,
  getVerificationBadgeColor,
} from "../utils/searchUtils";

interface SearchResultCardProps {
  practitioner: PractitionerSearchResult;
  onClickTracking?: (practitionerId: string) => void;
}

export const SearchResultCard = ({
  practitioner,
  onClickTracking,
}: SearchResultCardProps) => {
  const handleClick = () => {
    if (onClickTracking) {
      onClickTracking(practitioner.id);
    }
  };

  return (
    <Link
      to={`/provider/${practitioner.id}`}
      onClick={handleClick}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
    >
      <div className="flex gap-4">
        <img
          src={
            practitioner.avatar_url ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
          }
          alt={practitioner.legal_name}
          className="w-24 h-24 rounded-lg object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {practitioner.legal_name}
              </h3>
              <p className="text-sm text-gray-600">{practitioner.professional_title}</p>
            </div>

            {practitioner.trust_score > 0 && (
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${getTrustScoreColor(
                    practitioner.trust_score
                  )}`}
                >
                  {formatTrustScore(practitioner.trust_score)}
                </div>
                <p className="text-xs text-gray-500">Trust Score</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getVerificationBadgeColor(
                practitioner.verification_status
              )}`}
            >
              {practitioner.verification_status === "verified" ? "✓ Verified" : "Unverified"}
            </span>

            {practitioner.years_experience > 0 && (
              <span className="text-xs text-gray-600">
                {formatExperience(practitioner.years_experience)} experience
              </span>
            )}

            {practitioner.accepts_new_patients && (
              <span className="text-xs text-green-600 font-medium">
                Accepting New Patients
              </span>
            )}
          </div>

          {practitioner.specialties && practitioner.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {practitioner.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty.id}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                >
                  {specialty.name}
                </span>
              ))}
              {practitioner.specialties.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{practitioner.specialties.length - 3} more
                </span>
              )}
            </div>
          )}

          {practitioner.badges && practitioner.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {practitioner.badges.map((badge, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1"
                  title={getBadgeLabel(badge.type)}
                >
                  <span>{getBadgeIcon(badge.type)}</span>
                  <span>{getBadgeLabel(badge.type)}</span>
                </span>
              ))}
            </div>
          )}

          {practitioner.bio && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {practitioner.bio}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              📍 {formatLocation(practitioner.practice_city, practitioner.practice_state)}
            </span>

            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Profile →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
