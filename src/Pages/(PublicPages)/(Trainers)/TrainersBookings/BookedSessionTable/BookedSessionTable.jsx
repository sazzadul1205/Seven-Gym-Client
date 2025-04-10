import { useNavigate, useParams } from "react-router";
import { useState, useMemo } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

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

const BookedSessionTable = ({ listedSessions, setListedSessions }) => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { name } = useParams();
  const { user } = useAuth();

  // State for loading and duration
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(1);

  // Group by classType + classPrice, count and subtotal
  const { groups, baseGrandTotal } = useMemo(() => {
    const map = {};
    let total = 0;

    listedSessions.forEach((s) => {
      // Convert classPrice to number for calculations & Handle free sessions and 0 price
      const priceNum =
        s.classPrice === "free" || Number(s.classPrice) === 0
          ? 0
          : Number(s.classPrice);

      // Create a unique key for each classType + classPrice combination
      const key = `${s.classType}-${priceNum}`;

      // Initialize the entry if it doesn't exist
      if (!map[key]) {
        map[key] = {
          classType: s.classType,
          classPrice: priceNum,
          count: 0,
          subtotal: 0,
        };
      }

      // only count paid sessions in totals
      if (priceNum > 0) {
        // Increment count and subtotal for paid sessions
        map[key].count += 1;

        // Add to subtotal and total
        map[key].subtotal += priceNum;

        // Add to grand total
        total += priceNum;
      } else {
        // still track free sessions for display
        map[key].count += 1;
      }
    });

    // Convert map to array and calculate subtotal for each group
    return {
      groups: Object.values(map),
      baseGrandTotal: total,
    };
  }, [listedSessions]);

  // Duration options (in weeks)
  const durations = [1, 2, 4, 12, 24, 36, 48, 52];

  // Adjusted totals based on selected duration
  const adjustedGroups = groups.map((g) => ({
    ...g,
    adjustedSubtotal: g.subtotal * duration,
  }));

  // Calculate grand total based on duration
  const adjustedGrandTotal = baseGrandTotal * duration;

  // Handle booking submission
  const handleRemove = (id) => {
    setListedSessions((prev) => prev.filter((session) => session.id !== id));
  };

  // Handle booking submission
  const handleSubmitBooking = async () => {
    // Confirmation before proceeding
    const confirmation = await Swal.fire({
      title: "Confirm Booking",
      text: "Do you want to submit this booking request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit!",
    });

    if (!confirmation.isConfirmed) return;

    setLoading(true);

    // Prepare formatted date
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const formattedDate =
      `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}T` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Collect all session IDs
    const sessionIds = listedSessions.map((s) => s.id);

    // Prepare payload
    const payload = {
      bookedAt: formattedDate,
      sessions: sessionIds,
      bookerEmail: user?.email,
      trainer: name,
      totalPrice: adjustedGrandTotal.toFixed(2),
      durationWeeks: duration,
      status: "Pending",
    };

    try {
      // Replace with actual request when ready
      const res = await axiosPublic.post("/Trainers_Booking_Request", payload);

      if (res.data?.requestId) {
        await Swal.fire({
          title: "Success!",
          text: "Booking placed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setListedSessions([]);
        navigate("/User/UserTrainerManagement?tab=User-Booking-Session");
      } else {
        throw new Error("Server did not return a valid response.");
      }
    } catch (error) {
      console.error("Booking submission failed:", error);
      await Swal.fire({
        title: "Error",
        text: "Something went wrong while placing the booking.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-b from-gray-500/80 to-gray-500/50 py-5"
      id="billing-section"
    >
      <div className="max-w-7xl mx-auto items-center py-5 px-4 bg-white/80 rounded-xl">
        {/* Title */}
        <h2 className="flex items-center text-xl font-bold text-black mb-2">
          <FaBookmark className="text-green-500 mr-2" />
          Bookings List
        </h2>

        {/* Divider */}
        <div className="h-[1px] bg-black mb-4" />

        {/* Sessions Table */}
        {listedSessions.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:flex">
              <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mb-6">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Code
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Type
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">Time</th>
                    <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                    <th className="px-4 py-2 border-b bg-gray-300">Action</th>
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {listedSessions.map((s, idx) => (
                    <tr key={`${s.id}-${idx}`} className="bg-gray-50">
                      {/* Day */}
                      <td className="px-4 py-2">{s.day}</td>

                      {/* Class Code */}
                      <td className="px-4 py-2">{s.id}</td>

                      {/* Class Type */}
                      <td className="px-4 py-2">{s.classType}</td>

                      {/* Time */}
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(s.start)}
                          </p>
                          <span>-</span>
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(s.end)}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2">{`$ ${s.classPrice}`}</td>

                      {/* Delete Button */}
                      <td className="px-4 py-2">
                        <CommonButton
                          icon={<FaTrash />}
                          iconSize="text-md"
                          bgColor="red"
                          px="px-4"
                          py="py-2"
                          clickEvent={() => handleRemove(s.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col space-y-4 mb-6">
              {listedSessions.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  className={`text-black text-center ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } mb-4 p-4 border-b`}
                >
                  <div className="flex flex-col space-y-2">
                    {/* Time */}
                    <div className="flex justify-between font-semibold">
                      <p>{s.day}</p>[ <span>{formatTimeTo12Hour(s.start)}</span>
                      <span className="px-1">-</span>
                      <span>{formatTimeTo12Hour(s.end)}</span> ]
                    </div>

                    {/* Class Type */}
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-bold">Class Type:</p>
                      {s.classType}
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Price:</p>
                      {s.classPrice === "free" ? "Free" : `$ ${s.classPrice}`}
                    </div>

                    {/* Button */}
                    <div className="flex justify-center">
                      <CommonButton
                        icon={<FaTrash />}
                        iconSize="text-md"
                        bgColor="red"
                        width="full"
                        py="py-2"
                        clickEvent={() => handleRemove(s.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-100 text-black p-4 rounded-lg mb-6">
              {/* Title */}
              <h3 className="text-xl font-semibold mb-2">Pricing Summary</h3>

              {/* Detailed Pricing Info */}
              <ul className="space-y-2 mb-4">
                {adjustedGroups.map(
                  ({ classType, classPrice, count, adjustedSubtotal }) => (
                    <li
                      key={`${classType}-${classPrice}`}
                      className="flex flex-col sm:flex-row justify-between bg-gray-300 hover:bg-gray-400 py-3 px-5 font-semibold rounded-lg"
                    >
                      {/* Class Type and Price Details */}
                      <span className="mb-2 sm:mb-0 text-sm mb:text-md">
                        {classType} (
                        {classPrice > 0 ? `$${classPrice}` : "Free"}) × {count}{" "}
                        × {duration} week{duration > 1 ? "s" : ""}
                      </span>

                      {/* Adjusted Subtotal */}
                      <span className="mt-2 sm:mt-0 flex text-sm mb:text-md justify-end">
                        $ {adjustedSubtotal.toFixed(2)}
                      </span>
                    </li>
                  )
                )}
              </ul>

              {/* Duration Picker Boxes */}
              <div className="flex flex-col md:flex-row md:flex-wrap items-center gap-2 py-3 border-t border-gray-400">
                {/* Duration Picker */}
                <p className="font-semibold">Pick Duration:</p>

                {/* Duration picker Box */}
                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                  {durations.map((w) => (
                    <button
                      key={w}
                      onClick={() => setDuration(w)}
                      className={`px-4 py-2 border rounded cursor-pointer mb-2 sm:mb-0 ${
                        duration === w
                          ? "bg-blue-600 text-white"
                          : "border-3 border-white text-black bg-blue-200 hover:bg-blue-400"
                      }`}
                    >
                      {w} week{w > 1 ? "'s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t pt-3 sm:pt-2">
                <p className="font-medium">Grand Total:</p>
                <p className="text-xl font-bold text-green-600 mt-2 sm:mt-0">
                  $ {adjustedGrandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        ) : (
          // No sessions booked
          <p className="text-center text-gray-500">
            No schedule booked yet. Please select a session.
          </p>
        )}

        {/* Book Session Button */}
        <div className="flex justify-end">
          <CommonButton
            text="Book Session"
            loadingText="Booking..."
            isLoading={loading}
            bgColor="OriginalRed"
            borderRadius="rounded-lg"
            px="px-16"
            py="py-2"
            disabled={listedSessions.length === 0}
            clickEvent={handleSubmitBooking}
          />
        </div>
      </div>
    </div>
  );
};

BookedSessionTable.propTypes = {
  listedSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ).isRequired,
  setListedSessions: PropTypes.func.isRequired,
};

export default BookedSessionTable;
