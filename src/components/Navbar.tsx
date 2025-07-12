import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth } from "../utils/firebase";

interface NavbarProps {
  toggleColorMode: () => void;
  user: any; // create a UserType.. create a utils/types.ts file
}

const Navbar: React.FC<NavbarProps> = ({ toggleColorMode, user }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = "/"; // Redirect to Home
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
                  to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
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
                {user && <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>}
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
              to={`/${text.toLowerCase()}`}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}

          <ListItem>
            <ListItemText primary="Dark Mode" />
            <Switch onChange={toggleColorMode} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
