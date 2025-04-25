import { useState } from "react";
import PropTypes from "prop-types";

// Import Modal
import TierUpgradePaymentPlan from "./TierUpgradePaymentPlan/TierUpgradePaymentPlan";
import TierUpgradePaymentModal from "./TierUpgradePaymentModal/TierUpgradePaymentModal";
import TierUpgradePaymentSubmit from "./TierUpgradePaymentSubmit/TierUpgradePaymentSubmit";

const TierUpgradePaymentBox = ({ CurrentTierData }) => {
  // State variables for tracking the selected plan, confirmation, processing state, and Payment ID
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [PaymentID, setIsPaymentID] = useState(null);

  return (
    <div className="px-1 md:px-4 space-y-5 rounded-lg shadow-xl">
      <TierUpgradePaymentPlan
        CurrentTierData={CurrentTierData}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      {/* Payment information section */}
      <TierUpgradePaymentSubmit
        setIsPaymentID={setIsPaymentID}
        CurrentTierData={CurrentTierData}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      {/* Payment success modal */}
      <dialog id="Tier_Upgrade_Payment_Finished" className="modal">
        <TierUpgradePaymentModal PaymentID={PaymentID} />
      </dialog>
    </div>
  );
};

TierUpgradePaymentBox.propTypes = {
  CurrentTierData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
  }),
};

export default TierUpgradePaymentBox;
