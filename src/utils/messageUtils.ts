export const canSendMessage = (
  providerPlan: "free" | "pro" | "premium",
  messageCount: number
): { allowed: boolean; reason?: string } => {
  if (providerPlan === "free") {
    return {
      allowed: false,
      reason: "Provider is on Free plan. Please book a consultation to communicate.",
    };
  }

  if (providerPlan === "pro" && messageCount >= 3) {
    return {
      allowed: false,
      reason: "You've reached the 3 message limit for Pro plan providers.",
    };
  }

  return { allowed: true };
};

export const getMessageLimitInfo = (
  providerPlan: "free" | "pro" | "premium",
  messageCount: number
): string => {
  if (providerPlan === "free") {
    return "Messaging unavailable";
  }

  if (providerPlan === "pro") {
    const remaining = 3 - messageCount;
    return remaining > 0 ? `${remaining} messages remaining` : "Limit reached";
  }

  return "Unlimited messaging";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

export const isDocumentFile = (filename: string): boolean => {
  const docExtensions = [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx"];
  return docExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};
