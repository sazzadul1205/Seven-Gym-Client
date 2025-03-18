import { useState } from "react";
import { useParams } from "react-router";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

// Import Utility
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TearUpgradePaymentSubmit = ({
  setIsPaymentID,
  CurrentTierData,
  selectedDuration,
  setSelectedDuration,
}) => {
  // Initialize hooks and state
  const axiosPublic = useAxiosPublic();
  const elements = useElements();
  const stripe = useStripe();
  const { email } = useParams();

  // Local state for confirmation and processing status
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Generate a unique payment ID
  const generatePaymentID = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format date as YYYYMMDD
    return `TUP${randomDigits}${currentDate}`;
  };

  // Get current date and time in a human-readable format
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  // Handle form submission and payment processing
  const onSubmit = async (data) => {
    // Validate if Stripe and Elements are ready
    if (!stripe || !elements) {
      Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
      return;
    }

    // Ensure a plan has been selected
    if (!selectedDuration) {
      Swal.fire("Error", "Please select a plan.", "error");
      return;
    }

    // Fetch the client secret from the server for the payment intent
    let clientSecret;
    try {
      const response = await axiosPublic.post("/Create_Payment_Intent", {
        tier: CurrentTierData?.name,
        totalPrice: selectedDuration.totalPrice,
      });
      clientSecret = response.data.clientSecret;
    } catch (error) {
      console.error("Failed to fetch client secret:", error);
      Swal.fire(
        "Error",
        "Failed to initiate payment. Please try again later.",
        "error"
      );
      return;
    }

    // Confirm payment with a confirmation modal
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to spend $${
        selectedDuration?.totalPrice || 0
      }. Proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsProcessing(true); // Mark as processing
        try {
          // Retrieve card details from CardElement and confirm the payment
          const cardElement = elements.getElement(CardElement);
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: { name: data.cardholderName },
              },
            }
          );

          if (error) {
            Swal.fire("Payment Failed", error.message, "error");
          } else if (paymentIntent) {
            // Calculate plan start and end dates
            const startDate = new Date();
            let endDate = new Date(startDate);
            const durationInMonths =
              selectedDuration?.duration === "1 Month"
                ? 1
                : selectedDuration?.duration === "5 Months"
                ? 5
                : selectedDuration?.duration === "12 Months"
                ? 12
                : 0;
            endDate.setMonth(startDate.getMonth() + durationInMonths);

            // Generate payment ID and timestamp
            const paymentID = generatePaymentID();
            const todayDateTime = getCurrentDateTime();

            // Prepare and send payment record to the server
            const postPaymentData = {
              tier: CurrentTierData?.name,
              email: email,
              duration: selectedDuration?.duration,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              totalPrice: selectedDuration?.totalPrice,
              paymentID: paymentID,
              paymentMethod: "Card",
              Payed: true,
              dateTime: todayDateTime,
            };
            await axiosPublic.post("/Tier_Upgrade_Payment", postPaymentData);

            // Update payment ID state for modal display
            setIsPaymentID(paymentID);

            // Prepare and send user tier update data to the server
            const userUpdateData = {
              email: email,
              tier: CurrentTierData?.name,
              duration: selectedDuration?.duration,
              updateTierStart: startDate.toISOString(),
              updateTierEnd: endDate.toISOString(),
            };
            await axiosPublic.put("/Users/Update_User_Tier", userUpdateData);

            // Reset form and clear selected plan
            reset();
            setSelectedDuration(null);
            // Show payment success modal
            document
              .getElementById("Tier_Upgrade_Payment_Finished")
              .showModal();
          }
        } catch (error) {
          console.error("Error processing payment:", error);
          Swal.fire(
            "Error",
            "An error occurred during payment. Please try again.",
            "error"
          );
        } finally {
          setIsProcessing(false); // End processing
        }
      }
    });
  };

  return (
    <div className="w-full bg-white/80 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
      {/* Title Section */}
      <h2 className="text-xl font-semibold text-center bg-linear-to-bl from-blue-300 to-blue-600 text-white rounded-xl mb-4 py-2">
        Payment Information
      </h2>

      {/* Payment Form */}
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Cardholder Name Input */}
        <div>
          <label className="block text-lg font-semibold text-black mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            {...register("cardholderName", {
              required: "Cardholder name is required.",
            })}
            className="w-full bg-white text-black px-4 py-3 border rounded-lg focus:outline-hidden"
            placeholder="Enter cardholder name"
          />
          {errors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardholderName.message}
            </p>
          )}
        </div>

        {/* Card Details Input */}
        <div>
          <label className="block text-lg font-semibold text-black mb-2">
            Card Details
          </label>
          <div className="w-full bg-white text-black px-4 py-3 border rounded-lg">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>

        {/* Payment Confirmation Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmation"
            className="w-5 h-5 cursor-pointer"
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirmation" className="text-sm text-gray-700">
            I am sure I want to proceed with this payment.
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-1/3 py-3 bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
            disabled={
              !stripe ||
              !elements ||
              isSubmitting ||
              !isConfirmed ||
              isProcessing
            }
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

TearUpgradePaymentSubmit.propTypes = {
  setIsPaymentID: PropTypes.func.isRequired,
  CurrentTierData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  selectedDuration: PropTypes.shape({
    duration: PropTypes.string,
    name: PropTypes.string,
    totalPrice: PropTypes.number,
  }),
  setSelectedDuration: PropTypes.func.isRequired,
};

export default TearUpgradePaymentSubmit;
