import { Outlet } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import CookieConsent from "../components/Common/CookieConsent";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
