// src/hooks/useAvailability.ts
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export interface Availability {
  [date: string]: { start: string | null; end: string | null };
}

export const useAvailability = () => {
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const docRef = doc(db, "settings", "availability");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setAvailability(snapshot.data() as Availability);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
        setError("Could not load availability.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  return { availability, loading, error };
};
