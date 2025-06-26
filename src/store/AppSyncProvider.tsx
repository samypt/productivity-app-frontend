import { useCallback, useState } from "react";
import { AppSyncContext } from "./AppSyncContext";

export const AppSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [version, setVersion] = useState(0);

  const triggerUpdate = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  return (
    <AppSyncContext.Provider value={{ version, triggerUpdate }}>
      {children}
    </AppSyncContext.Provider>
  );
};
