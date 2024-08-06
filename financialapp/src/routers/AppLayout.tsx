// src/layouts/MainLayout.tsx
import Navbar from "@/components/ui/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
