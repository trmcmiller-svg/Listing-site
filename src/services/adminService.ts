import { supabase } from '../lib/supabase';

export interface ContentReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  report_type: string;
  reported_content_type: string;
  reported_content_id: string | null;
  report_reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  reviewed_by: string | null;
  admin_notes: string | null;
  action_taken: string | null;
  resolved_at: string | null;
  created_at: string;
  reporter?: {
    full_name: string;
    email: string;
  };
  reported_user?: {
    full_name: string;
    email: string;
  };
}

export interface PlatformMetrics {
  totalUsers: number;
  totalPractitioners: number;
  totalPatients: number;
  verifiedPractitioners: number;
  pendingVerifications: number;
  activeSubscriptions: number;
  totalConsults: number;
  totalMessages: number;
  pendingReports: number;
  recentSignups: number;
  trustScoreAverage: number;
}

export interface AdminNotification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  link_url: string | null;
  metadata: any;
  created_at: string;
}

export interface BadgeAuditEntry {
  id: string;
  badge_id: string | null;
  practitioner_id: string;
  badge_type: string;
  action: string;
  previous_state: any;
  new_state: any;
  trigger_reason: string;
  automated: boolean;
  admin_user_id: string | null;
  created_at: string;
  practitioner?: {
    legal_name: string;
    professional_title: string;
  };
}

export interface VerificationAuditEntry {
  id: string;
  practitioner_id: string;
  previous_status: string;
  new_status: string;
  admin_user_id: string;
  admin_notes: string | null;
  documents_reviewed: any;
  created_at: string;
  practitioner?: {
    legal_name: string;
    professional_title: string;
  };
  admin_user?: {
    full_name: string;
    email: string;
  };
}

export async function getContentReports(status?: string): Promise<ContentReport[]> {
  let query = supabase
    .from('content_reports')
    .select(`
      *,
      reporter:reporter_id (full_name, email),
      reported_user:reported_user_id (full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching content reports:', error);
    throw error;
  }

  return data as ContentReport[];
}

export async function updateReportStatus(
  reportId: string,
  status: 'reviewing' | 'resolved' | 'dismissed',
  adminNotes?: string,
  actionTaken?: string
): Promise<void> {
  const { error } = await supabase
    .from('content_reports')
    .update({
      status,
      reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      admin_notes: adminNotes,
      action_taken: actionTaken,
      resolved_at: status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reportId);

  if (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

export async function submitContentReport(
  reportedUserId: string,
  reportType: string,
  reportedContentType: string,
  reportReason: string,
  reportedContentId?: string
): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('content_reports').insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    report_type: reportType,
    reported_content_type: reportedContentType,
    reported_content_id: reportedContentId,
    report_reason: reportReason,
  });

  if (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const [
    profilesCount,
    practitionersData,
    verificationsCount,
    subscriptionsCount,
    consultsCount,
    messagesCount,
    reportsCount,
  ] = await Promise.all([
    supabase.from('profiles').select('role', { count: 'exact', head: true }),
    supabase.from('practitioners').select('verification_status, trust_score'),
    supabase.from('verification_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('consult_requests').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const practitioners = practitionersData.data || [];
  const verifiedPractitioners = practitioners.filter(p => p.verification_status === 'verified').length;
  const trustScores = practitioners.map(p => p.trust_score).filter(s => s !== null);
  const avgTrustScore = trustScores.length > 0
    ? trustScores.reduce((sum, score) => sum + score, 0) / trustScores.length
    : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: recentSignupsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    totalUsers: profilesCount.count || 0,
    totalPractitioners: practitioners.length,
    totalPatients: (profilesCount.count || 0) - practitioners.length,
    verifiedPractitioners,
    pendingVerifications: verificationsCount.count || 0,
    activeSubscriptions: subscriptionsCount.count || 0,
    totalConsults: consultsCount.count || 0,
    totalMessages: messagesCount.count || 0,
    pendingReports: reportsCount.count || 0,
    recentSignups: recentSignupsCount || 0,
    trustScoreAverage: Math.round(avgTrustScore * 10) / 10,
  };
}

export async function getAdminNotifications(unreadOnly = false): Promise<AdminNotification[]> {
  let query = supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return data as AdminNotification[];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification read:', error);
    throw error;
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications read:', error);
    throw error;
  }
}

export async function getBadgeAuditLog(
  practitionerId?: string,
  limit = 100
): Promise<BadgeAuditEntry[]> {
  let query = supabase
    .from('badge_audit_log')
    .select(`
      *,
      practitioner:practitioner_id (legal_name, professional_title)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (practitionerId) {
    query = query.eq('practitioner_id', practitionerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching badge audit log:', error);
    throw error;
  }

  return data as BadgeAuditEntry[];
}

export async function getVerificationAuditLog(
  practitionerId?: string,
  limit = 100
): Promise<VerificationAuditEntry[]> {
  let query = supabase
    .from('verification_audit_log')
    .select(`
      *,
      practitioner:practitioner_id (legal_name, professional_title),
      admin_user:admin_user_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (practitionerId) {
    query = query.eq('practitioner_id', practitionerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching verification audit log:', error);
    throw error;
  }

  return data as VerificationAuditEntry[];
}

export async function manuallyAwardBadge(
  practitionerId: string,
  badgeType: string,
  reason: string
): Promise<void> {
  const adminUser = (await supabase.auth.getUser()).data.user;
  if (!adminUser) throw new Error('Not authenticated');

  const { data: existingBadge } = await supabase
    .from('trust_badges')
    .select('id')
    .eq('practitioner_id', practitionerId)
    .eq('badge_type', badgeType)
    .maybeSingle();

  if (existingBadge) {
    const { error } = await supabase
      .from('trust_badges')
      .update({
        is_active: true,
        earned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingBadge.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from('trust_badges').insert({
      practitioner_id: practitionerId,
      badge_type: badgeType,
      is_active: true,
      earned_at: new Date().toISOString(),
      computation_metadata: { manual: true, reason, admin_id: adminUser.id },
    });

    if (error) throw error;
  }

  await supabase.from('badge_audit_log').insert({
    practitioner_id: practitionerId,
    badge_type: badgeType,
    action: 'manually_granted',
    new_state: { is_active: true, earned_at: new Date().toISOString() },
    trigger_reason: reason,
    automated: false,
    admin_user_id: adminUser.id,
  });
}

export async function manuallyRevokeBadge(
  practitionerId: string,
  badgeType: string,
  reason: string
): Promise<void> {
  const adminUser = (await supabase.auth.getUser()).data.user;
  if (!adminUser) throw new Error('Not authenticated');

  const { data: badge } = await supabase
    .from('trust_badges')
    .select('*')
    .eq('practitioner_id', practitionerId)
    .eq('badge_type', badgeType)
    .maybeSingle();

  if (!badge) {
    throw new Error('Badge not found');
  }

  const { error } = await supabase
    .from('trust_badges')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', badge.id);

  if (error) throw error;

  await supabase.from('badge_audit_log').insert({
    badge_id: badge.id,
    practitioner_id: practitionerId,
    badge_type: badgeType,
    action: 'manually_removed',
    previous_state: { is_active: badge.is_active, earned_at: badge.earned_at },
    new_state: { is_active: false, revoked_at: new Date().toISOString() },
    trigger_reason: reason,
    automated: false,
    admin_user_id: adminUser.id,
  });
}
