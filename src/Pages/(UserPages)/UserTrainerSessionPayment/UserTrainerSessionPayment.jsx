import { useNavigate, useParams } from "react-router";

// Import Background
import UserTrainerManagementBackground from "../../../assets/User-Trainer-Management-Background/UserTrainerManagementBackground.jpg";

// Import Hooks
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Package
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";

// import Component
import BookedSessionTable from "../UserTrainerManagement/UserTrainerBookingSession/UserTrainerBookingInfoModal/BookedSessionTable/BookedSessionTable";

// Import Utility
import { formatDate } from "../../../Utility/formatDate";

// Import Form
import UserTrainerSessionPaymentForm from "./UserTrainerSessionPaymentForm/UserTrainerSessionPaymentForm";
import { IoMdArrowRoundBack } from "react-icons/io";

// Stripe promise
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

const UserTrainerSessionPayment = () => {
  const axiosPublic = useAxiosPublic();

  // Get id from params
  const { id } = useParams();

  // Hooks
  const navigate = useNavigate();

  // Fetch Trainer Booking Request By ID Data
  const {
    data: TrainerBookingRequestByIDData,
    isLoading: TrainerBookingRequestByIDIsLoading,
    error: TrainerBookingRequestByIDError,
  } = useQuery({
    queryKey: ["TrainerBookingRequestByID", id],
    queryFn: () =>
      axiosPublic
        .get(`/Trainer_Booking_Request?id=${id}`)
        .then((res) => res.data),
  });

  // Use selectedBooking.sessions directly
  const sessionQuery =
    TrainerBookingRequestByIDData?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDIsLoading,
    error: ScheduleByIDError,
  } = useQuery({
    queryKey: ["ScheduleByIDData", TrainerBookingRequestByIDData?.sessions],
    enabled: !!TrainerBookingRequestByIDData?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Loading Handler
  if (TrainerBookingRequestByIDIsLoading || ScheduleByIDIsLoading)
    return <Loading />;

  // Error Handler
  if (TrainerBookingRequestByIDError || ScheduleByIDError)
    return <FetchingError />;

  return (
    <div
      className="min-h-screen items-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${UserTrainerManagementBackground})` }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-800/50 min-h-screen">
        {/* Back Button */}
        <button
          className="flex items-center gap-3 text-xl px-5 py-2 bg-gray-500 hover:bg-gray-500/80 rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack />
          Back
        </button>

        <div className="mx-auto max-w-7xl items-center text-black px-2">
          {/* Booking Details and Payment Info */}
          <div className="flex flex-col sm:flex-row py-5 gap-5">
            {/* Details */}
            <div className="bg-white rounded-2xl p-5 w-full sm:w-2/5">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-700 pb-2">
                Booking Summary
              </h2>

              {/* Contents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 text-gray-700 leading-relaxed">
                {/* Trainer */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Trainer
                  </span>
                  <p className="font-medium text-gray-800 px-5">
                    {TrainerBookingRequestByIDData?.trainer}
                  </p>
                </div>

                {/* Booked By */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Booked By
                  </span>
                  <p className="font-medium text-gray-800 px-5">
                    {TrainerBookingRequestByIDData?.bookerEmail}
                  </p>
                </div>

                {/* Booking Time */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Booked At :
                  </span>
                  <p className="font-medium text-gray-800 px-5">
                    {formatDate(TrainerBookingRequestByIDData?.bookedAt)}
                  </p>
                </div>

                {/* Accepted At */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Accepted At :
                  </span>
                  <p className="font-medium text-gray-800 px-5">
                    {formatDate(
                      TrainerBookingRequestByIDData?.acceptedAt || "Pending"
                    )}
                  </p>
                </div>

                {/* Status */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Status
                  </span>
                  <p
                    className={`font-semibold px-5 ${
                      TrainerBookingRequestByIDData?.status === "Accepted"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {TrainerBookingRequestByIDData?.status}
                  </p>
                </div>

                {/* Duration */}
                <div className="border-b-2 border-gray-200 py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Duration
                  </span>
                  <p className="font-medium text-gray-800 px-5">
                    {TrainerBookingRequestByIDData?.durationWeeks}{" "}
                    {TrainerBookingRequestByIDData?.durationWeeks === 1
                      ? "week"
                      : "weeks"}
                  </p>
                </div>

                {/* Total Price */}
                <div className="py-2">
                  <span className="block font-semibold text-gray-800 py-1">
                    Total Price
                  </span>
                  <p className="font-bold text-lg px-5 text-gray-900">
                    {TrainerBookingRequestByIDData?.totalPrice === "free" ||
                    TrainerBookingRequestByIDData?.totalPrice === "Free"
                      ? "Free"
                      : `$ ${TrainerBookingRequestByIDData?.totalPrice}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <Elements stripe={stripePromise}>
              <UserTrainerSessionPaymentForm
                TrainerBookingRequestByIDData={TrainerBookingRequestByIDData}
              />
            </Elements>
          </div>

          {/* Sessions Table */}
          <div className="bg-white px-5 py-3 rounded-2xl ">
            <BookedSessionTable ScheduleByIDData={ScheduleByIDData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerSessionPayment;
