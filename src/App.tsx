import { useMemo, useState, useEffect } from "react";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { auth, db } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { UserType } from "./utils/types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "./Providers/SnackbarProvider";
import { useSnackbar } from "./Providers/SnackbarContext";
import { setupFCM } from "./utils/setupFCM";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<UserType | null>(null);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const roleRef = doc(db, "roles", firebaseUser.uid);
        const roleSnap = await getDoc(roleRef);
        if (roleSnap.exists()) {
          const roleData = roleSnap.data();
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: roleData.role,
            createdAt: roleData.createdAt,
            updatedAt: roleData.updatedAt,
          });
        } else {
          setUser(null);
          showSnackbar("You are signed in but not an admin.", "error");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [showSnackbar]);

  useEffect(() => {
  if (user) {
    setupFCM(user.id);
  }
}, [user]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar toggleColorMode={toggleColorMode} user={user} />
          <Box sx={{ mt: 8 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/admin"
                  element={user ? <AdminPage /> : <LoginPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </LocalizationProvider>
          </Box>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
