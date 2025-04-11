import { useParams } from "react-router";

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

// Stripe promise
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

const UserTrainerSessionPayment = () => {
  const axiosPublic = useAxiosPublic();

  // Get id from params
  const { id } = useParams();

  // Fetch Trainer Booking Request By ID Data
  const {
    data: TrainerBookingRequestByIDData,
    isLoading: TrainerBookingRequestByIDIsLoading,
    error: TrainerBookingRequestByIDError,
  } = useQuery({
    queryKey: ["TrainerBookingRequestByID", id],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Booking_Request/${id}`)
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

  console.log(TrainerBookingRequestByIDData);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${UserTrainerManagementBackground})` }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-800/50 min-h-screen">
        <div className="mx-auto max-w-7xl text-black py-2 ">
          {/* Booking Details and Payment Info */}
          <div className="flex py-2 gap-5">
            {/* Details */}
            <div className="bg-white rounded-2xl p-5 w-1/4">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-700 pb-2">
                Booking Summary
              </h2>

              {/* Contents */}
              <div className="text-gray-700 leading-relaxed">
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
            <div className="w-3/4 bg-white">
              <Elements stripe={stripePromise}>
                <div className="py-5">
                  {/* Title Section */}
                  <h2 className="text-xl font-semibold bglinear-to">Payment Information</h2>
                </div>
              </Elements>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="bg-white rounded-2xl px-10 py-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Booked Sessions
            </h2>
            <BookedSessionTable ScheduleByIDData={ScheduleByIDData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerSessionPayment;
