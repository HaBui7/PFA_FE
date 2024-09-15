// src/layouts/MainLayout.tsx
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/footer";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const isChatbotPage = location.pathname.includes("/chatbot");

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!isChatbotPage && <Footer />}
    </div>
  );
};

export default AppLayout;
