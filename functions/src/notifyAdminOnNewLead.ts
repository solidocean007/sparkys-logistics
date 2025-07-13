import * as firestore from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

export const notifyAdminOnNewLead = firestore.onDocumentCreated(
  "leads/{leadId}",
  async (event) => {
    const snap = event.data;

    if (!snap) {
      console.error("No data in Firestore trigger");
      return;
    }

    const leadData = snap.data() as {
      pickup: string;
      dropOff: string;
    };

    // Get all admin tokens
    const tokensSnap = await admin.firestore().collection("adminTokens").get();
    const tokens = tokensSnap.docs.map(
      (doc) => (doc.data() as { token: string }).token
    );

    if (tokens.length === 0) {
      console.log("⚠️ No FCM tokens found for admins.");
      return;
    }

    const payload = {
      notification: {
        title: "🚨 New Lead Received!",
        body: `Pickup: ${leadData.pickup} → Dropoff: ${leadData.dropOff}`,
      },
    };

    try {
      const response = await admin.messaging().sendToDevice(tokens, payload);
      console.log("✅ Notification sent:", response);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  }
);
