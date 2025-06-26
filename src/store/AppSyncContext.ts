import { createContext } from "react";

export const AppSyncContext = createContext<{
  version: number;
  triggerUpdate: () => void;
}>(null!);
