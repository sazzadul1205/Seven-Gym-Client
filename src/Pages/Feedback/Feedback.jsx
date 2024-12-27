import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Background from "../../assets/Background.jpeg";
import { useForm } from "react-hook-form";

const Feedback = () => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm();

  // Getting today's date and time
  const currentDate = new Date().toISOString(); // Date in ISO format (e.g., "2024-12-16T15:30:00.000Z")

  const onSubmit = async (data) => {
    const feedbackData = {
      name: data.name,
      email: data.email,
      feedback: data.feedback,
      rating: data.rating,
      submittedAt: currentDate, // Add current date and time
    };

    try {
      // POST feedback data to the backend API at the /Feedback endpoint
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.post("/Feedback", feedbackData);

      // Success alert with SweetAlert2
      Swal.fire({
        title: "Thank You!",
        text: "Your feedback has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset the form
        reset();
      });

    } catch (error) {
      // Error alert with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your feedback. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
      }}
      className="bg-fixed bg-cover bg-center min-h-screen"
    >
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      <div className="max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-lg shadow-md md:mt-28">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          We Value Your Feedback
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Your feedback helps us improve and provide a better experience for
          you. Please take a moment to share your thoughts.
        </p>

        {isSubmitSuccessful && (
          <div className="bg-green-100 text-green-800 text-center p-4 rounded mb-6">
            Thank you for your feedback! We appreciate it.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Feedback Field */}
          <div>
            <label
              htmlFor="feedback"
              className="block text-gray-700 font-medium mb-2"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.feedback ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
              placeholder="Share your experience with us"
              {...register("feedback", {
                required: "Feedback is required",
                minLength: {
                  value: 10,
                  message: "Feedback must be at least 10 characters",
                },
              })}
            ></textarea>
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* Rating Field */}
          <div>
            <label
              htmlFor="rating"
              className="block text-gray-700 font-medium mb-2"
            >
              Rate Your Experience
            </label>
            <select
              id="rating"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.rating ? "border-red-500" : "border-gray-300"
              }`}
              {...register("rating", { required: "Rating is required" })}
            >
              <option value="">Select a rating</option>
              <option value="1">1 - Very Poor</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#F72C5B] text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:bg-[#d9254d] transition-all"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
