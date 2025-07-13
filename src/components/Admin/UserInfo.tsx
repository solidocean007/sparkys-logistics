import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

interface UserInfo {
  uid: string;
  name: string | null;
  email: string | null;
  admin: boolean;
}

const UserInfo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setUserInfo(null);
        setLoading(false);
        return;
      }

      try {
        const roleRef = doc(db, "roles", firebaseUser.uid);
        const roleSnap = await getDoc(roleRef);
        const isAdmin =
          roleSnap.exists() && roleSnap.data().admin === true;

        setUserInfo({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          admin: isAdmin,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading user info...</Typography>
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container>
        <Typography color="error" variant="h5">
          Not signed in
        </Typography>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </Container>
    );
  }

  if (!userInfo.admin) {
    return (
      <Container>
        <Typography color="error" variant="h5">
          You are signed in as <strong>{userInfo.email}</strong> but are not an admin.
        </Typography>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            ✅ Signed in as Admin
          </Typography>
          <Typography><strong>Name:</strong> {userInfo.name}</Typography>
          <Typography><strong>Email:</strong> {userInfo.email}</Typography>
          {/* <Typography><strong>UID:</strong> {userInfo.uid}</Typography> */}
          <Typography><strong>Admin Role:</strong> {userInfo.admin ? "true" : "false"}</Typography>
        </Paper>

        {/* Existing admin dashboard content here */}
      </Box>
    </Container>
  );
};

export default UserInfo;
