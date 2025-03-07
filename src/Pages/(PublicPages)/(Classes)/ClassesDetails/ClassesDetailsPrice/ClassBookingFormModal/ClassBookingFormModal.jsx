import { useState, useMemo } from "react";

import { ImCross } from "react-icons/im";

import Swal from "sweetalert2";
import PropTypes from "prop-types";

import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const ClassesDetailsModal = ({ ThisModule, user, UsersData }) => {
  const axiosPublic = useAxiosPublic();

  // Local State
  const [agreed, setAgreed] = useState(false);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [understandRisks, setUnderstandRisks] = useState(false);

  // Destructure fees from ThisModule
  const { registrationFee = 0, dailyClassFee = 0 } = ThisModule;

  // Additional Fees
  const equipmentMaintenanceFee = 10; // Example value, adjust as needed
  const facilityMaintenanceFee = 5; // Example value, adjust as needed
  const cleaningFee = 2; // Example value, adjust as needed

  // Memoized Fee Calculation
  const fees = useMemo(() => {
    return {
      daily: dailyClassFee,
      weekly: parseFloat((dailyClassFee * 7 * 0.9).toFixed(2)), // 10% discount
      monthly: parseFloat((dailyClassFee * 30 * 0.7).toFixed(2)), // 30% discount
      yearly: parseFloat((dailyClassFee * 365 * 0.6).toFixed(2)), // 40% discount
    };
  }, [dailyClassFee]);

  // Compute selected duration fee
  const durationFee = fees[duration] || 0;
  const totalAdditionalFees =
    equipmentMaintenanceFee + facilityMaintenanceFee + cleaningFee;

  // Calculate Total Fee Before Discount
  let totalFee = registrationFee + durationFee + totalAdditionalFees;

  // Apply Discount Based on User's Tier
  let discountPercentage = 0;
  switch (UsersData?.tier) {
    case "Silver":
      discountPercentage = 0.05; // 5% Discount
      break;
    case "Gold":
      discountPercentage = 0.1; // 10% Discount
      break;
    case "Diamond":
      discountPercentage = 0.15; // 15% Discount
      break;
    case "Platinum":
      discountPercentage = 0.25; // 25% Discount
      break;
    default:
      discountPercentage = 0; // No discount for Bronze
      break;
  }

  // Calculate Discount and Apply to Total Fee
  const discountAmount = totalFee * discountPercentage;
  totalFee = totalFee - discountAmount;

  // Handles Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!understandRisks) return; // Prevent submission if risks are not acknowledged

    setLoading(true);
    const submittedDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formData = {
      classesName: ThisModule.module,
      duration,
      totalPrice: totalFee,
      submittedDate,
      applicantEmail: user.email,
      applicantName: UsersData.fullName,
      applicantPhone: UsersData.phone,
    };

    try {
      await axiosPublic.post("/Trainers_Booking_Request", formData);

      Swal.fire({
        title: "Thank You!",
        text: "Your booking request has been submitted successfully. Please wait for the trainer's response.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => document.getElementById("Class_Booking_Modal").close());
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your booking request. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error submitting booking request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-5xl mx-auto bg-white rounded-lg shadow-lg modal-box p-6">
      {/* Modal Header */}
      <div className="flex justify-between items-center pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">
          Join Class Form
        </h3>
        <ImCross
          className="text-xl text-black hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Class_Booking_Modal").close()}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="border-t-2 border-black pt-4">
        {/* Duration Selection */}
        <div className="py-2">
          <h3 className="font-semibold text-xl text-black border-b-2 border-gray-800">
            Please Select the Duration
          </h3>
          <div className="grid grid-cols-4 gap-6 py-5">
            {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <div
                key={type}
                onClick={() => setDuration(type)}
                className={`flex flex-col items-center text-center p-2 py-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-110 cursor-pointer ${
                  duration === type
                    ? "bg-linear-to-br from-red-300 to-red-200"
                    : "bg-linear-to-br hover:bg-linear-to-tl from-gray-400 to-gray-300"
                }`}
              >
                <h4 className="text-lg font-semibold text-gray-700">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Class Fee
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${fees[type]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="py-5">
          <h4 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-800">
            Fee Breakdown
          </h4>

          {/* Fee Breakdown */}
          <div className="text-lg text-gray-700 space-y-2 pt-5">
            {[
              { label: "Registration Fee", value: registrationFee },
              {
                label: "Equipment Maintenance Fee",
                value: equipmentMaintenanceFee,
              },
              {
                label: "Facility Maintenance Fee",
                value: facilityMaintenanceFee,
              },
              { label: "Cleaning Fee", value: cleaningFee },
              {
                label: "Class Fee",
                value: durationFee,
                className: "text-red-500",
              },
              {
                label: `Discount (${UsersData?.tier})`,
                value: -discountAmount,
                className: "text-green-500",
              },
            ].map(({ label, value, className }) => (
              <div
                key={label}
                className={`flex justify-between ${className || ""}`}
              >
                <span className="font-semibold">{label}:</span>
                <span>${value.toFixed(2)}</span>
              </div>
            ))}

            <hr className="border-b border-gray-500" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total Fee:</span>
              <span>${totalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="py-5">
          {[
            {
              id: "agree",
              checked: agreed,
              setChecked: setAgreed,
              label: "I agree to the terms and conditions",
            },
            {
              id: "understandRisks",
              checked: understandRisks,
              setChecked: setUnderstandRisks,
              label: "I understand the risks and repercussions",
            },
          ].map(({ id, checked, setChecked, label }) => (
            <div key={id} className="mb-4 flex items-center">
              <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-5 h-5 text-[#F72C5B] border-gray-300 rounded-sm focus:ring-[#F72C5B]"
              />
              <label htmlFor={id} className="ml-2 text-lg text-gray-700">
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !understandRisks}
            className={`${
              loading || !understandRisks
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F72C5B] hover:bg-[#F72C5B]"
            } py-2 px-5 text-white rounded-lg font-semibold`}
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes Validation
ClassesDetailsModal.propTypes = {
  ThisModule: PropTypes.shape({
    registrationFee: PropTypes.number,
    dailyClassFee: PropTypes.number,
    module: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  UsersData: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClassesDetailsModal;
