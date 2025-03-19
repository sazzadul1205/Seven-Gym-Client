import { useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TearResetToBronzeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  const [selectedReason, setSelectedReason] = useState("");
  const [customComplaint, setCustomComplaint] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedReasons = [
    "I no longer need the current plan",
    "It's too expensive",
    "I am unsatisfied with the service",
    "I found a better alternative",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Post the reset request including the downgrade reason details.
      await axiosPublic.post("/resetTier", {
        email,
        tier: "Bronze",
        reason: selectedReason,
        complaint: customComplaint,
      });
      alert(
        "Your tier has been successfully reset to Bronze. Please contact our management staff for further assistance."
      );
      () => document.getElementById("Tear_Reset_To_Bronze_Modal").close();
      navigate(-1);
    } catch (error) {
      alert("Failed to reset tier. Please contact our management staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box bg-gray-100 p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-black text-black pb-2 p-5">
        <h3 className="font-bold text-lg">Reset Tier Plan</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Tear_Reset_To_Bronze_Modal").close()
          }
        />
      </div>

      {/* Modal Description */}
      <p className="py-2 text-black font-semibold px-4 text-center text-lg">
        Please select a reason for downgrading your plan, or add a custom
        complaint below.
      </p>

      {/* Divider */}
      <div className="p-[1px] bg-black w-1/2 mx-auto"></div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="pt-2 px-4 space-y-4">
        {/* Select Reason */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Reason for Downgrading</span>
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="select select-bordered w-full bg-white border-black"
            required
          >
            <option value="" disabled>
              Select a reason
            </option>
            {predefinedReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Complaint */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Custom Complaint (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black"
            placeholder="Type your complaint here..."
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="modal-action py-4 flex justify-end gap-4">
          <button
            type="submit"
            className={`py-3 px-10 cursor-pointer text-white font-semibold rounded-xl transition-all duration-200 shadow-md ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </div>
            ) : (
              "Reset"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TearResetToBronzeModal;
