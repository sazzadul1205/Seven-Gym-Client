import { useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Icons
import { FaBookmark, FaTrash } from "react-icons/fa";

// Import Buttons
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const BookedTable = ({ listedSessions }) => {
  // Track Loading State
  const [loading, setLoading] = useState(false);

  const handleSubmitBooking = async () => {
    // Ask for user confirmation first
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this booking request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    });

    // If user cancels, stop the process
    if (!confirmation.isConfirmed) return;

    setLoading(true); // Start loading

    try {
      // Simulated booking submission (replace with actual API call if needed)
      console.log("Booking Data:", listedSessions);

      // Show success alert
      await Swal.fire({
        title: "Thank You!",
        text: "Your booking request has been submitted successfully. Please wait for the trainer's response.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      // Show failure alert
      await Swal.fire({
        title: "Error!",
        text: "There was an error submitting your booking request. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error submitting booking request:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-linear-to-tl from-gray-500/80 to-gray-500/50 py-5">
      <div className="max-w-7xl mx-auto items-center py-5 px-4 bg-white/80 rounded-xl">
        {/* Title */}
        <h2 className="flex items-center text-xl font-bold text-black pb-2 gap-2">
          <FaBookmark className="text-green-500" />
          Bookings List
        </h2>

        <div className="p-[1px] bg-black"></div>

        {/* Original Schedule Section */}
        <div className="pt-1 text-black">
          {listedSessions.length > 0 ? (
            <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black">
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Code</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Type</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Time</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Action</th>
                </tr>
              </thead>

              {/* Table Content */}
              <tbody>
                {Object.entries(listedSessions).map(([index, classDetails]) => {
                  // Class Price
                  const classPrice = classDetails.classPrice
                    ? String(classDetails.classPrice).toLowerCase()
                    : "free";
                  return (
                    <tr
                      key={`listed-${classDetails.id}-${index}`}
                      className=" bg-gray-50"
                    >
                      {/* Day */}
                      <td className="px-4 py-2">{classDetails.day || "N/A"}</td>

                      {/* Code */}
                      <td className="px-4 py-2">{classDetails.id || "N/A"}</td>

                      {/* Class Type */}
                      <td className="px-4 py-2">
                        {classDetails.classType || "N/A"}
                      </td>

                      {/* Time */}
                      <td className=" px-4 py-2">
                        <span className="w-16 md:w-20 text-center">
                          {formatTimeTo12Hour(classDetails.start)}
                        </span>
                        <span className="px-1 lg:px-5">-</span>
                        <span className="w-16 md:w-20 text-center">
                          {formatTimeTo12Hour(classDetails.end)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2">
                        {classPrice === "free"
                          ? "Free"
                          : `$ ${classDetails.classPrice}`}
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-2">
                        <CommonButton
                          icon={<FaTrash />}
                          iconSize="text-md"
                          bgColor="red"
                          px="px-4"
                          py="py-2"
                          // clickEvent={() => handleRemove(listedSessions.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              No schedule Booked yet. Please select a session.
            </p>
          )}
        </div>

        {/* Price Summary Section */}
        {listedSessions.length > 0 ? (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              Estimated Total Price Summary
            </h3>
            <div className="flex justify-between">
              <p className="text-gray-700">Total Price:</p>
              <p className="text-xl font-bold text-green-600">
                {/* ${calculateTotalPrice().toFixed(2)} */}
              </p>
            </div>
          </div>
        ) : null}

        {/* Send to Demo Button */}
        <div className="mt-4 flex justify-end">
          <CommonButton
            text="Book Session"
            loadingText="Booking..."
            isLoading={loading}
            bgColor="OriginalRed"
            borderRadius="rounded-xl"
            px="px-4"
            py="py-2"
            width="[250px]"
            clickEvent={handleSubmitBooking}
          />
        </div>
      </div>
    </div>
  );
};

BookedTable.propTypes = {
  listedSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      day: PropTypes.string,
      classType: PropTypes.string,
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      start: PropTypes.string,
      end: PropTypes.string,
    })
  ).isRequired,
};

export default BookedTable;
