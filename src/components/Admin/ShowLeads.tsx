import React, { useEffect, useState } from "react";
import { Typography, Box, Switch, FormControlLabel } from "@mui/material";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import LeadCard from "../LeadCard";
import type { LeadType } from "../../utils/types";
import { useSnackbar } from "../../Providers/SnackbarContext";

const ShowLeads: React.FC = () => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [hideContacted, setHideContacted] = useState(false);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const leadsQuery = query(
      collection(db, "leads"),
      orderBy("timestamp", "desc")
    );

    // Fetch all leads initially
    const fetchInitialLeads = async () => {
      try {
        const snapshot = await getDocs(leadsQuery);
        const initialLeads: LeadType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];
        setLeads(initialLeads);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      }
    };

    fetchInitialLeads();

    // Set up real-time listener
    const unsubscribe = onSnapshot(leadsQuery, (snapshot) => {
      const updatedLeads: LeadType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LeadType[];
      setLeads(updatedLeads);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const markAsContacted = async (leadId: string) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { contacted: true });
      console.log("Marked as contacted:", leadId);
      showSnackbar("Marcked as contacted.", "success");

      // ✅ Optimistically update local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, contacted: true } : lead
        )
      );
    } catch (error) {
      console.error("Failed to mark lead as contacted:", error);
      showSnackbar("Failed to update lead.", "error");
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Customer Leads
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={hideContacted}
            onChange={() => setHideContacted(!hideContacted)}
          />
        }
        label="Hide Contacted Leads"
        sx={{ mb: 2 }}
      />

      {leads.length === 0 ? (
        <Typography>No leads submitted yet.</Typography>
      ) : (
        leads
          .filter((lead) => !hideContacted || !lead.contacted)
          .map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onMarkAsContacted={() => markAsContacted(lead.id)}
            />
          ))
      )}
    </Box>
  );
};

export default ShowLeads;
