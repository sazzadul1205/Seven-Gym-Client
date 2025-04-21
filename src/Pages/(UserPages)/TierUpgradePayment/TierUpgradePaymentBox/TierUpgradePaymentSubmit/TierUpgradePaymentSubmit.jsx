import { useState } from "react";
import { useParams } from "react-router";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

// Import Utility
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const TierUpgradePaymentSubmit = ({
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

  const generatePaymentID = (userEmail) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    const currentDate = new Date()
      .toLocaleDateString("en-GB") // Format: DD/MM/YYYY
      .split("/")
      .join(""); // Convert to DDMMYYYY format

    return `TUP${currentDate}${userEmail}${randomDigits}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Handle form submission and payment processing
  const onSubmit = async (data) => {
    // This code checks if the Stripe and elements objects are initialized. If either is not ready, it displays an error message using SweetAlert and exits the function to prevent further execution.
    if (!stripe || !elements) {
      Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
      return;
    }

    // This code checks if a plan duration has been selected. If not, it displays an error message using SweetAlert and exits the function.
    if (!selectedDuration) {
      Swal.fire("Error", "Please select a plan.", "error");
      return;
    }

    let clientSecret;
    try {
      const response = await axiosPublic.post("/Stripe_Payment_Intent", {
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

    // Immediately set loading state on first click
    setIsProcessing(true);

    // Customized confirmation prompt using html
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `<p>You are about to spend <strong>${
        selectedDuration?.totalPrice || 0
      }</strong>.</p>
           <p>Are you really sure you want to proceed?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) {
      // User cancelled; clear loading state and exit
      setIsProcessing(false);
      return;
    }

    try {
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
        return;
      }

      const stripePaymentID = paymentIntent.id;

      const startDate = new Date();
      let endDate = new Date(startDate);

      const durationInMonths =
        selectedDuration?.duration === "1 Month"
          ? 1
          : selectedDuration?.duration === "6 Months"
          ? 6
          : selectedDuration?.duration === "12 Months"
          ? 12
          : 0;
      endDate.setMonth(startDate.getMonth() + durationInMonths);

      const paymentID = generatePaymentID(email);
      const todayDateTime = getCurrentDateTime();

      const postPaymentData = {
        tier: CurrentTierData?.name,
        email: email,
        duration: selectedDuration?.duration,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        totalPrice: selectedDuration?.totalPrice,
        paymentID: paymentID,
        stripePaymentID: stripePaymentID,
        paymentMethod: "Card",
        Payed: true,
        dateTime: todayDateTime,
      };

      await axiosPublic.post("/Tier_Upgrade_Payment", postPaymentData);

      setIsPaymentID(paymentID);

      const userUpdateData = {
        email: email,
        tier: CurrentTierData?.name,
        duration: selectedDuration?.duration,
        updateTierStart: formatDate(startDate),
        updateTierEnd: formatDate(endDate),
        linkedReceptID: paymentID,
      };
      await axiosPublic.put("/Users/Update_User_Tier", userUpdateData);

      reset();
      setSelectedDuration(null);
      document.getElementById("Tier_Upgrade_Payment_Finished").showModal();
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire(
        "Error",
        "An error occurred during payment. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
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
          <CommonButton
            type="submit"
            text="Pay Now"
            isLoading={isProcessing} // Shows spinner + loadingText if true
            loadingText="Processing..."
            bgColor="blue" // Or any color in your colorMap (e.g., "indigo", "purple", etc.)
            width="1/3" // Tailwind w-1/3
            borderRadius="rounded-lg"
            py="py-3"
            textColor="text-white"
            disabled={
              !stripe ||
              !elements ||
              isSubmitting ||
              !isConfirmed ||
              isProcessing
            }
          />
        </div>
      </form>
    </div>
  );
};

TierUpgradePaymentSubmit.propTypes = {
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

export default TierUpgradePaymentSubmit;
