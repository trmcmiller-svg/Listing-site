import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';
import {
  getContentReports,
  updateReportStatus,
  type ContentReport,
} from '../services/adminService';

export function ContentModeration() {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const data = await getContentReports(status);
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    reportId: string,
    status: 'reviewing' | 'resolved' | 'dismissed'
  ) => {
    if (!actionNotes && status !== 'reviewing') {
      alert('Please provide notes about your decision');
      return;
    }

    setActionLoading(true);
    try {
      await updateReportStatus(reportId, status, actionNotes, actionTaken);
      setSelectedReport(null);
      setActionNotes('');
      setActionTaken('');
      loadReports();
    } catch (error) {
      alert('Error updating report: ' + (error as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'fraud':
      case 'fake_credentials':
        return 'bg-red-100 text-red-800';
      case 'harassment':
        return 'bg-orange-100 text-orange-800';
      case 'inappropriate':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-gray-600">Review and manage user reports</p>
        </div>
        <button
          onClick={loadReports}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'reviewing', 'resolved', 'dismissed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'pending' && reports.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {reports.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">All Clear!</h3>
          <p className="text-gray-600">No reports to review at this time.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getReportTypeColor(report.report_type)}`}>
                        {report.report_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {report.reported_content_type}
                    </p>
                  </div>
                  <AlertCircle className={`w-5 h-5 ${
                    report.report_type === 'fraud' || report.report_type === 'fake_credentials'
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Reporter:</strong> {report.reporter?.full_name || 'Unknown'} ({report.reporter?.email || 'N/A'})
                  </p>
                  <p>
                    <strong>Reported User:</strong> {report.reported_user?.full_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white sticky top-6 h-fit">
            {selectedReport ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Report Details</h3>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Report Type
                      </label>
                      <span className={`px-3 py-1.5 rounded inline-block text-sm font-semibold ${getReportTypeColor(selectedReport.report_type)}`}>
                        {selectedReport.report_type}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Content Type
                      </label>
                      <p className="text-gray-900">{selectedReport.reported_content_type}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Reporter
                      </label>
                      <p className="text-gray-900">{selectedReport.reporter?.full_name}</p>
                      <p className="text-sm text-gray-600">{selectedReport.reporter?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Reported User
                      </label>
                      <p className="text-gray-900">{selectedReport.reported_user?.full_name}</p>
                      <p className="text-sm text-gray-600">{selectedReport.reported_user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Reason
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {selectedReport.report_reason}
                      </p>
                    </div>

                    {selectedReport.admin_notes && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Previous Admin Notes
                        </label>
                        <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">
                          {selectedReport.admin_notes}
                        </p>
                      </div>
                    )}

                    {selectedReport.action_taken && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Action Taken
                        </label>
                        <p className="text-gray-900 bg-green-50 p-3 rounded-lg">
                          {selectedReport.action_taken}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Submitted
                      </label>
                      <p className="text-gray-900">{new Date(selectedReport.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add notes about your review and decision..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Action Taken
                      </label>
                      <input
                        type="text"
                        value={actionTaken}
                        onChange={(e) => setActionTaken(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Warned user, Suspended account, No action needed"
                      />
                    </div>

                    <div className="flex gap-3">
                      {selectedReport.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedReport.id, 'reviewing')}
                          disabled={actionLoading}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading ? 'Processing...' : 'Resolve'}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                        disabled={actionLoading}
                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Select a report to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
