// utils/notifications.ts
import { getToken } from "firebase/messaging";
import { messaging, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function setupFCM(userId: string) {
  const auth = getAuth();
  console.log("🔥 Current Firebase user:", auth.currentUser);
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("✅ FCM Token:", token);
      // Save token to Firestore
      await setDoc(doc(db, "adminTokens", userId), { token });
    } else {
      console.warn("🔕 Notification permission not granted");
    }
  } catch (err) {
    console.error("❌ FCM setup error:", err);
  }
}
