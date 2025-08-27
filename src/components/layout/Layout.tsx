import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-svh grid grid-rows-[auto,1fr,auto]">
      <Header />
      <main className="min-h-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
