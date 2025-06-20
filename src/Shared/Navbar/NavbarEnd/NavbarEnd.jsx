import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// Import Package
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Utility
import useAuth from "../../../Hooks/useAuth";

// Import Icons
import { ImExit } from "react-icons/im";
import { GiUpgrade } from "react-icons/gi";
import { MdDashboard, MdOutlineClass } from "react-icons/md";
import { AiTwotoneSchedule } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { FaStopwatch, FaUser } from "react-icons/fa";

// Import Button
import CommonButton from "../../Buttons/CommonButton";

const NavbarEnd = ({ UsersData }) => {
  const { user, logOut } = useAuth();

  // State variables
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs for handling outside clicks
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

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
      {
        name: "User Class Management",
        path: "/User/UserClassManagement",
        icon: <MdOutlineClass />,
      },
    ],
    Trainer: [
      {
        name: "Trainer Dashboard",
        path: `/Trainer`,
        icon: <MdDashboard />,
      },
    ],
    ClassManager: [{ name: "Dashboard", path: "/ClassManagerDashboard" }],
    Moderator: [{ name: "Moderator Dashboard", path: "/ModeratorDashboard" }],
    Admin: [{ name: "Admin Dashboard", path: "/Admin" }],
  };

  // Logout function
  const handleLogOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setIsLoggingOut(true);
      try {
        const response = await logOut();

        if (response.success) {
          setIsDropdownOpen(false);
        } else {
          throw new Error(response.message);
        }
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
    }
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
      {user ? (
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
              className="absolute right-0 mt-1 min-w-[280px] bg-white text-black z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ul className="py-2">
                {/* Render navigation links based on user role */}
                {(roleBasedLinks[UsersData?.role] || []).map((link) => (
                  <li
                    key={link.name}
                    className="flex py-2 px-5 gap-2 hover:bg-gray-100 border-b border-gray-300"
                  >
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 w-full"
                    >
                      <span className="border-r border-black pr-2">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}

                {/* Logout button */}
                <li
                  className="p-2 py-2 px-5 text-red-500 font-semibold hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                  onClick={handleLogOut}
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
          <CommonButton
            type="button"
            text="Login"
            bgColor="blue"
            px="px-14"
            py="py-3"
            borderRadius="rounded-xl"
            textColor="text-white"
            width="auto"
          />
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
