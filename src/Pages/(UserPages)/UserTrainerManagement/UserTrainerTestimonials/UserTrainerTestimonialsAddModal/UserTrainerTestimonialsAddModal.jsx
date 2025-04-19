import { useState } from "react";

// Import InputField
import InputField from "../../../../../Shared/InputField/InputField";

// import Rating
import "@smastrom/react-rating/style.css";
import { Rating } from "@smastrom/react-rating";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const UserTrainerTestimonialsAddModal = ({
  refetch,
  UserBasicData,
  selectedTrainerId,
  setSelectedTrainerId,
}) => {
  const axiosPublic = useAxiosPublic();

  // Rating state (0 to 5 stars)
  const [rating, setRating] = useState(0);

  // Submitting state to prevent duplicate submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const TestimonialPayload = {
      clientAvatar: UserBasicData.profileImage,
      clientName: UserBasicData.fullName,
      testimonial: data.testimonial,
      email: UserBasicData.email,
      rating: rating,
    };

    try {
      const response = await axiosPublic.patch(
        `/Trainers/AddTestimonials/${selectedTrainerId}`,
        TestimonialPayload
      );

      // If testimonial was added successfully
      if (response.data?.message === "Testimonial added successfully!") {
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your testimonial has been submitted.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form and close modal
        reset();
        refetch();
        setRating(0);
        setSelectedTrainerId(null);
        document.getElementById("Add_Trainer_Testimonials")?.close();
      }
    } catch (error) {
      console.error("Testimonial submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-box max-w-2xl p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Leave a Testimonial</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Add_Trainer_Testimonials").close()
          }
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Testimonial Input */}
        <InputField
          label="Testimonial"
          id="testimonial"
          type="textarea"
          hight="30"
          placeholder="Write your feedback here..."
          register={register}
          errors={errors}
          options={{ required: "Testimonial is required" }}
        />

        {/* Star Rating */}
        <div className="flex items-center gap-4">
          <label htmlFor="rating" className="font-medium">
            Your Rating :
          </label>
          <Rating
            style={{ maxWidth: 150 }}
            value={rating}
            onChange={setRating}
            isRequired
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <CommonButton
            text={isSubmitting ? "Submitting..." : "Leave a Testimonial"}
            py="py-2"
            bgColor="TestimonialColor"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

// ✅ PropTypes for strict prop validation
UserTrainerTestimonialsAddModal.propTypes = {
  UserBasicData: PropTypes.shape({
    profileImage: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func,
  selectedTrainerId: PropTypes.string,
  setSelectedTrainerId: PropTypes.func.isRequired,
};

export default UserTrainerTestimonialsAddModal;
