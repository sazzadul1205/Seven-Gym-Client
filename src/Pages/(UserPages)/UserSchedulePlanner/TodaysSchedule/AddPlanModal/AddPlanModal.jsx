/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const AddPlanModal = ({ selectedID, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [multiHour, setMultiHour] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [scheduleIDs, setScheduleIDs] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const baseID = selectedID ? selectedID.split("-").slice(0, -1).join("-") : "";
  const initialFromTime = selectedID ? selectedID.split("-").pop() : "00:00";

  useEffect(() => {
    setValue("from", initialFromTime);
    setValue("to", getNextHour(initialFromTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedID, setValue]);

  const toTime = watch("to");

  const generateScheduleIDs = () => {
    if (!initialFromTime || !toTime || !baseID) return [];

    const fromHour = parseInt(initialFromTime.split(":")[0], 10);
    const toHour = parseInt(toTime.split(":")[0], 10);

    const ids = [];
    const times = [];

    if (multiHour) {
      if (fromHour >= toHour) return [];
      for (let hour = fromHour; hour <= toHour; hour++) {
        const formattedHour = hour.toString().padStart(2, "0") + ":00";
        ids.push(`${baseID}-${formattedHour}`);
        times.push(formattedHour);
      }
    } else {
      ids.push(`${baseID}-${initialFromTime}`);
      times.push(initialFromTime);
    }

    setSelectedTimes(times);
    return ids;
  };

  // `useEffect` to update `scheduleIDs`
  useEffect(() => {
    setScheduleIDs(generateScheduleIDs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiHour, toTime]);

  const getNextHour = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return (hour + 1).toString().padStart(2, "0") + ":00";
  };

  // ✅ Now use `scheduleIDs` in `useQuery`
  const { data: IndividualPlansIdsData } = useQuery({
    queryKey: ["IndividualPlansIdsData", scheduleIDs], // Make it reactive
    queryFn: () =>
      axiosPublic
        .get(
          `Schedule/SchedulesById?email=${
            user?.email
          }&scheduleIDs=${scheduleIDs.join("&scheduleIDs=")}`
        )
        .then((res) => res.data),
    enabled: scheduleIDs.length > 0, // Prevents fetching when empty
  });

  // Check if all selected times are available
  const allAvailable =
    scheduleIDs.length > 0 &&
    scheduleIDs.every((scheduleID) =>
      IndividualPlansIdsData?.every(
        (item) => item.id !== scheduleID || !item.title
      )
    );

  // On Submit Function
  const onSubmit = async (data) => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Start submitting

    const scheduleIDs = generateScheduleIDs();
    console.log("Generated Schedule IDs:", scheduleIDs);

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
      document.getElementById("Add_Plan_Modal").close();

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Schedule Updated",
        text: "Your schedule has been successfully updated!",
        timer: 3000,
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

    setIsSubmitting(false); // End submitting
  };

  return (
    <div className="modal-box p-0">
      {/* Top Section */}
      <div className="flex justify-between items-center border-b-2 border-black px-5 py-4">
        <h3 className="font-bold text-lg">Add New Plan</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Plan_Modal").close()}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        {/* Title */}
        <div>
          <label className="block font-bold ml-1">Title :</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="input input-bordered w-full rounded-xl mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-bold ml-1">Notes</label>
          <textarea
            {...register("notes")}
            className="textarea textarea-bordered w-full rounded-xl mt-1"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-bold ml-1">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input input-bordered w-full rounded-xl mt-1"
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
                setValue("to", getNextHour(initialFromTime)); // Reset "To" to +1 hour
              }
            }}
          />
          <label htmlFor="multiHour" className="font-semibold">
            Will this task take more than an hour?
          </label>
        </div>

        {/* Duration Selection (From - To) */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-bold ml-1">From</label>
            <input
              type="time"
              {...register("from")}
              className="input input-bordered w-full rounded-xl mt-1 bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="w-1/2">
            <label className="block font-bold ml-1">To</label>
            <input
              type="time"
              {...register("to")}
              className={`input input-bordered w-full rounded-xl mt-1 ${
                !multiHour ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              disabled={!multiHour}
            />
          </div>
        </div>

        {/* Display Selected Time Slots (Only if Multi-Hour is Enabled) */}
        {multiHour && selectedTimes.length > 0 && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <h4 className="font-bold mb-2">Selected Times:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTimes.map((time, index) => {
                const scheduleID = `${baseID}-${time}`;
                const isFull = IndividualPlansIdsData?.some(
                  (item) => item.id === scheduleID && item.title
                );

                return (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${
                      isFull
                        ? "bg-red-300 text-red-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {time}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button - Disabled if any schedule ID is full */}
        <div className="modal-action">
          <button
            type="submit"
            className={`font-semibold rounded-xl px-10 py-2 transition-all duration-300
                  ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : allAvailable
                      ? "bg-gradient-to-br from-green-600 to-green-400 hover:bg-gradient-to-tl text-gray-100 cursor-pointer"
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

export default AddPlanModal;
