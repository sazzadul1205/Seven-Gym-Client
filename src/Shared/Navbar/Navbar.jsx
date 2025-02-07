import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink } from "react-router";
import { IoMenu, IoSettingsOutline } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { AiTwotoneSchedule } from "react-icons/ai";

import Swal from "sweetalert2";

// Assets
import icon from "../../assets/Icon.png";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import Loading from "../Loading/Loading";
import NavDrawer from "./NavDrawer/NavDrawer";

// Menu Items
const menuItems = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/Gallery" },
  {
    name: "Trainers",
    path: "Trainers",
  },
  {
    name: "Classes",
    path: "/Classes",
  },
  { name: "Forums", path: "/Forums" },
  {
    name: "About",
    path: "/About",
    submenu: [
      { name: "Our Mission", path: "/About/OurMission" },
      { name: "Testimonials", path: "/About/Testimonials" },
      { name: "About Us", path: "/About/AboutUs" },
      { name: "Feedback", path: "/About/Feedback" },
    ],
  },
];

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
  const { user, logOut } = useAuth(); // Access user context
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetching data for UsersData
  const {
    data: UsersData,
    isLoading: UsersDataIsLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () => {
      if (!user) {
        return null; // Return null if no user
      }
      return axiosPublic
        .get(`/Users?email=${user.email}`)
        .then((res) => res.data)
        .catch((error) => {
          if (error.response?.status === 404) {
            return null; // Handle 404 as no data found
          }
          throw error; // Rethrow other errors
        });
    },
    enabled: !!user, // Only fetch if user exists
  });

  // Handle scroll and click events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

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

  // Handle submenu hover events
  const handleMouseEnter = (itemName) => {
    setIsHovering(true); // Mark hover as true
    setOpenSubmenu(itemName);
  };

  // Handle submenu hover events
  const handleMouseLeave = () => {
    setIsHovering(false); // Mark hover as false
    setTimeout(() => {
      if (!isHovering) {
        setOpenSubmenu(null); // Close submenu after a short delay
      }
    }, 200); // Adjust the delay here (200ms is the delay)
  };

  // Render NavLink with submenu
  const renderNavLink = (item) => {
    if (item.submenu) {
      return (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.name)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-white hover:text-[#FFC107]">{item.name}</div>
          {openSubmenu === item.name && (
            <ul
              className="absolute dropdown-content menu left-0 w-52 bg-[#f35f81] text-white z-[1] p-2 shadow-2xl mt-2"
              ref={menuRef}
            >
              {item.submenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
                        : "hover:text-[#FFC107]"
                    }
                  >
                    {subItem.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          isActive
            ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
            : "hover:text-[#FFC107]"
        }
      >
        {item.name}
      </NavLink>
    );
  };

  // Handle loading and error states
  if (UsersDataIsLoading) {
    return <Loading />;
  }

  // Handle error state
  if (UsersDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Handle sign out
  const handleSignOut = () => {
    setIsLoggingOut(true); // Start loading state
    logOut()
      .then(() => {
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: `Error logging out: ${error.message}`,
          confirmButtonColor: "#d33",
          timer: 3000,
        });
        console.error("Error signing out:", error);
      })
      .finally(() => {
        setIsLoggingOut(false); // Stop loading state (in case of error)
      });
  };

  // Role-based links
  const roleBasedLinks = {
    Member: [
      {
        name: `${UsersData?.fullName}`,
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

  return (
    <div
      className={`navbar fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#F72C5B]" : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between px-0 lg:px-24">
        {/* Start */}
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

        {/* Middle */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex space-x-4 px-1 text-white font-semibold text-lg">
            {menuItems.map((item) => (
              <li key={item.name}>{renderNavLink(item)}</li>
            ))}
          </ul>
        </div>

        {/* End */}
        <div className="navbar-end flex items-center">
          {UsersData ? (
            // Show the user avatar if user exists
            <div className="relative" ref={dropdownRef}>
              <div className="bg-white p-[3px] rounded-full">
                <img
                  src={
                    UsersData.profileImage ||
                    "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
                  }
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full hover:scale-105 cursor-pointer "
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-[250px] bg-white text-black rounded-lg shadow-lg z-10">
                  <ul>
                    {(roleBasedLinks[UsersData?.role] || []).map((link) => (
                      <Link to={link?.path} key={link?.name}>
                        <li className="flex py-3 px-5 gap-2 hover:bg-gray-100 border-b border-gray-300">
                          <span>{link?.icon}</span> {link?.name}
                        </li>
                      </Link>
                    ))}
                    <li
                      className="p-2 py-3 px-5 hover:bg-gray-100 flex items-center justify-between text-red-500 font-semibold"
                      onClick={handleSignOut}
                    >
                      {isLoggingOut ? (
                        "Logging Out..."
                      ) : (
                        <>
                          Logout <ImExit />
                        </>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Login">
              <button className="bg-blue-400 hover:bg-gradient-to-l from-blue-700 to-blue-400 w-28 md:w-32 text-center py-2 md:py-3 text-white font-semibold">
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
        <NavDrawer icon={icon} menuItems={menuItems} />
      </div>
    </div>
  );
};

export default Navbar;
