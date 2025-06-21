import { useState } from "react";
import { ImCross } from "react-icons/im";
import { format, addDays, addMonths, addYears } from "date-fns";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Format date string to "dd-MM-yyyy" for server
const formatDateForServer = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return format(date, "dd-MM-yyyy"); // e.g. "23-04-2025"
};

// Format date string to "MMM d, yyyy" for display
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return format(date, "MMM d, yyyy"); // e.g. "Apr 23, 2025"
};

const ClassAcceptedSetTimeModal = ({
  selectedBookingAcceptedData,
  setSelectedBookingAcceptedData,
  Refetch, // optional, to refresh data after update
}) => {
  const axiosPublic = useAxiosPublic();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const duration =
    selectedBookingAcceptedData?.applicant?.duration?.toLowerCase();

  const handleStartDateChange = (e) => {
    const dateStr = e.target.value;
    setStartDate(dateStr);

    const baseDate = new Date(`${dateStr}T00:00:00`);

    let end;
    switch (duration) {
      case "daily":
        end = addDays(baseDate, 1);
        break;
      case "monthly":
        end = addMonths(baseDate, 1);
        break;
      case "yearly":
        end = addYears(baseDate, 1);
        break;
      default:
        end = baseDate;
    }

    setEndDate(end.toISOString());
  };

  const handleSetTime = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    try {
      await axiosPublic.put(
        `/Class_Booking_Accepted/${selectedBookingAcceptedData._id}`,
        {
          startDate: formatDateForServer(startDate),
          endDate: formatDateForServer(endDate),
        }
      );

      // Reset and close modal
      document.getElementById("Class_Accepted_Set_Time_Modal")?.close();
      setSelectedBookingAcceptedData(null);
      setStartDate("");
      setEndDate("");
      if (Refetch) Refetch();
    } catch (error) {
      console.error("Failed to update booking accepted time:", error);
      // Optionally add error feedback here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 px-5 py-4 bg-white rounded-t-lg">
        <h3 className="font-bold text-lg">Class Accepted Set Time Details</h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={() => {
            document.getElementById("Class_Accepted_Set_Time_Modal")?.close();
            setSelectedBookingAcceptedData(null);
            setStartDate("");
            setEndDate("");
          }}
        />
      </div>

      {/* Body */}
      <div className="px-6 py-2 pb-6 space-y-4">
        {/* Start Date Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Select Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="border px-4 py-2 rounded-lg text-black bg-white shadow"
            disabled={loading}
          />
        </div>

        {/* Date Display */}
        {startDate && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-gray-800 bg-white px-5 py-2">
                <span className="font-semibold">Start:</span>{" "}
                {formatDateForDisplay(startDate)}
              </p>
              <p className="text-gray-800 bg-white px-5 py-2">
                <span className="font-semibold">End:</span>{" "}
                {formatDateForDisplay(endDate)}
              </p>
            </div>

            {/* Set Time Button */}
            <div className="flex justify-end pt-1">
              <CommonButton
                clickEvent={handleSetTime}
                text="Set Time"
                bgColor="green"
                px="px-10"
                py="py-2"
                borderRadius="rounded-lg"
                cursorStyle={loading ? "cursor-not-allowed" : "cursor-pointer"}
                isLoading={loading}
                disabled={loading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassAcceptedSetTimeModal;
