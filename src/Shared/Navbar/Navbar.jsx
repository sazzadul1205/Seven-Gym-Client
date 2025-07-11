import { useState, useEffect, useRef } from "react";

// import Packages
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";

// import Icons
import { IoMenu } from "react-icons/io5";

// import Assets
import icon from "../../assets/Icons/Seven-Gym-Icon.png";

// import Data
import MenuItems from "../../JSON/Menu_Items.json";

// import Components
import Loading from "../Loading/Loading";
import NavDrawer from "./NavDrawer/NavDrawer";
import NavbarEnd from "./NavbarEnd/NavbarEnd";
import FetchingError from "../Component/FetchingError";

// Import Utility
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Navbar = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State variables
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Refs
  const menuRef = useRef(null);
  const submenuTimeoutRef = useRef(null);

  // Fetch user data if logged in
  const {
    data: UsersData,
    isLoading: UsersDataIsLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await axiosPublic.get(`/Users?email=${user?.email}`);
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!user,
  });

  // Scroll and click outside handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenSubmenu(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(submenuTimeoutRef.current);
    };
  }, []);

  // Submenu handlers
  const handleMouseEnter = (itemName) => {
    clearTimeout(submenuTimeoutRef.current);
    setOpenSubmenu(itemName);
  };

  const handleMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 300);
  };

  if (UsersDataIsLoading) return <Loading />;
  if (UsersDataError) return <FetchingError />;

  return (
    <nav
      className={`navbar fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-bl from-[#F72C5B]/90 to-[#f7003a]/90"
          : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between items-center px-0 py-0 lg:px-10">
        {/* Navbar Start */}
        <div className="navbar-start flex items-center py-0">
          {/* Mobile Menu Button */}
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            <IoMenu className="text-3xl text-white" />
          </label>

          {/* Logo */}
          <NavLink
            to="/"
            className="ml-2 rounded-md transition-all duration-200"
          >
            <img src={icon} alt="icon" className="w-28" />
          </NavLink>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex space-x-4 px-1 text-white font-semibold text-lg">
            {MenuItems.map((item) => (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.submenu ? (
                  <>
                    <div className="text-white hover:text-[#FFC107] cursor-pointer">
                      {item.name}
                    </div>
                    {openSubmenu === item.name && (
                      <ul
                        className="absolute left-0 w-52 bg-[#f35f81] text-white z-50 p-2 shadow-2xl mt-2 rounded-md"
                        ref={menuRef}
                        onMouseEnter={() =>
                          clearTimeout(submenuTimeoutRef.current)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-[#FFC107] font-bold text-sm pl-2 py-2"
                                  : "hover:text-[#FFC107] text-sm pl-2 py-2"
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#FFC107] font-bold"
                        : "hover:text-[#FFC107]"
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End */}
        <NavbarEnd UsersData={UsersData} />
      </div>

      {/* Mobile Drawer */}
      <div className="drawer drawer-end lg:hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <NavDrawer icon={icon} menuItems={MenuItems} />
      </div>
    </nav>
  );
};

export default Navbar;
