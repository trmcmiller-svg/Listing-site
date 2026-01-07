import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AdminNotification,
} from '../services/adminService';
import { useNavigate } from 'react-router-dom';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [showUnreadOnly]);

  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications(showUnreadOnly);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications read:', error);
    }
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.is_read) {
      handleMarkRead(notification.id);
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-blue-500 bg-blue-50';
      case 'low':
        return 'border-gray-300 bg-white';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          <h2 className="text-2xl font-bold">Admin Notifications</h2>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Mark All Read
            </button>
          )}
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              showUnreadOnly
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
          <p className="text-gray-600">
            {showUnreadOnly
              ? 'No unread notifications at this time.'
              : 'No notifications to display.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`border-l-4 rounded-lg p-4 transition-all ${
                getPriorityColor(notification.priority)
              } ${
                notification.is_read ? 'opacity-60' : ''
              } ${
                notification.link_url ? 'cursor-pointer hover:shadow-md' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getPriorityIcon(notification.priority)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold text-gray-900 ${!notification.is_read ? 'font-extrabold' : ''}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          notification.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : notification.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : notification.priority === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {notification.priority}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(notification.id);
                          }}
                          className="p-1 hover:bg-white rounded transition-colors"
                          title="Mark as read"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                    {notification.link_url && (
                      <span className="text-xs text-blue-600 font-semibold hover:underline">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminNotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<AdminNotification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await getAdminNotifications(true);
      setUnreadCount(data.length);
      setRecentNotifications(data.slice(0, 5));
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationClick = async (notification: AdminNotification) => {
    setShowDropdown(false);
    if (!notification.is_read) {
      await markNotificationRead(notification.id);
      loadUnreadCount();
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/admin-dashboard?tab=notifications');
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  function getPriorityIcon(priority: string) {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />;
      case 'medium':
        return <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />;
    }
  }
}
