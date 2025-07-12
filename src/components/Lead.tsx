import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropOff: string;
  notes: string;
  distance: number;
  price: number;
  timestamp: Timestamp;
  contacted?: boolean;
}

const AdminPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStatusAndLeads = async () => {
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

          // Fetch rate
          const rateDoc = await getDoc(doc(db, "settings", "rate"));
          if (rateDoc.exists()) {
            setRate(rateDoc.data().ratePerMile.toString());
          }

          // Fetch leads
          const leadsSnapshot = await getDocs(collection(db, "leads"));
          const leadsData: Lead[] = [];
          leadsSnapshot.forEach((doc) =>
            leadsData.push({ id: doc.id, ...doc.data() } as Lead)
          );
          setLeads(leadsData);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin role or fetching data:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStatusAndLeads();
  }, []);

  const handleUpdateRate = async () => {
    try {
      await setDoc(doc(db, "settings", "rate"), {
        ratePerMile: parseFloat(rate),
      });
      alert("Rate updated successfully!");
    } catch (error) {
      console.error("Failed to update rate:", error);
      alert("Failed to update rate.");
    }
  };

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
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
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
        <Typography variant="body1" gutterBottom>
          Update the market rate per mile:
        </Typography>
        <TextField
          label="Rate per Mile"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          type="number"
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleUpdateRate}
        >
          Update Rate
        </Button>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Customer Leads
          </Typography>
          {leads.length === 0 ? (
            <Typography>No leads submitted yet.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Pickup</TableCell>
                    <TableCell>Dropoff</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.pickup}</TableCell>
                      <TableCell>{lead.dropOff}</TableCell>
                      <TableCell>${lead.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(lead.timestamp.seconds * 1000).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPage;
