import { useState } from "react";
import PropTypes from "prop-types";

// Import Modal
import TearUpgradePaymentModal from "./TearUpgradePaymentModal/TearUpgradePaymentModal";
import TearUpgradePaymentPlan from "./TearUpgradePaymentPlan/TearUpgradePaymentPlan";
import TearUpgradePaymentSubmit from "./TearUpgradePaymentSubmit/TearUpgradePaymentSubmit";

const TearUpgradePaymentBox = ({ CurrentTierData }) => {
  // State variables for tracking the selected plan, confirmation, processing state, and Payment ID
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [PaymentID, setIsPaymentID] = useState(null);

  return (
    <div className="px-4 space-y-5 rounded-lg shadow-xl mt-4">
      <TearUpgradePaymentPlan
        CurrentTierData={CurrentTierData}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      {/* Payment information section */}
      <TearUpgradePaymentSubmit
        setIsPaymentID={setIsPaymentID}
        CurrentTierData={CurrentTierData}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      {/* Payment success modal */}
      <dialog id="Tier_Upgrade_Payment_Finished" className="modal">
        <TearUpgradePaymentModal PaymentID={PaymentID} />
      </dialog>
    </div>
  );
};

TearUpgradePaymentBox.propTypes = {
  CurrentTierData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
  }),
};

export default TearUpgradePaymentBox;
