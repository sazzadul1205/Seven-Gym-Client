// Import Icons
import { FaPowerOff } from "react-icons/fa";

// Import Shared Button
import CommonButton from "../Shared/Buttons/CommonButton";

// Profile Default Image
import ProfileDefault from "../assets/ProfileDefault.jpg";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const AdminPanelLayout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logout function with confirmation
  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setIsLoggingOut(true);
    try {
      await logOut();
      navigate("/"); // Redirect to home
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

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Header */}
      <div className="flex justify-between items-center bg-gray-200 py-3 px-2 border-b-2 border-black">
        {/* Trainer Profile Picture */}
        <div className="flex gap-2">
          <img
            src={ProfileDefault}
            alt="Trainer Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="text-black">
            <p className="font-semibold">Sazzadul Isloam Molla</p>
            <p className="text-sm font-light">Admin</p>
          </div>
        </div>

        {/* Log out button */}
        <div className="hidden md:flex w-full md:w-auto my-auto justify-end gap-2">
          <CommonButton
            text={isLoggingOut ? "Logging Out..." : "Log Out"}
            clickEvent={handleSignOut}
            bgColor="red"
            py="py-2"
            px="px-10"
            icon={<FaPowerOff />}
            isLoading={isLoggingOut}
            loadingText="Logging Out..."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
