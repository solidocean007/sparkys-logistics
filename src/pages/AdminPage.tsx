import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import HomeBaseSettings from "../components/Admin/HomeBaseSettings";
import UserInfo from "../components/Admin/UserInfo";
import AvailabilitySettings from "../components/Admin/AvailabilitySettings";
import SetRate from "../components/Admin/SetRate";
import ShowLeads from "../components/Admin/ShowLeads";

const AdminPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    // ✅ Now check admin
    const user = auth.currentUser;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const roleRef = doc(db, "roles", user.uid);
      const roleSnap = await getDoc(roleRef);

      if (roleSnap.exists() && roleSnap.data().admin === true) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" color="error">
            Not Authorized
          </Typography>
          <Typography variant="body1">
            You must be signed in as an admin to view this page.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box>
          <UserInfo />
        </Box>
        <Box>
          <AvailabilitySettings />
        </Box>
        <Box>
          <SetRate />
        </Box>
        <Box>
          <HomeBaseSettings />
        </Box>

        <Box sx={{ mt: 6 }}>
          <ShowLeads /> {/* 👈 Let this handle all leads logic */}
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPage;
