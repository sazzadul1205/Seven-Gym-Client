import { useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Background from "../../../../assets/Home-Background/Home-Background.jpeg";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const Feedback = () => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false); // Loading state

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    const feedbackData = { ...data, submittedAt: new Date().toISOString() };

    try {
      await axiosPublic.post("/Feedback", feedbackData);

      Swal.fire({
        title: "Thank You!",
        text: "Your feedback has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      reset(); // Reset form
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your feedback. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Feedback Form Container */}
      <div className="pt-20">
        <div className="max-w-3xl mx-auto w-full bg-white/90 shadow-lg rounded-lg p-8">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              We Value Your Feedback
            </h2>
            <p className="text-gray-600">
              Help us improve with your valuable input.
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: 2,
                })}
                className={`w-full p-3 border rounded-lg bg-white text-black ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full p-3 border rounded-lg bg-white text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Feedback Textarea */}
            <div>
              <label className="block text-gray-700 font-medium">
                Feedback
              </label>
              <textarea
                placeholder="Share your experience with us"
                rows="4"
                {...register("feedback", {
                  required: "Feedback is required",
                  minLength: 10,
                })}
                className={`w-full p-3 border rounded-lg bg-white text-black ${
                  errors.feedback ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.feedback && (
                <p className="text-red-500 text-sm">
                  {errors.feedback.message}
                </p>
              )}
            </div>

            {/* Rating Selection */}
            <div>
              <label className="block text-gray-700 font-medium">
                Rate Your Experience
              </label>
              <select
                {...register("rating", { required: "Rating is required" })}
                className={`w-full p-3 border rounded-lg bg-white text-black ${
                  errors.rating ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} -{" "}
                    {
                      ["Very Poor", "Poor", "Average", "Good", "Excellent"][
                        num - 1
                      ]
                    }
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-bl hover:bg-gradient-to-tr from-[#F72C5B] to-[#cc0530] text-white rounded-xl shadow-lg hover:shadow-2xl py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
