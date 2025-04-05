import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Utility
import useAuth from "../../../Hooks/useAuth";

// Import Icons
import { ImExit } from "react-icons/im";
import { FaBook, FaStopwatch, FaUser } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { AiTwotoneSchedule } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { MdClass, MdDashboard } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { GrSchedules } from "react-icons/gr";

const NavbarEnd = ({ UsersData }) => {
  // Fetch authentication state and logout function
  const { user, logOut } = useAuth();

  // State variables
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refs for handling outside clicks
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  // Logout function
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logOut();
      window.location.reload();
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
        path: `/User/UserProfile/${user?.email}`,
        icon: <FaUser />,
      },
      {
        name: "Tier Upgrade",
        path: `/User/TierUpgrade/${user?.email}`,
        icon: <GiUpgrade />,
      },
      {
        name: "Schedule Planner",
        path: `/User/UserSchedule/${user?.email}`,
        icon: <AiTwotoneSchedule />,
      },
      {
        name: "Settings",
        path: "/User/UserSettings",
        icon: <IoSettingsOutline />,
      },
      {
        name: "My Trainer Management",
        path: "/User/UserTrainerManagement",
        icon: <FaStopwatch />,
      },
    ],
    Trainer: [
      {
        name: "Trainer Dashboard",
        path: `/Trainer/TrainerDashboard/${user?.email}`,
        icon: <MdDashboard />,
      },
      {
        name: "Trainer Profile",
        path: `/Trainer/TrainerProfile/${user?.email}`,
        icon: <RiProfileLine />,
      },
      {
        name: "Trainer Schedule",
        path: `/Trainer/TrainerSchedule/${user?.email}`,
        icon: <GrSchedules />,
      },
      {
        name: "Trainer Booking Management",
        path: `/Trainer/TrainerBookingManagement/${user?.email}`,
        icon: <FaBook />,
      },
      {
        name: "Trainer Training Management",
        path: `/Trainer/TrainerTrainingManagement/${user?.email}`,
        icon: <MdClass />,
      },
      {
        name: "Trainer Settings",
        path: `/Trainer/TrainingSettings`,
        icon: <MdClass />,
      },
    ],
    ClassManager: [{ name: "Dashboard", path: "/ClassManagerDashboard" }],
    Moderator: [{ name: "Moderator Dashboard", path: "/ModeratorDashboard" }],
    Admin: [
      { name: "Admin Dashboard", path: "/AdminDashboard" },
      { name: "User Management", path: "/UserManagement" },
    ],
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Auto-close dropdown after 5 seconds of inactivity
  useEffect(() => {
    if (isDropdownOpen) {
      timerRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDropdownOpen]);

  // Clear auto-close timer on mouse enter, restart on leave
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1000);
  };

  return (
    <div className="navbar-end flex items-center">
      {/* Show user avatar if logged in, otherwise show login button */}
      {UsersData ? (
        <div
          className="relative rounded-full border-4 border-white"
          ref={dropdownRef}
        >
          {/* User profile picture */}
          <img
            src={
              UsersData?.profileImage ||
              "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
            }
            alt="User Avatar"
            className="w-14 h-14 rounded-full cursor-pointer hover:scale-105"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-[280px] bg-white text-black z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ul>
                {/* Render navigation links based on user role */}
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
                {/* Logout button */}
                <li
                  className="p-2 py-3 px-5 text-red-500 font-semibold hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                  onClick={handleSignOut}
                >
                  {isLoggingOut ? (
                    <>
                      <ImExit className="text-2xl border-r border-black pr-2" />
                      Logging Out...
                    </>
                  ) : (
                    <>
                      <ImExit className="text-2xl border-r border-black pr-2" />
                      Logout
                    </>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        // Show login button if no user data
        <Link to="/Login">
          <button className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-500 to-blue-300 py-3 px-14 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl cursor-pointer">
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

// Define prop types for validation
NavbarEnd.propTypes = {
  UsersData: PropTypes.shape({
    fullName: PropTypes.string,
    profileImage: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default NavbarEnd;
