import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
} from "@mui/material";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "roles")); // Assuming roles collection
        const userData: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unknown",
          email: doc.data().email || "No email",
          admin: doc.data().admin || false,
        }));
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, "roles", userId);
      await updateDoc(userRef, { admin: !currentStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, admin: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
      alert("Failed to update admin status.");
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        👥 User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.admin}
                    onChange={() => toggleAdmin(user.id, user.admin)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserManagement;
