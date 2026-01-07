import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { getPlatformMetrics, type PlatformMetrics } from '../services/adminService';

export function PlatformAnalytics() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getPlatformMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center p-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load platform metrics</p>
      </div>
    );
  }

  const verificationRate = metrics.totalPractitioners > 0
    ? ((metrics.verifiedPractitioners / metrics.totalPractitioners) * 100).toFixed(1)
    : 0;

  const statCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: Users,
      color: 'blue',
      description: 'All registered users',
    },
    {
      title: 'Total Practitioners',
      value: metrics.totalPractitioners,
      icon: UserCheck,
      color: 'purple',
      description: `${metrics.totalPatients} patients`,
    },
    {
      title: 'Verified Practitioners',
      value: metrics.verifiedPractitioners,
      icon: Shield,
      color: 'green',
      description: `${verificationRate}% verification rate`,
    },
    {
      title: 'Pending Verifications',
      value: metrics.pendingVerifications,
      icon: Activity,
      color: 'yellow',
      description: 'Awaiting review',
    },
    {
      title: 'Active Subscriptions',
      value: metrics.activeSubscriptions,
      icon: TrendingUp,
      color: 'indigo',
      description: 'Paid practitioners',
    },
    {
      title: 'Total Consult Requests',
      value: metrics.totalConsults,
      icon: FileText,
      color: 'cyan',
      description: 'All time',
    },
    {
      title: 'Total Messages',
      value: metrics.totalMessages,
      icon: MessageSquare,
      color: 'pink',
      description: 'Platform-wide',
    },
    {
      title: 'Pending Reports',
      value: metrics.pendingReports,
      icon: AlertCircle,
      color: metrics.pendingReports > 0 ? 'red' : 'gray',
      description: 'Needs moderation',
    },
    {
      title: 'New Signups (30d)',
      value: metrics.recentSignups,
      icon: TrendingUp,
      color: 'emerald',
      description: 'Last 30 days',
    },
    {
      title: 'Avg Trust Score',
      value: metrics.trustScoreAverage.toFixed(1),
      icon: Shield,
      color: 'violet',
      description: 'Platform average',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: 'text-cyan-600' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', icon: 'text-pink-600' },
      red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'text-violet-600' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-gray-600">Real-time platform metrics and insights</p>
        </div>
        <button
          onClick={loadMetrics}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const colors = getColorClasses(card.color);
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`${colors.bg} rounded-xl p-6 border border-gray-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg bg-white shadow-sm ${colors.icon}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className={`text-3xl font-bold ${colors.text} mb-1`}>
                {typeof card.value === 'number' && card.value > 999
                  ? card.value.toLocaleString()
                  : card.value}
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">{card.title}</div>
              <div className="text-xs text-gray-600">{card.description}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Platform Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Verification Rate</span>
                <span className="text-sm font-bold text-gray-900">{verificationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${verificationRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Practitioner to Patient Ratio
                </span>
                <span className="text-sm font-bold text-gray-900">
                  1:{metrics.totalPatients > 0 ? Math.round(metrics.totalPatients / metrics.totalPractitioners) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((metrics.totalPractitioners / metrics.totalUsers) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Subscription Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {metrics.totalPractitioners > 0
                    ? ((metrics.activeSubscriptions / metrics.totalPractitioners) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      metrics.totalPractitioners > 0
                        ? (metrics.activeSubscriptions / metrics.totalPractitioners) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Activity Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Messages Sent</span>
              </div>
              <span className="text-lg font-bold text-blue-700">
                {metrics.totalMessages.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Consult Requests</span>
              </div>
              <span className="text-lg font-bold text-green-700">
                {metrics.totalConsults.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-gray-900">Pending Reviews</span>
              </div>
              <span className="text-lg font-bold text-yellow-700">
                {metrics.pendingVerifications}
              </span>
            </div>

            {metrics.pendingReports > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Pending Reports</span>
                </div>
                <span className="text-lg font-bold text-red-700">
                  {metrics.pendingReports}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Growth Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">New Users (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.recentSignups}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.trustScoreAverage.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeSubscriptions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
