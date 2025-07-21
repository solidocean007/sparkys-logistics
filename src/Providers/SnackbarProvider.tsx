import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { SnackbarContext } from "./SnackbarContext";

type SnackbarSeverity = "success" | "error";

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as SnackbarSeverity,
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarSeverity = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 6 }} // 👈 adds margin-top
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
