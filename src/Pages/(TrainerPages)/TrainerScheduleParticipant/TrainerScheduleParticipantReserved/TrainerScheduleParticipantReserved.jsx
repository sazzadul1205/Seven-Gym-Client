import { useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icon
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Import Modal & Component
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import TrainerBookingInfoModal from "../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";

// import Utility
import { formatDate } from "../../../../Utility/formatDate";

const TrainerScheduleParticipantReserved = ({ acceptedBookings }) => {
  // State to track which booking is selected to show in modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Ref to control modal visibility using the native <dialog> element
  const modalRef = useRef(null);

  // Function to close the modal and reset selected booking
  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null); // clear selected booking for cleanliness
  };

  // Function: Dummy function to cancel accepted bookings
  const cancelAcceptedBooking = async (Booking) => {
    console.log("Cancel Accepted Booking :", Booking); // Log cancel action
  };

  return (
    <div className="px-5">
      {/* Section Title */}
      <p className="text-xl font-semibold text-black border-b-2 border-gray-700 pb-2">
        Reserved Class Participant
      </p>

      {/* Table to list all accepted bookings */}
      <table className="min-w-full bg-white text-black">
        <thead className="bg-gray-800 text-white text-sm uppercase">
          <tr>
            {[
              "Booker",
              "Booked At",
              "Total Price",
              "Duration",
              "Status",
              "Accepted At",
              "Booker Code",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 border-b border-gray-600 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {acceptedBookings?.map((booking) => (
            <tr
              key={booking._id}
              className={`transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500`}
            >
              {/* Display basic info about the booker */}
              <td className="px-4 py-3 font-medium">
                <TrainerBookingRequestUserBasicInfo
                  email={booking.bookerEmail}
                />
              </td>

              {/* Booking metadata: Time, price, duration, status */}
              <td className="px-4 py-3">{formatDate(booking.bookedAt)}</td>
              <td className="px-4 py-3">$ {booking.totalPrice}</td>
              <td className="px-4 py-3">{booking.durationWeeks} Weeks</td>
              <td className="px-4 py-3 font-bold capitalize">
                {booking.paid ? "Paid" : "Not Paid"}
              </td>
              <td className="px-4 py-3">{formatDate(booking.acceptedAt)}</td>

              {/* Button to trigger modal view of full booking details */}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <>
                    <button
                      id={`view-details-btn-${booking._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => {
                        setSelectedBooking(booking);
                        modalRef.current?.showModal(); // Show modal
                      }}
                    >
                      <FaInfo className="text-yellow-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${booking._id}`}
                      content="View Detailed Booking Info"
                    />
                  </>

                  <>
                    <button
                      id={`cancel-btn-${booking._id}`}
                      className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => cancelAcceptedBooking(booking)}
                    >
                      <ImCross className="text-red-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#cancel-btn-${booking._id}`}
                      content="Cancel Accepted Booking"
                    />
                  </>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog modal to show booking detail info */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Modal"
        className="modal"
      >
        <TrainerBookingInfoModal
          closeModal={closeModal}
          selectedBooking={selectedBooking}
        />
      </dialog>
    </div>
  );
};

TrainerScheduleParticipantReserved.propTypes = {
  acceptedBookings: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      durationWeeks: PropTypes.number.isRequired,
      paid: PropTypes.bool.isRequired,
      acceptedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TrainerScheduleParticipantReserved;
