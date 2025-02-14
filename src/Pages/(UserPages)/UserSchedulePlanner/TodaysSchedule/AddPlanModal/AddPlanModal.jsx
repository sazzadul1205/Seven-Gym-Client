import { useForm } from "react-hook-form";

const AddPlanModal = ({ selectedID }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const planData = {
      status: "planned",
      ...data, // Corrected spreading of form data
    };
    console.log("Form Data:", planData);
  };
  console.log(selectedID);

  return (
    <div className="modal-box p-0">
      <h3 className="font-bold text-lg border-b-2 border-black p-2">Add New Plan</h3>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        {/* Title */}
        <div>
          <label className="block font-medium ml-1">Title :</label>
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
          <label className="block font-medium">Notes</label>
          <textarea
            {...register("notes")}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input input-bordered w-full"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" className="btn">
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlanModal;
