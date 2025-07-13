// utils/requestNotificationPermission.ts
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("🔔 FCM Token:", token);
      return token;
    } else {
      console.warn("Notification permission not granted");
      return null;
    }
  } catch (err) {
    console.error("Error getting notification permission:", err);
    return null;
  }
}
