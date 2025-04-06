import { useEffect, useState } from "react";

// Import icons
import { FaInfo, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import PropTypes from "prop-types";

// Format: "06-04-2025T11:12"
const parseCustomDate = (input) => {
  if (!input) return null;
  const [datePart, timePart] = input.split("T");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

const formatDate = (input) => {
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleString("en-US", options);
};

const getRemainingTime = (input, now) => {
  const startDate = parseCustomDate(input);
  if (!startDate) return "Invalid date";

  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + 7); // 1 week later

  const diff = expiry - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
};

const UserTrainerBookingSession = ({ TrainersBookingRequestData }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, []);

  if (!TrainersBookingRequestData) return null;

  return (
    <div>
      <div className="text-center py-1">
        <h3 className="text-center text-lg font-semibold">Booked Sessions</h3>
        <p className="text-sm text-red-600 italic">
          Note: Booking requests will automatically expire and be removed after
          one week from the time of booking.
        </p>
      </div>

      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      <div className="py-4">
        {TrainersBookingRequestData.length > 0 ? (
          <table className="min-w-full table-auto bg-white border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#A1662F] text-white">
                <th className="px-4 py-2 text-left">Trainer</th>
                <th className="px-4 py-2 text-left">Booked At</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Expires In</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {TrainersBookingRequestData.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-100">
                  {/* Table : Trainer */}
                  <td className="px-4 py-2">{booking.trainer}</td>

                  {/* Table : Booked At */}
                  <td className="px-4 py-2">{formatDate(booking.bookedAt)}</td>

                  {/* Table : Total Price */}
                  <td className="px-4 py-2">$ {booking.totalPrice}</td>

                  {/* Table : Duration Weeks */}
                  <td className="px-4 py-2">{booking.durationWeeks} Weeks</td>

                  {/* Table : Status */}
                  <td className="px-4 py-2">{booking.status}</td>

                  {/* Table : Remaining Time */}
                  <td className="px-4 py-2 font-semibold text-sm">
                    {getRemainingTime(booking.bookedAt, now)}
                  </td>

                  {/* Table : Buttons */}
                  <td className="flex px-4 py-2 gap-2">
                    <button
                      data-tip="View Details"
                      className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() =>
                        document
                          .getElementById("User_Trainer_Booking_Info_Modal")
                          .showModal()
                      }
                    >
                      <FaInfo className="text-green-500" />
                    </button>

                    <button
                      data-tip="Cancel Booking"
                      className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                    >
                      <FaRegTrashAlt className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog id="User_Trainer_Booking_Info_Modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

// Prop Type Validation
UserTrainerBookingSession.propTypes = {
  TrainersBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
};

export default UserTrainerBookingSession;
