/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const ClassesDetailsModal = ({ ThisModule, user, UsersData }) => {
  const axiosPublic = useAxiosPublic();
  const [duration, setDuration] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [understandRisks, setUnderstandRisks] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  // Calculate fees
  const registrationFee = ThisModule?.registrationFee || 0;
  const dailyClassFee = ThisModule?.dailyClassFee || 0;
  const weeklyClassFee = (dailyClassFee * 7 * 0.9).toFixed(2); // 10% discount
  const monthlyClassFee = (dailyClassFee * 30 * 0.7).toFixed(2); // 30% discount
  const yearlyClassFee = (dailyClassFee * 365 * 0.6).toFixed(2); // 40% discount

  const calculateDurationFee = () => {
    switch (duration) {
      case "daily":
        return parseFloat(dailyClassFee);
      case "weekly":
        return parseFloat(weeklyClassFee);
      case "monthly":
        return parseFloat(monthlyClassFee);
      case "yearly":
        return parseFloat(yearlyClassFee);
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!understandRisks) return; // Prevent submission if risks are not understood

    setLoading(true); // Start loading

    const durationFee = calculateDurationFee();
    const totalPrice = registrationFee + durationFee;

    const submittedDate = new Date().toLocaleString("en-US", {
      hour12: true, // Adjust to 12-hour format (AM/PM)
      weekday: undefined, // Exclude the weekday
      year: "numeric", // Include the year
      month: "2-digit", // Include the month in two digits
      day: "2-digit", // Include the day in two digits
      hour: "2-digit", // Include the hour in two digits
      minute: "2-digit", // Include the minutes in two digits
    });

    const formData = {
      classesName: ThisModule.module,
      duration,
      totalPrice,
      submittedDate,
      applicantEmail: user.email,
      applicantName: UsersData.fullName,
      applicantPhone: UsersData.phone,
    };

    try {
      // POST booking data to the backend API at the /Trainers_Booking_Request endpoint
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.post(
        "/Trainers_Booking_Request",
        formData
      );

      // Success alert with SweetAlert2
      Swal.fire({
        title: "Thank You!",
        text: "Your booking request has been submitted successfully. Please wait for the trainer's response. Thank you.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Optional callback after closing the alert (e.g., close modal or reset form)
        document.getElementById("my_modal_2").close();
      });
    } catch (error) {
      // Error alert with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your booking request. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error submitting booking request:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const durationFee = calculateDurationFee();
  const totalFee = registrationFee + durationFee;

  return (
    <div className="min-w-[1000px] mx-auto bg-white rounded-lg shadow-lg modal-box p-6">
      <form method="dialog" onSubmit={handleSubmit}>
        {/* Top part */}
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Join Class Form
          </h3>
          <ImCross
            className="text-xl hover:text-[#F72C5B]"
            onClick={() => document.getElementById("my_modal_2").close()}
          />
        </div>

        {/* Duration Options */}
        <div className="py-5">
          <h3 className="font-semibold text-xl">Please Select the Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center py-5">
            {/* Registration Fee */}
            <div className="flex flex-col items-center text-center p-2 rounded-lg shadow-2xl bg-red-200 h-[130px]">
              <h4 className="text-lg font-semibold text-gray-700">
                Registration Fee
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${registrationFee.toFixed(2)}
              </p>
            </div>

            {/* Daily Option */}
            <div
              onClick={() => setDuration("daily")}
              className={`flex flex-col items-center text-center p-2 rounded-lg shadow-xl hover:shadow-2xl h-[130px] hover:scale-110 cursor-pointer ${
                duration === "daily" ? "bg-red-200" : "bg-slate-100"
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-700">
                Daily Class Fee
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${dailyClassFee.toFixed(2)}
              </p>
            </div>

            {/* Weekly Option */}
            <div
              onClick={() => setDuration("weekly")}
              className={`flex flex-col items-center text-center p-2 rounded-lg shadow-xl hover:shadow-2xl h-[130px] hover:scale-110 cursor-pointer ${
                duration === "weekly" ? "bg-red-200" : "bg-slate-100"
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-700">
                Weekly Class Fee
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${weeklyClassFee}
              </p>
            </div>

            {/* Monthly Option */}
            <div
              onClick={() => setDuration("monthly")}
              className={`flex flex-col items-center text-center p-2 rounded-lg shadow-xl hover:shadow-2xl h-[130px] hover:scale-110 cursor-pointer ${
                duration === "monthly" ? "bg-red-200" : "bg-slate-100"
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-700">
                Monthly Class Fee
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${monthlyClassFee}
              </p>
            </div>

            {/* Yearly Option */}
            <div
              onClick={() => setDuration("yearly")}
              className={`flex flex-col items-center text-center p-2 rounded-lg shadow-xl hover:shadow-2xl h-[130px] hover:scale-110 cursor-pointer ${
                duration === "yearly" ? "bg-red-200" : "bg-slate-100"
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-700">
                Yearly Class Fee
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${yearlyClassFee}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="py-5">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            Fee Breakdown
          </h4>
          <div className="text-lg text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Registration Fee:</span>
              <span>${registrationFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Class Fee:</span>
              <span>${durationFee.toFixed(2)}</span>
            </div>
            <hr className="border-b border-gray-500" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total Fee:</span>
              <span>${totalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="py-5">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-[#F72C5B] border-gray-300 rounded focus:ring-[#F72C5B]"
            />
            <label htmlFor="agree" className="ml-2 text-lg text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="understandRisks"
              checked={understandRisks}
              onChange={(e) => setUnderstandRisks(e.target.checked)}
              className="w-5 h-5 text-[#F72C5B] border-gray-300 rounded focus:ring-[#F72C5B]"
            />
            <label
              htmlFor="understandRisks"
              className="ml-2 text-lg text-gray-700"
            >
              I understand the risks and repercussions
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!understandRisks || loading}
            onClick={() => document.getElementById("my_modal_2").close()}
            className={`px-6 py-3 ${
              understandRisks && !loading
                ? "bg-[#F72C5B] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } font-bold rounded-lg hover:bg-[#f72c5b83] transition-all`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassesDetailsModal;
