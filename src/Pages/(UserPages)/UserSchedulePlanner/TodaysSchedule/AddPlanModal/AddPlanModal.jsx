/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";

const AddPlanModal = ({ selectedID }) => {
  const [multiHour, setMultiHour] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Extract base ID and initial "From" time
  const baseID = selectedID ? selectedID.split("-").slice(0, -1).join("-") : "";
  const initialFromTime = selectedID ? selectedID.split("-").pop() : "00:00";

  useEffect(() => {
    setValue("from", initialFromTime); // Set "From" value when modal opens
    setValue("to", getNextHour(initialFromTime)); // Default "To" time is +1 hour
  }, [initialFromTime, selectedID, setValue]);

  // Watch "To" time
  const toTime = watch("to");

  // Generate schedule IDs
  const generateScheduleIDs = () => {
    if (!initialFromTime || !toTime || !baseID) return [];

    const fromHour = parseInt(initialFromTime.split(":")[0], 10);
    const toHour = parseInt(toTime.split(":")[0], 10);

    const scheduleIDs = [];

    if (multiHour) {
      if (fromHour >= toHour) return [];
      for (let hour = fromHour; hour <= toHour; hour++) {
        const formattedHour = hour.toString().padStart(2, "0") + ":00";
        scheduleIDs.push(`${baseID}-${formattedHour}`);
      }
    } else {
      scheduleIDs.push(`${baseID}-${initialFromTime}`);
    }

    return scheduleIDs;
  };

  const getNextHour = (time) => {
    const hour = parseInt(time.split(":")[0], 10);
    const nextHour = (hour + 1).toString().padStart(2, "0") + ":00";
    return nextHour;
  };

  const formattedDate = selectedID
    ? selectedID.split("-").slice(1, 5).join("-")
    : "";
  console.log(formattedDate);

  const onSubmit = (data) => {
    const scheduleIDs = generateScheduleIDs();
    console.log(scheduleIDs);

    // Remove `from` and `to` from submission
    // eslint-disable-next-line no-unused-vars
    const { from, to, ...filteredData } = data;

    const planData = {
      ...filteredData,
      status: "planned",
    };

    console.log("Form Data:", planData);
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
          {/* From Time (Fixed) */}
          <div className="w-1/2">
            <label className="block font-bold ml-1">From</label>
            <input
              type="time"
              {...register("from")}
              className="input input-bordered w-full rounded-xl mt-1 bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>

          {/* To Time */}
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

        {/* Submit Button */}
        <div className="modal-action">
          <button
            type="submit"
            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-semibold rounded-lg px-10 py-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlanModal;
