import { useState, useEffect } from "react";

// Import package
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// import icons
import { ImCross } from "react-icons/im";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

const TodaysScheduleAddModal = ({ selectedID, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Local State Hooks
  const [multiHour, setMultiHour] = useState(false);
  const [scheduleIDs, setScheduleIDs] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Deriving base ID from selectedID
  const baseID = selectedID ? selectedID.split("-").slice(0, -1).join("-") : "";

  // Extract initial from-time from selectedIDs
  const initialFromTime = selectedID ? selectedID.split("-").pop() : "00:00";

  // Effect hook to set the initial values for 'from' and 'to' fields based on selectedID
  useEffect(() => {
    setValue("from", initialFromTime);
    setValue("to", getNextHour(initialFromTime));
  }, [initialFromTime, selectedID, setValue]);

  // Watch the 'to' value for changes
  const toTime = watch("to");

  // Function to generate schedule IDs based on selected times
  const generateScheduleIDs = () => {
    if (!initialFromTime || !toTime || !baseID) return [];

    const fromHour = parseInt(initialFromTime.split(":")[0], 10);
    const toHour = parseInt(toTime.split(":")[0], 10);

    const ids = [];
    const times = [];

    if (multiHour) {
      // Prevent invalid time ranges
      if (fromHour >= toHour) return [];

      // Generate schedule IDs for each hour in the range
      for (let hour = fromHour; hour <= toHour; hour++) {
        const formattedHour = hour.toString().padStart(2, "0") + ":00";
        ids.push(`${baseID}-${formattedHour}`);
        times.push(formattedHour);
      }
    } else {
      ids.push(`${baseID}-${initialFromTime}`);
      times.push(initialFromTime);
    }

    // Update the selected times state
    setSelectedTimes(times);
    return ids;
  };

  // useEffect hook to update schedule IDs when multiHour or toTime changes
  useEffect(() => {
    setScheduleIDs(generateScheduleIDs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiHour, toTime]);

  // Helper function to get the next hour based on the selected "from" time
  const getNextHour = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return (hour + 1).toString().padStart(2, "0") + ":00";
  };

  // Use Query to fetch schedule availability based on the generated schedule IDs
  const { data: IndividualPlansIdsData } = useQuery({
    queryKey: ["IndividualPlansIdsData", scheduleIDs],
    queryFn: () =>
      axiosPublic
        .get(
          `/Schedule/SchedulesById?email=${
            user?.email
          }&scheduleIDs=${scheduleIDs.join("&scheduleIDs=")}`
        )
        .then((res) => res.data),
    enabled: scheduleIDs.length > 0,
  });

  // Check if all selected times are available
  const allAvailable =
    scheduleIDs.length > 0 &&
    scheduleIDs.every((scheduleID) =>
      IndividualPlansIdsData?.every(
        (item) => item.id !== scheduleID || !item.title
      )
    );

  // On form submission
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Generate the schedule IDs based on the form data
    const scheduleIDs = generateScheduleIDs();

    if (!scheduleIDs.length) {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "Please check your selected times and try again.",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare the request payload
    const planData = {
      email: user?.email,
      scheduleIDs,
      title: data.title || "",
      notes: data.notes || "",
      location: data.location || "",
      status: "planned",
    };

    try {
      await axiosPublic.put("/Schedule/AddSchedules", planData);
      refetch();
      reset();

      // Close Modal
      document.getElementById("Todays_Schedule_Add_Modal").close();

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Schedule Updated",
        text: "Your schedule has been successfully updated!",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating schedule:", error.response?.data || error);

      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update schedule. Please try again.",
      });
    }

    // End submitting
    setIsSubmitting(false);
  };

  // Helper function to convert time to 12-hour format (AM/PM)
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const amps = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${amps}`;
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Top Section */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Add New Plan :
          {selectedTimes.length > 0 && (
            <span className="ml-3">
              {multiHour
                ? `${convertTo12HourFormat(
                    selectedTimes[0]
                  )} - ${convertTo12HourFormat(
                    selectedTimes[selectedTimes.length - 1]
                  )}`
                : convertTo12HourFormat(selectedTimes[0])}
            </span>
          )}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Todays_Schedule_Add_Modal").close()
          }
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        {/* Title */}
        <div>
          <label className="block font-bold ml-1 mb-2">Title :</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="input input-bordered w-full rounded-lg bg-white border-gray-600"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-bold ml-1 mb-2">Notes</label>
          <textarea
            {...register("notes")}
            className="textarea textarea-bordered w-full rounded-lg bg-white border-gray-600"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-bold ml-1 mb-2">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input input-bordered w-full rounded-lg bg-white border-gray-600"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Multi-Hour Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="multiHour"
            className="checkbox checkbox-primary"
            checked={multiHour}
            onChange={(e) => {
              setMultiHour(e.target.checked);
              if (!e.target.checked) {
                setValue("to", getNextHour(initialFromTime));
              }
            }}
          />
          <label htmlFor="multiHour" className="font-semibold">
            Will this task take more than an hour?
          </label>
        </div>

        {/* Display Selected Time Slots (Only if Multi-Hour is Enabled) */}
        {multiHour && selectedTimes.length > 0 && (
          <div className="space-y-4">
            {/* Duration Selection (From - To) */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-bold ml-1 mb-2">From</label>
                <input
                  type="time"
                  {...register("from")}
                  className="input w-full bg-white border border-gray-600 text-black cursor-not-allowed opacity-75"
                  disabled
                />
              </div>

              {/* To Time */}
              <div className="w-1/2">
                <label className="block font-bold ml-1 mb-2">To</label>
                <input
                  type="time"
                  {...register("to")}
                  step="3600" // Allows only hour selection
                  className={`input w-full bg-white border-gray-600 ${
                    !multiHour ? "bg-gray-200 cursor-not-allowed" : ""
                  }`}
                  disabled={!multiHour}
                  onChange={(e) => {
                    const [hour] = e.target.value.split(":"); // Extract hour
                    setValue("to", `${hour}:00`); // Ensure minutes stay "00"
                  }}
                />
              </div>
            </div>

            {/* Selected Times View Box */}
            <div className="p-3 bg-gray-100 rounded-lg">
              <h4 className="font-bold mb-2">Selected Times:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTimes.map((time, index) => {
                  const scheduleID = `${baseID}-${time}`;
                  const isFull = IndividualPlansIdsData?.some(
                    (item) => item.id === scheduleID && item.title
                  );

                  // Convert 24-hour time to 12-hour AM/PM format
                  const [hour, minute] = time.split(":");
                  let hourNum = parseInt(hour, 10);
                  const period = hourNum >= 12 ? "PM" : "AM";
                  if (hourNum > 12) hourNum -= 12;
                  if (hourNum === 0) hourNum = 12;

                  return (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${
                        isFull
                          ? "bg-red-300 text-red-800"
                          : "bg-green-300 text-green-800"
                      }`}
                    >
                      {`${hourNum}:${minute} ${period}`}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Disabled if any schedule ID is full */}
        <div className="modal-action">
          <button
            type="submit"
            className={`font-semibold rounded-lg px-10 py-3 transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : allAvailable
                ? "bg-linear-to-br from-green-400 to-green-600 hover:bg-linear-to-tl text-gray-100 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!allAvailable || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes Validation
TodaysScheduleAddModal.propTypes = {
  selectedID: PropTypes.string,
  refetch: PropTypes.func.isRequired,
};

export default TodaysScheduleAddModal;
