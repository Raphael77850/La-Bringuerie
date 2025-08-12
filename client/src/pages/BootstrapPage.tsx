import { useState } from "react";
import CreateFirstAdmin from "../components/Admin/CreateFirstAdmin";
import AdminDashboard from "./AdminDashboard";

export default function BootstrapPage() {
  const [adminCreated, setAdminCreated] = useState(false);

  const handleAdminCreated = () => {
    setAdminCreated(true);
  };

  if (adminCreated) {
    return <AdminDashboard />;
  }

  return <CreateFirstAdmin onAdminCreated={handleAdminCreated} />;
}
