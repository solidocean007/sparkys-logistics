import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Button, useTheme } from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSnackbar } from "../Providers/SnackbarContext";
import { db } from "../utils/firebase";

const AboutPageHeader: React.FC = () => {
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const theme = useTheme();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const docRef = doc(db, "settings", "aboutPage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutText(docSnap.data().text || "");
        }
      } catch (err) {
        console.error("Error fetching About page text:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutText();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "settings", "aboutPage");
      await setDoc(docRef, { text: aboutText });
      showSnackbar("About page updated successfully!", "success");
    } catch (err) {
      console.error("Error saving About page text:", err);
      showSnackbar("Failed to update About page.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading About Page...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📝 Edit About Page Text
      </Typography>
      <TextField
        multiline
        rows={6}
        fullWidth
        variant="outlined"
        value={aboutText}
        onChange={(e) => setAboutText(e.target.value)}
        sx={{
          mb: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </Paper>
  );
};

export default AboutPageHeader;
