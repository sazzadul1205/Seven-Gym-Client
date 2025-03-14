import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImExit } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { AiTwotoneSchedule } from "react-icons/ai";
import { IoMenu, IoSettingsOutline } from "react-icons/io5";

// Assets
import icon from "../../assets/Icons/Seven-Gym-Icon.png";

// Data
import MenuItems from "../../JSON/Menu_Items.json";

// Components & Hooks
import Loading from "../Loading/Loading";
import FetchingError from "../Component/FetchingError";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import NavDrawer from "./NavDrawer/NavDrawer";

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
  const { user, logOut } = useAuth();

  // State variables
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refs for handling outside clicks
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

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
        const res = await axiosPublic.get(`/Users?email=${user.email}`);
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null; // No data found
        throw error;
      }
    },
    enabled: !!user, // Fetch only if user exists
  });

  // Handles scrolling effect on navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenSubmenu(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle submenu hover
  const handleMouseEnter = (itemName) => setOpenSubmenu(itemName);
  const handleMouseLeave = () => setTimeout(() => setOpenSubmenu(null), 200);

  // Logout function
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logOut();
      window.location.reload(); // Refresh the page after logout
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: `Error logging out: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Role-based navigation links
  const roleBasedLinks = {
    Member: [
      {
        name: UsersData?.fullName,
        path: `/User/${user?.email}/UserProfile`,
        icon: <FaUser />,
      },
      {
        name: "Tier Upgrade",
        path: `/User/${user?.email}/TierUpgrade`,
        icon: <GiUpgrade />,
      },
      {
        name: "Schedule Planner",
        path: `/User/${user?.email}/UserSchedulePlanner`,
        icon: <AiTwotoneSchedule />,
      },
      {
        name: "Settings",
        path: "/User/UserSettings",
        icon: <IoSettingsOutline />,
      },
    ],
    Trainer: [
      { name: "Trainer Dashboard", path: "/TrainerDashboard" },
      { name: "Class Management", path: "/ClassManagement" },
    ],
    ClassManager: [{ name: "Dashboard", path: "/ClassManagerDashboard" }],
    Moderator: [{ name: "Moderator Dashboard", path: "/ModeratorDashboard" }],
    Admin: [
      { name: "Admin Dashboard", path: "/AdminDashboard" },
      { name: "User Management", path: "/UserManagement" },
    ],
  };

  // Loading and error handling
  if (UsersDataIsLoading) return <Loading />;
  if (UsersDataError) return <FetchingError />;

  return (
    <nav
      className={`navbar fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#F72C5B]" : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between items-center px-0 lg:px-24">
        {/* Navbar Start - Logo & Mobile Menu */}
        <div className="navbar-start flex items-center">
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost lg:hidden drawer-button"
          >
            <IoMenu className="text-4xl text-white" />
          </label>
          <NavLink to="/" className="ml-2">
            <img src={icon} alt="icon" className="w-28" />
          </NavLink>
        </div>

        {/* Navbar Center - Navigation Links */}
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
                        className="absolute dropdown-content menu left-0 w-52 bg-[#f35f81] text-white z-1 p-2 shadow-2xl mt-2"
                        ref={menuRef}
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-[#FFC107] font-bold"
                                  : "hover:text-[#FFC107]"
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

        {/* Navbar End - User Profile & Login */}
        <div className="navbar-end flex items-center ">
          {UsersData ? (
            <div
              className="relative rounded-full border-4 border-white"
              ref={dropdownRef}
            >
              <img
                src={
                  UsersData.profileImage ||
                  "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
                }
                alt="User Avatar"
                className="w-14 h-14 rounded-full cursor-pointer hover:scale-105 "
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              <div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-[280px] bg-white text-black  z-10">
                    <ul>
                      {(roleBasedLinks[UsersData?.role] || []).map((link) => (
                        <Link to={link.path} key={link.name}>
                          <li className="flex py-3 px-5 gap-2 hover:bg-gray-100 border-b border-gray-300">
                            <span className="border-r border-black pr-2">
                              {link.icon}
                            </span>
                            <span>{link.name}</span>
                          </li>
                        </Link>
                      ))}
                      <li
                        className="p-2 py-3 px-5 text-red-500 font-semibold hover:bg-gray-100 flex items-center justify-between"
                        onClick={handleSignOut}
                      >
                        {isLoggingOut ? (
                          "Logging Out..."
                        ) : (
                          <>
                            <ImExit />
                            Logout
                          </>
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/Login">
              <button className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-500 to-blue-300 py-3 px-14 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Drawer Component for Mobile */}
      <div className="drawer drawer-end lg:hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <NavDrawer icon={icon} menuItems={MenuItems} />
      </div>
    </nav>
  );
};

export default Navbar;
