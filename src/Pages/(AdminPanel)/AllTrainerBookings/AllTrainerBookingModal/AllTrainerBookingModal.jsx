/* eslint-disable react/prop-types */

// Import Packages
import { useQuery } from "@tanstack/react-query";

// import Icons
import { ImCross } from "react-icons/im";

// Import Hooks
import FetchingError from "../../../../Shared/Component/FetchingError";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";

// Import Utilities
import { getGenderIcon } from "../../../../Utility/getGenderIcon";
import { getTierBadge } from "../../../(TrainerPages)/TrainerProfile/TrainerProfileHeader/TrainerProfileHeader";

// import Components
import BookedSessionTable from "../../../(UserPages)/UserTrainerManagement/UserTrainerBookingSession/UserTrainerBookingInfoModal/BookedSessionTable/BookedSessionTable";
import BookingActivityTable from "../../../(UserPages)/UserTrainerManagement/UserTrainerBookingSession/UserTrainerBookingInfoModal/BookingActivityTable/BookingActivityTable";
import BookingDetails from "./BookingDetails/BookingDetails";

const AllTrainerBookingModal = ({ closeModal, selectedBooking }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Booker Data
  const {
    data: BookerBasicData,
    isLoading: BookerBasicIsLoading,
    error: BookerBasicDataError,
  } = useQuery({
    queryKey: ["BookerBasicData", selectedBooking?.bookerEmail],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${selectedBooking?.bookerEmail}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.bookerEmail,
  });

  // Fetch Booker Data
  const {
    data: TrainerBasicData,
    isLoading: TrainerBasicIsLoading,
    error: TrainerBasicError,
  } = useQuery({
    queryKey: ["TrainerBasic", selectedBooking?.trainerId],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?id=${selectedBooking?.trainerId}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.trainerId,
  });

  // Use selectedBooking.sessions directly
  const sessionQuery =
    selectedBooking?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: ["ScheduleByIDData", selectedBooking?.sessions],
    enabled: !!selectedBooking?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Loading state
  if (
    BookerBasicIsLoading ||
    TrainerBasicIsLoading ||
    ScheduleByIDDataIsLoading
  )
    return <Loading />;

  // Error handling
  if (BookerBasicDataError || TrainerBasicError || ScheduleByIDDataError)
    return <FetchingError />;

  // Get the gender userIcon for the user
  const { icon: userIcon } = getGenderIcon(BookerBasicData?.gender);
  const { icon: trainerIcon } = getGenderIcon(TrainerBasicData?.gender);

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black pb-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Trainer booking Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => closeModal()}
        />
      </div>

      {selectedBooking?.reason && (
        <div className="px-5 py-2 text-red-600 font-semibold italic border-b border-red-300 bg-red-100">
          Reason: {selectedBooking.reason}
        </div>
      )}

      {/* Basic Information : Booker Info , Booking Details */}
      <div className="overflow-auto">
        <div className="flex justify-between bg-gray-200 py-2 px-5 gap-2">
          {/* User Information */}
          <div className=" min-w-1/2">
            {/* Label */}
            <h3 className="font-semibold text-lg border-b ">
              Booker Information :
            </h3>

            {/* Information */}
            <div className="flex gap-5 py-2">
              {/* Image */}
              <img
                src={BookerBasicData?.profileImage || "/default-profile.png"}
                alt={BookerBasicData?.fullName || "Trainer"}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
                loading="lazy"
              />

              {/* Booker Content */}
              <div className="items-center text-left my-auto space-y-1">
                {/* User Name & Gender */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-xl sm:text-2xl font-bold">
                    {BookerBasicData?.fullName || "Unknown Trainer"}
                  </p>
                  {userIcon}
                </div>

                {/* Email */}
                <p className="text-center md:text-left italic text-gray-600">
                  {BookerBasicData?.email || "Email Unavailable"}
                </p>

                {/* Tier Badge */}
                {BookerBasicData?.tier && (
                  <div className="w-full flex justify-center sm:justify-start">
                    <p
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                        BookerBasicData?.tier
                      )}`}
                    >
                      {BookerBasicData?.tier} Tier
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trainer information */}
          <div className="min-w-1/2">
            {/* Label */}
            <h3 className="font-semibold text-lg border-b ">
              Trainer Information :
            </h3>

            {/* Information */}
            <div className="flex gap-5 py-2">
              {/* Image */}
              <img
                src={TrainerBasicData?.imageUrl || "/default-profile.png"}
                alt={TrainerBasicData?.name || "Trainer"}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
                loading="lazy"
              />

              {/* Trainer Content */}
              <div className="items-center text-left my-auto space-y-1">
                {/* User Name & Gender */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-xl sm:text-2xl font-bold">
                    {TrainerBasicData?.name || "Unknown Trainer"}
                  </p>
                  {trainerIcon}
                </div>

                {/* Email */}
                <p className="text-center md:text-left italic text-gray-600">
                  {TrainerBasicData?.specialization || "Email Unavailable"}
                </p>

                {/* Tier Badge */}
                {TrainerBasicData?.tier && (
                  <div className="w-full flex justify-center sm:justify-start">
                    <p
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                        TrainerBasicData?.tier || "None"
                      )}`}
                    >
                      {TrainerBasicData?.tier || "None"} Tier
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <BookingDetails booking={selectedBooking} />

      {/* Sessions Table */}
      <BookedSessionTable ScheduleByIDData={ScheduleByIDData} />

      {/* Activity Table */}
      <BookingActivityTable ScheduleByIDData={ScheduleByIDData} />
    </div>
  );
};

export default AllTrainerBookingModal;
