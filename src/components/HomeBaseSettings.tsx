import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  // Box,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

interface HomeBaseSettingsType {
  address: string;
  lat: number;
  lng: number;
  maxRadius: number;
  enforceRadius: boolean;
}

const HomeBaseSettings: React.FC = () => {
  const [settings, setSettings] = useState<HomeBaseSettingsType>({
    address: "",
    lat: 0,
    lng: 0,
    maxRadius: 80,
    enforceRadius: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "homebase");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as HomeBaseSettingsType);
        }
      } catch (error) {
        console.error("Error fetching home base settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Geocode the address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: settings.address }, async (results, status) => {
        if (status === "OK" && results && results.length > 0 &&  results[0]) {
          const location = results[0].geometry.location.toJSON();
          const updatedSettings = {
            ...settings,
            lat: location.lat,
            lng: location.lng,
          };

          // Save to Firestore
          await updateDoc(doc(db, "settings", "homebase"), updatedSettings);
          alert("Home base settings updated successfully!");
        } else {
          alert("Geocoding failed: " + status);
        }
      });
    } catch (error) {
      console.error("Error saving home base settings:", error);
      alert("Failed to save home base settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Loading Home Base Settings...</Typography>;

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🏠 Home Base Settings
      </Typography>
      <TextField
        label="Home Base Address"
        value={settings.address}
        onChange={(e) =>
          setSettings({ ...settings, address: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Max Pickup Radius (miles)"
        type="number"
        value={settings.maxRadius}
        onChange={(e) =>
          setSettings({
            ...settings,
            maxRadius: parseFloat(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.enforceRadius}
            onChange={(e) =>
              setSettings({
                ...settings,
                enforceRadius: e.target.checked,
              })
            }
          />
        }
        label="Enforce Pickup Radius"
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Home Base Settings"}
      </Button>
    </Paper>
  );
};

export default HomeBaseSettings;
