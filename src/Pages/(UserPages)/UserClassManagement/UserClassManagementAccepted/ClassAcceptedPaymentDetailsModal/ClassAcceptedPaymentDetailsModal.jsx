// import Package
import PropTypes from "prop-types";

// Stripe Import
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Import inner Component
import ClassAcceptedPaymentDetailsModalInner from "./ClassAcceptedPaymentDetailsModalInner/ClassAcceptedPaymentDetailsModalInner";

// Stripe public key setup
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

const ClassAcceptedPaymentDetailsModal = ({
  selectedBookingAcceptedData,
  setPaymentSuccessData,
  refetchAll,
}) => {
  // Destructure Data
  const applicantData = selectedBookingAcceptedData;
  return (
    <Elements stripe={stripePromise}>
      <ClassAcceptedPaymentDetailsModalInner
        setPaymentSuccessData={setPaymentSuccessData}
        applicantData={applicantData}
        refetchAll={refetchAll}
      />
    </Elements>
  );
};

// Prop Validation
ClassAcceptedPaymentDetailsModal.propTypes = {
  selectedBookingAcceptedData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  setPaymentSuccessData: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
};

export default ClassAcceptedPaymentDetailsModal;
