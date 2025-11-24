import { useEffect, useState } from "react";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === "granted" && isSupported) {
      new Notification(title, {
        icon: "/logo.png",
        badge: "/badge.png",
        ...options,
      });
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  };
};
