import { Link, useNavigate, useParams } from "react-router";

// Import Background Image
import Background from "../../assets/Error-Background/ErrorBackground.jpg";

// Import Hooks
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Shared/Loading/Loading";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import FetchingError from "../../Shared/Component/FetchingError";

// import Packages
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// import Common Button
import CommonButton from "../../Shared/Buttons/CommonButton";

// Import Icons
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FiClock, FiCalendar } from "react-icons/fi";
import { BsStopwatch } from "react-icons/bs";

// Import dayjs plugins
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const BannedPage = () => {
  const { logOut } = useAuth();

  const axiosPublic = useAxiosPublic();
  const { email } = useParams();
  const navigate = useNavigate();

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

  // Fetch basic user data
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
  } = useQuery({
    queryKey: ["UserData", email],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
  });

  // Fetch trainer data if user is a Trainer
  const {
    data: TrainerData,
    isLoading: TrainerIsLoading,
    error: TrainerError,
  } = useQuery({
    queryKey: ["TrainerData", email],
    enabled: !!UserData && UserData?.role === "Trainer",
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${email}`).then((res) => res.data),
  });

  if (UserIsLoading || (UserData?.role === "Trainer" && TrainerIsLoading))
    return <Loading />;

  if (
    UserError ||
    !UserData ||
    (UserData?.role === "Trainer" && (TrainerError || !TrainerData))
  )
    return <FetchingError />;

  // Access ban info safely (TrainerData assumed to be an array)
  const ban =
    UserData?.role === "Trainer" ? TrainerData?.[0]?.ban : UserData?.ban;

  // Format date nicely or fallback to "N/A"
  const formatDate = (dateStr) =>
    dateStr && dayjs(dateStr).isValid()
      ? dayjs(dateStr).format("MMMM D, YYYY h:mm A")
      : "N/A";

  const calculateTimeLeft = () => {
    if (!ban?.End) return "Indefinite";
    const now = dayjs();
    const end = dayjs(ban.End);
    return end.isAfter(now)
      ? dayjs.duration(end.diff(now)).humanize(true)
      : "Ban expired";
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
      <div className="bg-gradient-to-bl from-black/70 to-black/70 min-h-screen flex items-center justify-center px-4">
        {/* Using div instead of <dialog> for better browser support */}
        <div className="bg-gradient-to-b from-white to-gray-200 text-black shadow-xl rounded-lg max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-red-600 text-center mb-2">
            Access Denied
          </h2>

          <p className="text-center text-sm text-gray-800 mb-4">
            Your account has been banned. If you believe this is a mistake,
            please contact the administrator.
          </p>

          <div className="bg-white rounded-lg border border-red-300 p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-center text-red-600 mb-4 flex items-center justify-center gap-2">
              <HiOutlineExclamationCircle className="text-2xl" />
              Ban Details
            </h3>

            <div className="space-y-3 text-gray-800 text-sm">
              <div className="flex items-start gap-2">
                <HiOutlineExclamationCircle className="text-red-500 mt-0.5" />
                <p>
                  <span className="font-semibold">Reason:</span>{" "}
                  {ban?.Reason || "N/A"}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <BsStopwatch className="text-red-500 mt-0.5" />
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {ban?.Duration || "Indefinite"}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <FiCalendar className="text-red-500 mt-0.5" />
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {formatDate(ban?.Start)}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <FiCalendar className="text-red-500 mt-0.5" />
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {ban?.End ? formatDate(ban.End) : "Indefinite"}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <FiClock className="text-red-500 mt-0.5" />
                <p>
                  <span className="font-semibold">Time Left:</span>{" "}
                  {calculateTimeLeft()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
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
            <CommonButton
              text="Log Out"
              bgColor="OriginalRed"
              textColor="text-white"
              width="[150px]"
              px="px-5"
              py="py-2"
              clickEvent={handleSignOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedPage;
