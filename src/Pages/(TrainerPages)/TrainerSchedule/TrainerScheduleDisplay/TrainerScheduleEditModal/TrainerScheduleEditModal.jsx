/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";

const TrainerScheduleEditModal = ({ selectedClass, TrainersClassType }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      classType: selectedClass?.classType || "",
      participantLimit: selectedClass?.participantLimit || 1,
      isFree:
        typeof selectedClass?.classPrice === "string"
          ? selectedClass.classPrice.toLowerCase() === "free"
          : false,
      classPrice:
        typeof selectedClass?.classPrice === "string"
          ? selectedClass.classPrice.toLowerCase() === "free"
            ? ""
            : selectedClass.classPrice
          : selectedClass?.classPrice ?? "",
    },
  });

  const isFree = watch("isFree"); // Watch for changes in isFree checkbox

  useEffect(() => {
    if (selectedClass) {
      reset({
        classType: selectedClass.classType || "",
        participantLimit: selectedClass.participantLimit || 1,
        isFree:
          typeof selectedClass?.classPrice === "string"
            ? selectedClass.classPrice.toLowerCase() === "free"
            : false,
        classPrice:
          typeof selectedClass?.classPrice === "string"
            ? selectedClass.classPrice.toLowerCase() === "free"
              ? ""
              : selectedClass.classPrice
            : selectedClass?.classPrice ?? "",
      });
    }
  }, [selectedClass, reset]);

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      classPrice: data.isFree ? "Free" : data.classPrice,
    };
    console.log("Updated Class Data:", updatedData);
    document.getElementById("Trainer_Schedule_Edit_Modal")?.close();
  };

  if (!selectedClass) return null;

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Class Information</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Trainer_Schedule_Edit_Modal")?.close()
          }
        />
      </div>
      <div className="p-5">
        <p className="mb-2">Day: {selectedClass.day}</p>
        <p className="mb-2">
          Time: {selectedClass.start} - {selectedClass.end}
        </p>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Class Type Dropdown */}
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

          {/* Participant Limit */}
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
            <div className="">
              <div className="mx-auto flex">
                {/* Check box if free */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("isFree")}
                    className="checkbox border border-black mr-2"
                    onChange={(e) => setValue("isFree", e.target.checked)}
                  />
                  <span>Free</span>
                </div>

                {/* Check box if paid */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox border border-black mr-2"
                    onChange={(e) => setValue("Paid", e.target.checked)}
                  />
                  <span>Free</span>
                </div>
              </div>

              {!isFree && (
                <input
                  type="number"
                  {...register("classPrice", {
                    required: !isFree && "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  className="w-full border border-gray-300 rounded p-2"
                  min="0"
                />
              )}
            </div>
            {errors.classPrice && !isFree && (
              <p className="text-red-500 text-sm">
                {errors.classPrice.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Set a price per session (if not free)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerScheduleEditModal;
