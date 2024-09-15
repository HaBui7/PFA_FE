// src/layouts/MainLayout.tsx
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/footer";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const isChatbotPage = location.pathname.includes("/chatbot");
  const [navHeight, setNavHeight] = useState(0);

  return (
    <div className={isChatbotPage ? "min-h-screen" : ""}>
      <Navbar setNavHeight={setNavHeight} />
      <main>
        <Outlet context={{ navHeight }} />
      </main>
      {!isChatbotPage && <Footer />}
    </div>
  );
};

export default AppLayout;
