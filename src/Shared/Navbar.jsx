import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import icon from "../assets/Icon.png";
import { IoMenu } from "react-icons/io5";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading/Loading";
import { ImExit } from "react-icons/im";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
  const { user, logOut } = useAuth(); // Access user context
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state
  const menuRef = useRef(null);

  // Fetching data for Users
  const {
    data: Users,
    isLoading: UsersIsLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["Users"],
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
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (itemName) => {
    setIsHovering(true); // Mark hover as true
    setOpenSubmenu(itemName);
  };

  const handleMouseLeave = () => {
    setIsHovering(false); // Mark hover as false
    setTimeout(() => {
      if (!isHovering) {
        setOpenSubmenu(null); // Close submenu after a short delay
      }
    }, 200); // Adjust the delay here (200ms is the delay)
  };

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
  if (UsersIsLoading) {
    return <Loading />;
  }

  if (UsersError) {
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

  return (
    <div
      className={`navbar fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#F72C5B]" : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between lg:px-24">
        {/* Start */}
        <div className="navbar-start flex items-center">
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost lg:hidden drawer-button"
          >
            <IoMenu className="text-2xl" />
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
          {Users ? (
            // Show the user avatar if user exists
            <div className="relative">
              <div className="bg-white p-[3px] rounded-full">
                <img
                  src={
                    Users.profileImage ||
                    "https://i.ibb.co.com/XtrM9rc/Users.jpg"
                  }
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full hover:scale-105 cursor-pointer "
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white text-black rounded-lg shadow-lg z-10 px-2 py-2 ">
                  <ul>
                    <li className="p-2 px-5 hover:bg-gray-100">
                      <Link to="/Profile">Profile</Link>
                    </li>
                    <li className="p-2 px-5 hover:bg-gray-100">
                      <Link to="/Settings">Settings</Link>
                    </li>
                    <li
                      className="p-2 px-5  hover:bg-gray-100 flex items-center justify-between text-red-500 font-semibold"
                      onClick={handleSignOut}
                    >
                      {isLoggingOut ? (
                        <>Logging Out...</>
                      ) : (
                        <>
                          <span>Logout</span>
                          <ImExit />
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
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul
            className="menu text-white h-full w-2/3 max-w-sm p-4 bg-[#F72C5B]"
            style={{ maxWidth: "70%" }}
          >
            <li className="mx-auto">
              <img src={icon} alt="icon" className="w-28" />
            </li>
            {menuItems.map((item) =>
              item.submenu ? (
                <li key={item.name} className="border-slate-700">
                  <details
                    onToggle={(e) => {
                      if (e.target.open) {
                        document
                          .querySelectorAll(".drawer-side details[open]")
                          .forEach((el) => {
                            if (el !== e.target) el.removeAttribute("open");
                          });
                      }
                    }}
                  >
                    <summary className="cursor-pointer">{item.name}</summary>
                    <ul className="pl-4">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
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
                  </details>
                </li>
              ) : (
                <li key={item.name} className="border-slate-400">
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
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
