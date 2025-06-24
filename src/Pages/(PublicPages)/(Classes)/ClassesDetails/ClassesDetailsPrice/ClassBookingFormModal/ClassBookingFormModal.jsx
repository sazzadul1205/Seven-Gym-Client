import { useState, useMemo } from "react";

// Import Icons
import { ImCross } from "react-icons/im";

// Import PAckages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// import Hooks
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// import Shared
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const ClassesDetailsModal = ({ ThisModule, UsersData }) => {
  const axiosPublic = useAxiosPublic();

  // Form-related state
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("daily");
  const [understandRisks, setUnderstandRisks] = useState(false);

  // Base fee structure
  const { registrationFee = 0, dailyClassFee = 0 } = ThisModule;

  // Fixed additional fees
  const equipmentMaintenanceFee = 10;
  const facilityMaintenanceFee = 5;
  const cleaningFee = 2;

  // Duration-based class fee calculation
  const fees = useMemo(() => {
    const daily = Number(dailyClassFee) || 0;
    return {
      daily: daily,
      weekly: parseFloat((daily * 7).toFixed(2)),
      monthly: parseFloat((daily * 30).toFixed(2)),
      yearly: parseFloat((daily * 365).toFixed(2)),
    };
  }, [dailyClassFee]);

  // Defensive: ensure selected duration is valid
  const validDurations = ["daily", "weekly", "monthly", "yearly"];
  const selectedFeeType = validDurations.includes(duration)
    ? duration
    : "daily";

  // Final duration-based fee
  const durationFee = fees[selectedFeeType];

  // Combine additional fees
  const totalAdditionalFees =
    equipmentMaintenanceFee + facilityMaintenanceFee + cleaningFee;

  // Raw total before discounts
  let totalFee =
    Number(registrationFee) + Number(durationFee) + Number(totalAdditionalFees);

  // Tier-based discount map
  const tierDiscountMap = {
    Silver: 0.05,
    Gold: 0.1,
    Diamond: 0.15,
    Platinum: 0.25,
  };

  // Duration-based additional discount
  const durationExtraDiscountMap = {
    weekly: 0.005, // 0.5%
    monthly: 0.01, // 1%
    yearly: 0.015, // 1.5%
  };

  // Calculate discount
  const tierDiscount = tierDiscountMap[UsersData?.tier] || 0;
  const extraDiscount = durationExtraDiscountMap[selectedFeeType] || 0;
  const totalDiscountRate = tierDiscount + extraDiscount;
  const discountAmount = totalFee * totalDiscountRate;

  // Final fee after all discounts
  totalFee = parseFloat((totalFee - discountAmount).toFixed(2));

  // Submit booking request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!understandRisks) return;

    setLoading(true);

    // Generate submission timestamp
    const submittedDate = new Date().toLocaleString();

    // Payload to send
    const Payload = {
      classesName: ThisModule.module,
      duration,
      totalPrice: totalFee,
      submittedDate,
      applicantData: {
        Userid: UsersData._id,
        email: UsersData.email,
        name: UsersData.fullName,
        phone: UsersData.phone,
      },
    };

    try {
      // Send to API
      await axiosPublic.post("/Class_Booking_Request", Payload);

      // Success toast
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your booking request has been submitted successfully. Please wait for the trainer's response.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      document.getElementById("Class_Booking_Modal").close();
    } catch (error) {
      console.error("Error submitting booking request:", error);
      // Error fallback
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error submitting your booking request. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-full md:max-w-4xl p-4 md:p-6 bg-gradient-to-b from-white to-gray-300 text-black rounded-lg mx-2 md:mx-auto">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-4 py-3 md:px-5 md:py-4">
        <h3 className="font-bold text-lg md:text-xl truncate">
          Join Class Form ( {ThisModule.module} )
        </h3>

        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Class_Booking_Modal").close()}
        />
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {/* Duration Selector */}
        <>
          <h3 className="font-semibold text-xl text-center py-2">
            Please Select the Duration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-2 px-4 md:px-5">
            {validDurations.map((type) => (
              <div
                key={type}
                onClick={() => setDuration(type)}
                className={`flex flex-col items-center text-center p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer select-none ${
                  duration === type
                    ? "bg-gradient-to-tr hover:bg-gradient-to-bl from-red-100 to-red-300 border-2 border-red-500"
                    : "bg-gradient-to-tr hover:bg-gradient-to-bl from-white to-gray-300 border-2 border-white hover:border-red-500"
                }`}
              >
                <h4 className="text-lg font-semibold text-black capitalize truncate">
                  {type} Class Fee
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${fees[type].toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </>

        {/* Fee Breakdown Section */}
        <>
          <h3 className="font-semibold text-xl text-center py-2">
            Fee Breakdown
          </h3>

          <div className="text-lg text-gray-700 space-y-3 pt-4 px-4 md:px-5 py-2">
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
              { label: "Class Fee", value: durationFee },
              {
                label: `Discount (${UsersData?.tier || "None"}${
                  extraDiscount
                    ? ` + ${Math.round(extraDiscount * 1000) / 10}%`
                    : ""
                })`,
                value: -discountAmount,
                className: "text-green-600",
              },
            ].map(({ label, value, className }) => (
              <div
                key={label}
                className={`flex flex-col sm:flex-row sm:items-center justify-between ${
                  className || ""
                }`}
              >
                <p className="font-semibold text-black">{label}</p>
                <div className="hidden md:flex flex-grow border-b border-dotted border-gray-500 mx-0 sm:mx-3 my-1 sm:my-0"></div>
                <p className="font-semibold text-black flex justify-end">
                  ${Number(value).toFixed(2)}
                </p>
              </div>
            ))}

            <hr className="border-b border-gray-500 my-3" />
            <div className="flex justify-between font-bold text-gray-900 text-lg">
              <span>Total Fee:</span>
              <span>${totalFee.toFixed(2)}</span>
            </div>
          </div>
        </>

        {/* Terms & Submit */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-5 py-3 space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-3 md:space-y-1">
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
              <label
                key={id}
                className="flex items-center gap-2 cursor-pointer select-none text-lg font-semibold text-black"
              >
                <input
                  type="checkbox"
                  id={id}
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="w-5 h-5 text-[#F72C5B] border-gray-300 rounded-sm focus:ring-[#F72C5B]"
                  required
                />
                {label}
              </label>
            ))}
          </div>

          <CommonButton
            type="submit"
            text="Submit Request"
            isLoading={loading}
            loadingText="Processing..."
            disabled={typeof string === "string" || !understandRisks}
            bgColor="OriginalRed"
            px="px-10 md:px-16"
            py="py-3"
            textColor="text-white"
            borderRadius="rounded-lg"
            width="auto"
            className="self-center"
          />
        </div>
      </form>
    </div>
  );
};

// Props Validation
ClassesDetailsModal.propTypes = {
  ThisModule: PropTypes.shape({
    registrationFee: PropTypes.number.isRequired,
    dailyClassFee: PropTypes.number.isRequired,
    module: PropTypes.string.isRequired,
  }).isRequired,
  UsersData: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClassesDetailsModal;
