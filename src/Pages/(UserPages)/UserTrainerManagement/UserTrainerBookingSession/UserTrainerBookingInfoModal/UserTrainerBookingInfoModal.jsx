// import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";

// import Modal & Component
import BookedSessionTable from "./BookedSessionTable/BookedSessionTable";
import UserTrainerBookingInfoModalBasic from "./UserTrainerBookingInfoModalBasic/UserTrainerBookingInfoModalBasic";

// import Utility
import BookingActivityTable from "./BookingActivityTable/BookingActivityTable";

const UserTrainerBookingInfoModal = ({ selectedBooking, closeModal }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Data
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerData", selectedBooking?.trainerId],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers?id=${selectedBooking?.trainerId}`)
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

  // Load management
  if (TrainerDataIsLoading || ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (TrainerDataError || ScheduleByIDDataError) return <FetchingError />;

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black pt-2 md:pt-0 pb-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            // document.getElementById("User_Trainer_Booking_Info_Modal")?.close()
            closeModal()
          }
        />
      </div>

      {selectedBooking?.reason && (
        <div className="px-5 py-2 text-red-600 font-semibold italic border-b border-red-300 bg-red-100">
          Reason: {selectedBooking.reason}
        </div>
      )}

      {/* Basic Information : Trainer Info , Booking Details */}
      <UserTrainerBookingInfoModalBasic
        selectedBooking={selectedBooking}
        SelectedTrainerData={TrainerData}
      />

      {/* Sessions Table */}
      <BookedSessionTable ScheduleByIDData={ScheduleByIDData} />

      {/* Booking Activity Table */}
      <BookingActivityTable ScheduleByIDData={ScheduleByIDData} />
    </div>
  );
};

// Prop Type Validation
UserTrainerBookingInfoModal.propTypes = {
  selectedBooking: PropTypes.shape({
    trainerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // accept anything — safely handle inside the component
    ]),
    sessions: PropTypes.arrayOf(PropTypes.string),
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    bookedAt: PropTypes.string,
    reason: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
};

export default UserTrainerBookingInfoModal;
