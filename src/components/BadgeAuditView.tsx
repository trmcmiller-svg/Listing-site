import { useState, useEffect } from 'react';
import { Award, TrendingUp, TrendingDown, RefreshCw, Shield, UserCheck } from 'lucide-react';
import {
  getBadgeAuditLog,
  manuallyAwardBadge,
  manuallyRevokeBadge,
  type BadgeAuditEntry,
} from '../services/adminService';

export function BadgeAuditView() {
  const [auditLog, setAuditLog] = useState<BadgeAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [showManualBadge, setShowManualBadge] = useState(false);
  const [manualBadgeData, setManualBadgeData] = useState({
    practitionerId: '',
    badgeType: 'verified_identity',
    reason: '',
    action: 'award' as 'award' | 'revoke',
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAuditLog();
  }, []);

  const loadAuditLog = async () => {
    setLoading(true);
    try {
      const data = await getBadgeAuditLog();
      setAuditLog(data);
    } catch (error) {
      console.error('Error loading audit log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualBadgeAction = async () => {
    if (!manualBadgeData.practitionerId || !manualBadgeData.reason) {
      alert('Please fill in all fields');
      return;
    }

    setActionLoading(true);
    try {
      if (manualBadgeData.action === 'award') {
        await manuallyAwardBadge(
          manualBadgeData.practitionerId,
          manualBadgeData.badgeType,
          manualBadgeData.reason
        );
      } else {
        await manuallyRevokeBadge(
          manualBadgeData.practitionerId,
          manualBadgeData.badgeType,
          manualBadgeData.reason
        );
      }
      setShowManualBadge(false);
      setManualBadgeData({
        practitionerId: '',
        badgeType: 'verified_identity',
        reason: '',
        action: 'award',
      });
      loadAuditLog();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'awarded':
      case 'manually_granted':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'revoked':
      case 'manually_removed':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'recomputed':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default:
        return <Award className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'awarded':
      case 'manually_granted':
        return 'bg-green-100 text-green-800';
      case 'revoked':
      case 'manually_removed':
        return 'bg-red-100 text-red-800';
      case 'recomputed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'verified_identity':
        return <Shield className="w-5 h-5" />;
      case 'verified_practice':
        return <UserCheck className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.practitioner?.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.badge_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedAction === 'all' || entry.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Badge Audit Log</h2>
          <p className="text-gray-600">Track all badge awards, revocations, and changes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowManualBadge(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Manual Badge Action
          </button>
          <button
            onClick={loadAuditLog}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by practitioner name or badge type..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="awarded">Awarded</option>
          <option value="revoked">Revoked</option>
          <option value="recomputed">Recomputed</option>
          <option value="manually_granted">Manually Granted</option>
          <option value="manually_removed">Manually Removed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Practitioner
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Badge
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No audit entries found
                  </td>
                </tr>
              ) : (
                filteredLog.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {entry.practitioner?.legal_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {entry.practitioner?.professional_title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getBadgeIcon(entry.badge_type)}
                        <span className="text-sm font-medium">
                          {entry.badge_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(entry.action)}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(entry.action)}`}
                        >
                          {entry.action.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 max-w-xs truncate">
                        {entry.trigger_reason}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          entry.automated
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {entry.automated ? 'Automated' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showManualBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Manual Badge Action</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Action Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="award"
                      checked={manualBadgeData.action === 'award'}
                      onChange={(e) =>
                        setManualBadgeData({
                          ...manualBadgeData,
                          action: e.target.value as 'award' | 'revoke',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span>Award Badge</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="revoke"
                      checked={manualBadgeData.action === 'revoke'}
                      onChange={(e) =>
                        setManualBadgeData({
                          ...manualBadgeData,
                          action: e.target.value as 'award' | 'revoke',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span>Revoke Badge</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Practitioner ID
                </label>
                <input
                  type="text"
                  value={manualBadgeData.practitionerId}
                  onChange={(e) =>
                    setManualBadgeData({ ...manualBadgeData, practitionerId: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter practitioner UUID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Badge Type
                </label>
                <select
                  value={manualBadgeData.badgeType}
                  onChange={(e) =>
                    setManualBadgeData({ ...manualBadgeData, badgeType: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="verified_identity">Verified Identity</option>
                  <option value="verified_practice">Verified Practice</option>
                  <option value="continuity_of_care">Continuity of Care</option>
                  <option value="established_practitioner">Established Practitioner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={manualBadgeData.reason}
                  onChange={(e) =>
                    setManualBadgeData({ ...manualBadgeData, reason: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why this manual action is necessary..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleManualBadgeAction}
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {actionLoading ? 'Processing...' : 'Submit'}
                </button>
                <button
                  onClick={() => setShowManualBadge(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
