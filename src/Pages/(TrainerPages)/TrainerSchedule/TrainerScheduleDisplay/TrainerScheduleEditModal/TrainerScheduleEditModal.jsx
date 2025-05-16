import { useEffect, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

const TrainerScheduleEditModal = ({
  handleUpdate,
  selectedClass,
  ClassInformation,
  TrainersClassType,
}) => {
  // State Management for toggling the Class Information section
  const [showClassInfo, setShowClassInfo] = useState(false);

  // Form Control
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      classType: selectedClass?.classType || "",
      participantLimit: selectedClass?.participantLimit || 1,
      priceType:
        typeof selectedClass?.classPrice === "string" &&
        selectedClass?.classPrice?.toLowerCase() === "free"
          ? "free"
          : "paid",
      classPrice:
        typeof selectedClass?.classPrice === "string" &&
        selectedClass?.classPrice?.toLowerCase() === "free"
          ? ""
          : selectedClass?.classPrice ?? "",
    },
  });

  // Watch for changes in priceType
  const priceType = watch("priceType");
  const isFree = priceType === "free";

  // Update form if selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      reset({
        classType: selectedClass.classType || "",
        participantLimit: selectedClass.participantLimit || 1,
        priceType:
          typeof selectedClass?.classPrice === "string" &&
          selectedClass.classPrice.toLowerCase() === "free"
            ? "free"
            : "paid",
        classPrice:
          typeof selectedClass?.classPrice === "string" &&
          selectedClass.classPrice.toLowerCase() === "free"
            ? ""
            : selectedClass?.classPrice ?? "",
      });
    }
  }, [selectedClass, reset]);

  // Handle form submission
  const onSubmit = (data) => {
    const updatedClass = {
      ...selectedClass, // Retain existing properties (e.g., day, time, id)
      classType: data.classType,
      participantLimit: Number(data.participantLimit),
      classPrice: data.priceType === "free" ? "Free" : Number(data.classPrice),
    };

    // Pass the updated class back to the parent
    handleUpdate(updatedClass);

    // Close the modal
    document.getElementById("Trainer_Schedule_Edit_Modal")?.close();
  };

  // Filter classes based on TrainersClassType
  const filteredClasses = ClassInformation.filter((item) =>
    TrainersClassType?.includes(item.classType)
  );

  // Check if selectedClass is available
  if (!selectedClass) return null;

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Class Information</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Trainer_Schedule_Edit_Modal")?.close()
          }
        />
      </div>

      {/* Class Details Section */}
      <div className="p-5">
        {/* Class Information Display */}
        <div>
          <label className="block font-bold ml-1 mb-2">Class Information</label>
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-600 py-3 px-2 md:px-5 mb-4 gap-3 rounded-lg">
            {/* Class Information : Day */}
            <div className="flex items-center">
              <p className="pr-3 font-semibold">Class Day:</p>
              <p>{selectedClass?.day}</p>
            </div>

            {/* Class Information : Time */}
            <div className="flex items-center text-black">
              <p className="pr-3 font-semibold">Class Time:</p>
              <p>{formatTimeTo12Hour(selectedClass?.start)}</p>
              <p className="w-4">-</p>
              <p>{formatTimeTo12Hour(selectedClass?.end)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Class Type Selector */}
          <div>
            <label className="block font-bold ml-1 mb-2">Class Type:</label>
            <select
              {...register("classType", { required: "Class Type is required" })}
              className="select select-bordered w-full rounded-lg bg-white border-gray-600"
            >
              {TrainersClassType.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.classType && (
              <p className="text-red-500 text-sm">{errors.classType.message}</p>
            )}
          </div>

          {/* Participant Limit Input */}
          <div>
            <label className="block font-bold ml-1 mb-2">
              Participant Limit:
            </label>
            <input
              type="number"
              {...register("participantLimit", {
                required: "Participant Limit is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              className="input input-bordered w-full rounded-lg bg-white border-gray-600"
            />
            {errors.participantLimit && (
              <p className="text-red-500 text-sm">
                {errors.participantLimit.message}
              </p>
            )}
          </div>

          {/* Price Section */}
          <div>
            <label className="block font-bold ml-1 mb-2">Price:</label>
            <div className="bg-white border border-gray-600 p-3 rounded-lg">
              {/* Radio Buttons for Price Type */}
              <div className="flex justify-center items-center gap-4">
                {/* Is Free Price Type Selector */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="free"
                    {...register("priceType", {
                      required: "Please select a price option",
                    })}
                    checked={isFree}
                    className="mr-2 checkbox checkbox-secondary border border-gray-700"
                  />
                  <span className="pl-2">Is Free</span>
                </label>

                {/* Is Paid Price Type Selector */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="paid"
                    {...register("priceType", {
                      required: "Please select a price option",
                    })}
                    checked={!isFree}
                    className="mr-2 checkbox checkbox-secondary border border-gray-700"
                  />
                  <span className="pl-2">Is Paid</span>
                </label>
              </div>

              {/* Texts */}
              <p className="text-xs text-gray-500">
                Set a price per session (if not free)
              </p>

              {/* Price Input */}
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register("classPrice", {
                    required: !isFree && "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                    valueAsNumber: true,
                  })}
                  className={`input input-bordered w-full rounded-lg bg-white border-gray-700 ${
                    isFree ? "bg-transparent opacity-50 cursor-not-allowed" : ""
                  }`}
                  min="0"
                  disabled={isFree}
                />
              </div>

              {/* Error Message for Price Input */}
              {errors.classPrice && !isFree && (
                <p className="text-red-500 text-sm">
                  {errors.classPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Toggle Class Information Section */}
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Class Information Toggle Button */}
            <div className="flex items-center gap-2">
              <p className="font-semibold">Class Information Details</p>
              <IoMdInformationCircleOutline
                className="text-yellow-500 hover:text-yellow-700 text-2xl cursor-pointer"
                onClick={() => setShowClassInfo(!showClassInfo)}
              />
            </div>

            {/* Sav Button */}
            <button
              type="submit"
              className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Class Information Section */}
        {showClassInfo && (
          <div className="p-2 md:p-4 transition-opacity duration-300 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClasses.map((item, index) => {
                // Extract minimum price from "Paid, $50 - $100 per session"
                let minPrice = 0;
                if (item.priceRange && item.priceRange.includes("Paid")) {
                  const match = item.priceRange.match(/\$(\d+)/); // Extract first price
                  minPrice = match ? parseFloat(match[1]) : 0;
                }

                return (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      reset({
                        classType: item.classType,
                        participantLimit: item.participantLimit || 1,
                        priceType: minPrice === 0 ? "free" : "paid",
                        classPrice: minPrice || "",
                      });
                    }}
                  >
                    <h3 className="text-lg font-bold mb-2">{item.classType}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="mt-2">
                      <span className="font-semibold">Participant Limit:</span>{" "}
                      {item.participantLimit}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold">Price Range:</span>{" "}
                      {item.priceRange || "Not available"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for type checking
TrainerScheduleEditModal.propTypes = {
  handleUpdate: PropTypes.func.isRequired,

  selectedClass: PropTypes.shape({
    id: PropTypes.string,
    classType: PropTypes.string,
    participantLimit: PropTypes.number,
    classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    day: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
  }),

  TrainersClassType: PropTypes.arrayOf(PropTypes.string).isRequired,

  ClassInformation: PropTypes.arrayOf(
    PropTypes.shape({
      classType: PropTypes.string.isRequired,
      description: PropTypes.string,
      participantLimit: PropTypes.number,
      priceRange: PropTypes.string,
    })
  ).isRequired,
};

export default TrainerScheduleEditModal;
