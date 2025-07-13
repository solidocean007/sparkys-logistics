import { createContext, useContext } from "react";

type SnackbarSeverity = "success" | "error";

export const SnackbarContext = createContext<(msg: string, severity?: SnackbarSeverity) => void>(() => {});

export const useSnackbar = () => useContext(SnackbarContext);
