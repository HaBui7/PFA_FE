// src/layouts/MainLayout.tsx
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
