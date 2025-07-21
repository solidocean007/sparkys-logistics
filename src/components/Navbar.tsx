import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth } from "../utils/firebase";
import type { UserType } from "../utils/types";
import { GoogleAuthProvider } from "firebase/auth";

interface NavbarProps {
  toggleColorMode: () => void;
  user: UserType | null; // Ideally use UserType
}

const Navbar: React.FC<NavbarProps> = ({ toggleColorMode, user }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Create a GoogleAuthProvider and force account chooser
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = "/"; // Redirect to home after sign out
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const menuItems = ["Home", "About", "Contact"];
  if (user) {
    menuItems.push("Admin");
  }

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ width: "100%" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sparky's Logistics
          </Typography>

          {!isMobile && (
            <>
              {menuItems.map((text) => (
                <Link
                  key={text}
                  component={RouterLink}
                  to={
                    text.toLowerCase() === "home"
                      ? "/"
                      : `/${text.toLowerCase()}`
                  }
                  color="inherit"
                  underline="none"
                  sx={{ ml: 2, fontSize: "1.1rem" }}
                >
                  {text}
                </Link>
              ))}

              <IconButton color="inherit" onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleSettingsClose}
              >
                <MenuItem>
                  <Typography variant="body1">Dark Mode</Typography>
                  <Switch onChange={toggleColorMode} />
                </MenuItem>
                {user ? (
                  <>
                    <MenuItem key="hello" disabled>
                      <Typography variant="body1">
                        👋 Hello, {user.name}!
                      </Typography>
                    </MenuItem>
                    <MenuItem key="sign-out" onClick={handleSignOut}>
                      Sign Out
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem key="sign-in" onClick={handleSignIn}>
                    Sign In
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((text) => (
            <ListItem
              key={text}
              component={RouterLink}
              to={
                text.toLowerCase() === "home" ? "/" : `/${text.toLowerCase()}`
              }
              sx={{ textDecoration: "none", color: "inherit" }}
              onClick={() => setDrawerOpen(false)} // 👈 closes the drawer
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}

          <ListItem>
            <ListItemText primary="Dark Mode" />
            <Switch onChange={toggleColorMode} />
          </ListItem>

          {user ? (
            <>
              <ListItem>
                <ListItemText primary={`👋 Hello, ${user.name || "Jeff"}!`} />
              </ListItem>
              <ListItemButton onClick={handleSignOut}>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </>
          ) : (
            <ListItemButton
              onClick={() => {
                handleSignIn();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
