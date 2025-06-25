import { useState } from "react";
import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import { useForm } from "react-hook-form";

const ClassDetailsPricingEditModal = ({ selectedClass, Refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [dailyFee, setDailyFee] = useState(selectedClass?.dailyClassFee || 0);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // React Hook Form setup
  const {
    formState: { errors },
  } = useForm();

  // Fixed additional fees
  const equipmentMaintenanceFee = 10;
  const facilityMaintenanceFee = 5;
  const cleaningFee = 2;
  const fixedFees =
    equipmentMaintenanceFee + facilityMaintenanceFee + cleaningFee;

  // Calculated pricing
  const totalDaily = parseFloat(dailyFee) + fixedFees;
  const totalWeekly = dailyFee * 7 + fixedFees;
  const totalMonthly = dailyFee * 30 + fixedFees;
  const totalYearly = dailyFee * 365 + fixedFees;

  const handleSaveChanges = async () => {
    if (dailyFee < 0) {
      setModalError("Daily fee cannot be negative.");
      return;
    }

    setLoading(true);
    setModalError(null);

    try {
      const { _id, ...rest } = selectedClass;

      const updatedData = {
        ...rest,
        dailyClassFee: parseFloat(dailyFee),
      };

      await axiosPublic.put(`/Class_Details/${_id}`, updatedData);

      document.getElementById("Class_Pricing_Edit_Modal")?.close();
      Refetch?.();
    } catch (error) {
      setModalError(
        error?.response?.data?.message || "Failed to save changes. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit : {selectedClass?.module} Class Key Features
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            document.getElementById("Class_Pricing_Edit_Modal")?.close();
          }}
        />
      </div>

      {/* Show errors if any */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Body */}
      <div className="px-6 pt-6 space-y-4">
        {/* Input */}
        <label className="block text-sm font-semibold text-gray-700">
          Base Daily Class Fee ($)
        </label>
        <input
          type="number"
          min={0}
          value={dailyFee}
          onChange={(e) => setDailyFee(parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        {/* Error Message */}
        {modalError && (
          <p className="text-red-600 text-sm font-medium">{modalError}</p>
        )}

        {/* Calculated Fees Display */}
        <div className="bg-white/80 border border-gray-300 rounded-lg p-4 shadow-inner space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-gray-800">Fixed Add-ons:</span> Equipment ($
            {equipmentMaintenanceFee}), Facility (${facilityMaintenanceFee}),
            Cleaning (${cleaningFee})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-gray-100 rounded-lg font-semibold">
              Daily Total: ${totalDaily.toFixed(2)}
            </div>
            <div className="p-3 bg-gray-100 rounded-lg font-semibold">
              Weekly Total: ${totalWeekly.toFixed(2)}
            </div>
            <div className="p-3 bg-gray-100 rounded-lg font-semibold">
              Monthly Total: ${totalMonthly.toFixed(2)}
            </div>
            <div className="p-3 bg-gray-100 rounded-lg font-semibold">
              Yearly Total: ${totalYearly.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="md:col-span-2 flex justify-end px-6 pb-6">
          <CommonButton
            clickEvent={handleSaveChanges}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

ClassDetailsPricingEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    module: PropTypes.string,
    dailyClassFee: PropTypes.number,
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsPricingEditModal;
