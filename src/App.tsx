import { useMemo, useState, useEffect } from "react";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
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
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import type { UserType } from "./utils/types";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<UserType | null>(null); // Track signed-in user

  useEffect(() => {
  loadGoogleMaps().catch((err) => console.error(err));
}, []);


  // inside useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user is admin in Firestore
        const roleRef = doc(db, "roles", firebaseUser.uid);
        const roleSnap = await getDoc(roleRef);
        if (roleSnap.exists()) {
          const roleData = roleSnap.data();
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: roleData.role, // admin, driver, etc
            createdAt: roleData.createdAt,
            updatedAt: roleData.updatedAt,
          }); // Admin user
        } else {
          setUser(null); // Not admin
          alert("You are signed in but not an admin.");
        }
      } else {
        setUser(null); // Not signed in
      }
    });
    return () => unsubscribe();
  }, []);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleColorMode={toggleColorMode} user={user} />
        <Box sx={{ mt: 8 }}>
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
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
