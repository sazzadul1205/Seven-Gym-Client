import { useEffect } from "react";

// import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const UserSettingsTestimonials = ({
  UserTestimonialData,
  UsersData,
  refetch,
}) => {
  // Initialize axios hook
  const axiosPublic = useAxiosPublic();

  // Extract the first testimonial (if exists)
  const testimonialData = UserTestimonialData?.[0] || "";

  // useForm hook to manage form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  // Prefill form if testimonial data exists
  useEffect(() => {
    if (testimonialData) {
      // If testimonial exists, set values for the role and quote fields
      setValue("quote", testimonialData.quote);
      setValue("role", testimonialData.role);
    }
  }, [testimonialData, setValue]);

  // Function to handle form submission (for creating or updating a testimonial)
  const onSubmit = async (data) => {
    // Create a payload object with testimonial data
    const TestimonialPayload = {
      role: data.role,
      quote: data.quote,
      createdAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      email: UsersData?.email, // Add user's email
      name: UsersData?.fullName, // Add user's full name
      imageUrl: UsersData.profileImage, // Add user's profile image URL
    };

    // Display a confirmation prompt before submitting
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: testimonialData
        ? "Do you want to update your testimonial?"
        : "Do you want to submit this testimonial?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: testimonialData
        ? "Yes, update it!"
        : "Yes, submit it!",
    });

    // Exit if the user cancels the confirmation
    if (!confirmation.isConfirmed) return;

    try {
      let res;
      // If testimonial data exists, update the existing testimonial
      if (testimonialData) {
        res = await axiosPublic.put(
          `/Testimonials/${testimonialData._id}`,
          TestimonialPayload
        );
      } else {
        // Otherwise, create a new testimonial
        res = await axiosPublic.post("/Testimonials", TestimonialPayload);
      }

      // Handle successful submission or update
      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "Success!",
          text: testimonialData
            ? "Your testimonial has been updated."
            : "Your testimonial has been submitted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        // Reset the form after submission
        reset();
        // Refetch data to update the testimonial list
        refetch();
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch {
      //  Show error alert if something goes wrong
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while submitting your testimonial.",
        icon: "error",
      });
    }
  };

  // Function to handle testimonial deletion
  const handleDelete = async () => {
    // Display confirmation prompt before deleting the testimonial
    const confirmation = await Swal.fire({
      title: "Delete Testimonial?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    // Exit if user cancels deletion
    if (!confirmation.isConfirmed) return;

    try {
      // Perform the deletion request
      const res = await axiosPublic.delete(
        `/Testimonials/${testimonialData._id}`
      );
      if (res.status === 200) {
        Swal.fire({
          title: "Deleted!",
          text: "Your testimonial has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        // Reset the form after deletion
        reset();
        // Refetch data to update the testimonial list
        refetch();
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch {
      // Show error alert if something goes wrong
      Swal.fire({
        title: "Error!",
        text: "Could not delete testimonial.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-36 px-6 py-8 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Header of the testimonial section */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        {testimonialData ? "Update Your Testimonial" : "Share Your Experience"}
      </h2>

      {/* Form for submitting or updating testimonial */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Input Field */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Role (Optional)
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Member, Client, Guest"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            defaultValue={testimonialData?.role || ""}
            {...register("role")} // Register the role input field for form handling
          />
        </div>

        {/* Quote Textarea Field */}
        <div>
          <label
            htmlFor="quote"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Quote or Testimonial
          </label>
          <textarea
            id="quote"
            rows="5"
            placeholder="Tell us what you think..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            defaultValue={testimonialData?.quote || ""}
            {...register("quote", {
              required: "Quote is required", // Ensure the quote is not empty
              minLength: {
                value: 10,
                message: "Quote must be at least 10 characters", // Ensure the quote has a minimum length of 10 characters
              },
            })}
          />
          {errors.quote && (
            <p className="mt-2 text-sm text-red-600">{errors.quote.message}</p> // Display error message if validation fails
          )}
        </div>

        {/* Buttons for submitting and deleting testimonial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Submit/Update Testimonial Button */}
          <CommonButton
            type="submit"
            text={testimonialData ? "Update Testimonial" : "Submit Testimonial"}
            isLoading={isSubmitting}
            loadingText={testimonialData ? "Updating..." : "Submitting..."}
            bgColor="blue"
            textColor="text-white"
            px="px-6"
            py="py-3"
            borderRadius="rounded-lg"
            width="full"
          />

          {/* Delete Testimonial Button (only visible if testimonialData exists) */}
          {testimonialData && (
            <CommonButton
              type="button"
              clickEvent={() => handleDelete()}
              text="Delete"
              bgColor="red"
              textColor="text-white"
              px="px-6"
              py="py-3"
              borderRadius="rounded-lg"
              width="auto"
            />
          )}
        </div>
      </form>
    </div>
  );
};

// Prop Validation
UserSettingsTestimonials.propTypes = {
  UserTestimonialData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.string,
      quote: PropTypes.string,
      createdAt: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      imageUrl: PropTypes.string,
    })
  ),
  UsersData: PropTypes.shape({
    email: PropTypes.string,
    fullName: PropTypes.string,
    profileImage: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsTestimonials;
