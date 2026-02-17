import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AlertToasts from "../ui/AlertToasts";
import useSocket from "../../hooks/useSocket";

export default function DashboardLayout({ children, alerts, onDismiss }) {
  const [wsOnline, setWsOnline] = useState(false);

  const handleAlert = useCallback((incoming) => {
    // bubble up to App
  }, []);

  useSocket(handleAlert, setWsOnline);

  return (
    <div className="app-layout">
      <Sidebar wsOnline={wsOnline} />
      <div className="main-content">
        <Topbar alerts={alerts} />
        <div className="page-content">{children}</div>
      </div>
      <AlertToasts alerts={alerts} onDismiss={onDismiss} />
    </div>
  );
}