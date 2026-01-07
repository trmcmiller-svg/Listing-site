import { useState, useEffect } from "react";
import { getBadgesForPractitioner, getBadgeInfo, Badge } from "../utils/trustEngine";

interface TrustBadgesProps {
  practitionerId: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TrustBadges({ practitionerId, showLabels = false, size = "md" }: TrustBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [practitionerId]);

  const loadBadges = async () => {
    setLoading(true);
    const data = await getBadgesForPractitioner(practitionerId);
    setBadges(data);
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (badges.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div className={`flex ${showLabels ? "flex-wrap gap-2" : "flex-wrap gap-1"}`}>
      {badges.map((badge) => {
        const info = getBadgeInfo(badge.badge_type);
        const colorClasses = {
          blue: "bg-blue-100 text-blue-800 border-blue-300",
          green: "bg-green-100 text-green-800 border-green-300",
          purple: "bg-purple-100 text-purple-800 border-purple-300",
          yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };

        if (showLabels) {
          return (
            <div
              key={badge.badge_type}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                colorClasses[info.color as keyof typeof colorClasses]
              }`}
              title={info.description}
            >
              <span className="text-lg">{info.icon}</span>
              <span className="text-sm font-semibold">{info.name}</span>
            </div>
          );
        }

        return (
          <div
            key={badge.badge_type}
            className={`flex items-center justify-center rounded-full border-2 ${sizeClasses[size]} ${
              colorClasses[info.color as keyof typeof colorClasses]
            }`}
            title={`${info.name}: ${info.description}`}
          >
            <span>{info.icon}</span>
          </div>
        );
      })}
    </div>
  );
}

interface TrustScoreProps {
  practitionerId: string;
  showLabel?: boolean;
}

export function TrustScore({ practitionerId, showLabel = true }: TrustScoreProps) {
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, [practitionerId]);

  const loadScore = async () => {
    setLoading(true);
    const { getTrustScore } = await import("../utils/trustEngine");
    const scoreValue = await getTrustScore(practitionerId);
    setScore(scoreValue);
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 500) return "text-blue-600";
    if (score >= 200) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return "Excellent";
    if (score >= 500) return "Very Good";
    if (score >= 200) return "Good";
    return "Building Trust";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {Math.round(score)}
        </span>
        <span className="text-sm text-gray-500">/1000</span>
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}

interface BadgeDetailModalProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeDetailModal({ badge, onClose }: BadgeDetailModalProps) {
  const info = getBadgeInfo(badge.badge_type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{info.icon}</div>
            <div>
              <h3 className="text-xl font-bold">{info.name}</h3>
              <p className="text-sm text-gray-600">Trust Badge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What this badge means</h4>
            <p className="text-gray-700">{info.description}</p>
          </div>

          {badge.earned_at && (
            <div>
              <h4 className="font-semibold mb-2">Earned</h4>
              <p className="text-gray-700">
                {new Date(badge.earned_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {badge.computation_metadata?.criteria && (
            <div>
              <h4 className="font-semibold mb-2">Criteria</h4>
              <p className="text-sm text-gray-600">{badge.computation_metadata.criteria}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}