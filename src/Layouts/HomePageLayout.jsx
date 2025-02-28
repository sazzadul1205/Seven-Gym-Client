import { Outlet } from "react-router";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer";

const HomePageLayout = () => {
  return (
    <div data-theme="cupcake">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomePageLayout;
