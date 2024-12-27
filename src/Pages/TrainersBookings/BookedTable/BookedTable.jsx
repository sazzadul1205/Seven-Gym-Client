/* eslint-disable react/prop-types */

import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router"; // Add this import

const BookedTable = ({
  SameTimeData,
  Day,
  listedSessions,
  setListedSessions,
  trainer,
}) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // Use navigate for redirection

  // Get the schedule for the selected day
  const daySchedule = SameTimeData?.schedule?.[Day] || [];

  // Function to handle removing a clicked session
  const handleRemove = (sessionKey) => {
    setListedSessions((prev) =>
      prev.filter((session) => session.key !== sessionKey)
    );
  };

  // Function to calculate the total price for both listed and daySchedule sessions
  const calculateTotalPrice = () => {
    const daySchedulePrice = daySchedule.reduce(
      (total, session) => total + session.price,
      0
    );
    const listedSessionsPrice = listedSessions.reduce(
      (total, session) => total + session.price,
      0
    );
    return daySchedulePrice + listedSessionsPrice;
  };

  // Function to send booking data to the demo link
  const handleSendToDemo = async () => {
    setLoading(true); // Start loading

    const currentTime = new Date().toLocaleString(); // Get the current time
    const totalPrice = calculateTotalPrice();

    // Prepare the payload for sending, including classIdentifiers from both daySchedule and listedSessions
    const data = {
      classIdentifiers: [
        ...daySchedule.map((session) => session.classIdentifier), // Include classIdentifiers from daySchedule
        ...listedSessions.map((session) => session.classIdentifier), // Include classIdentifiers from listedSessions
      ],
      totalPrice,
      userEmail: user?.email,
      trainerName: trainer?.name,
      trainerEmail: trainer?.email,
      currentTime,
    };

    console.log(data);
    try {
      // POST booking data to the backend API at the /Trainers_Booking_Request endpoint
      const response = await axiosPublic.post(
        "/Trainers_Booking_Request",
        data
      );
      console.log(response.data);

      // Success alert with SweetAlert2
      Swal.fire({
        title: "Thank You!",
        text: "Your booking request has been submitted successfully. Please Wait for Trainers Response. Thank you",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset the form or any necessary state
        setListedSessions([]); // Reset the listed sessions after submission

        // Redirect to the previous page after successful submission
        navigate(-1); // This will take the user back to the previous page
      });
    } catch (error) {
      // Error alert with SweetAlert2
      Swal.fire({
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
    <div className="p-4 bg-white max-w-7xl mx-auto my-5 shadow-xl flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Bookings List</h2>

      {/* Original Schedule Section */}
      <div className="mb-6 flex-grow">
        {daySchedule.length > 0 || listedSessions.length > 0 ? (
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left w-1/4">Day</th>
                <th className="px-4 py-2 text-left w-1/4">Class Type</th>
                <th className="px-4 py-2 text-left w-1/4">Time</th>
                <th className="px-4 py-2 text-left w-1/6">Price</th>
                <th className="px-4 py-2 text-left w-1/4">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Display the original schedule (non-removable items) */}
              {daySchedule.map((session, index) => (
                <tr key={`schedule-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{Day}</td>
                  <td className="px-4 py-2">{session.classType}</td>
                  <td className="px-4 py-2">
                    {session.timeStart} - {session.timeEnd || "N/A"}
                  </td>
                  <td className="px-4 py-2">{session.price}</td>
                  <td className="px-4 py-2">
                    <span className="text-gray-400 cursor-not-allowed">
                      Not Removable
                    </span>
                  </td>
                </tr>
              ))}

              {/* Display the listed sessions (removable items) */}
              {listedSessions.map((session, index) => (
                <tr
                  key={`listed-${session.key}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{session.day || Day}</td>
                  <td className="px-4 py-2">{session.classType}</td>
                  <td className="px-4 py-2">
                    {session.timeStart} - {session.timeEnd || "N/A"}
                  </td>
                  <td className="px-4 py-2">{session.price}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemove(session.key)}
                      className="text-red-500 text-lg hover:text-red-700"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            No schedule available for {Day}.
          </p>
        )}
      </div>

      {/* Price Summary Section */}
      {listedSessions.length > 0 || daySchedule.length > 0 ? (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Estimated Total Price Summary
          </h3>
          <div className="flex justify-between">
            <p className="text-gray-700">Total Price:</p>
            <p className="text-xl font-bold text-green-600">
              ${calculateTotalPrice().toFixed(2)}
            </p>
          </div>
        </div>
      ) : null}

      {/* Send to Demo Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSendToDemo}
          className="bg-[#F72C5B] text-white px-4 py-2 rounded-lg hover:bg-[#f72c5b8c]"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Booking Request"}
        </button>
      </div>
    </div>
  );
};

export default BookedTable;
