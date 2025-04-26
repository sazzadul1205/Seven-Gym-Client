import { Link, useNavigate } from "react-router";

// Import Background
import Background from "../../assets/Error-Background/ErrorBackground.jpg";

// Import Auth
import useAuth from "../../Hooks/useAuth";

// Import Swal Alert
import Swal from "sweetalert2";

// Import Button
import CommonButton from "../../Shared/Buttons/CommonButton";

const UnauthorizedPage = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // logOut function
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/Login");
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: `Error logging out: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    }
  };

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gradient-to-bl from-black/70 to-black/70 min-h-screen flex items-center justify-center">
        <dialog id="unauthorized_modal" className="modal" open>
          {/* Modal content container with padding, background gradient, text color, shadow, rounded corners, and fixed width */}
          <div className="modal-box p-6 bg-gradient-to-b from-white to-gray-200 text-black shadow-xl rounded-lg max-w-md">
            {/* Header displaying "Unauthorized Access" in red, bold, and centered */}
            <h2 className="text-2xl font-bold text-red-600 text-center mb-2">
              Unauthorized Access
            </h2>

            {/* Description text giving the user more context, styled smaller and centered */}
            <p className="mb-4 text-sm text-gray-800 text-center ">
              You do not have permission to view this page. Please contact the
              administrator if you believe this is a mistake.
            </p>

            {/* Action buttons container with space between for layout */}
            <div className="modal-action justify-between">
              {/* Home Button */}
              <Link to="/">
                <CommonButton
                  text="Go to Home"
                  bgColor="OriginalRed"
                  textColor="text-white"
                  width="[150px]"
                  px="px-5"
                  py="py-2"
                />
              </Link>

              {/* Login Button */}
              <CommonButton
                text="Login"
                bgColor="OriginalRed"
                textColor="text-white"
                width="[150px]"
                px="px-5"
                py="py-2"
                clickEvent={handleSignOut}
              />
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
