import Navbar from "../Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../Shared/Footer";

const PublicPageLayout = () => {
  return (
    <div data-theme="cupcake">
      <Navbar />
      <main className="bg-linear-to-l from-[#F72C5B] to-[#f53260] pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicPageLayout;
