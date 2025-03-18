/* eslint-disable react/prop-types */
import { useParams } from "react-router";
import { useState } from "react";

// Import Packages
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Import Utility
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modal
import TearUpgradePaymentModal from "./TearUpgradePaymentModal/TearUpgradePaymentModal";
import TearUpgradePaymentPlan from "./TearUpgradePaymentPlan/TearUpgradePaymentPlan";

const TearUpgradePaymentBox = ({ CurrentTierData }) => {
  // Initialize hooks and state
  const axiosPublic = useAxiosPublic();
  const elements = useElements();
  const { email } = useParams();
  const stripe = useStripe();

  // State variables for tracking the selected plan, confirmation, processing state, and Payment ID
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [PaymentID, setIsPaymentID] = useState(null);

  // Setup for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Function to generate a unique payment ID
  const generatePaymentID = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format date as YYYYMMDD
    return `TUP${randomDigits}${currentDate}`;
  };

  // Function to get the current date and time in a readable format
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // Localized date and time format
  };

  // Handle form submission and payment processing
  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
      return;
    }

    if (!selectedDuration) {
      Swal.fire("Error", "Please select a plan.", "error");
      return;
    }

    // Fetch the client secret when user submits the payment form
    let clientSecret;
    try {
      const response = await axiosPublic.post("/Create_Payment_Intent", {
        tier: CurrentTierData?.name, // Tier name
        totalPrice: selectedDuration.totalPrice, // Total price based on duration
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

    // Confirm payment with the user
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
          const cardElement = elements.getElement(CardElement);
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: { name: data.cardholderName }, // Cardholder's name
              },
            }
          );

          if (error) {
            Swal.fire("Payment Failed", error.message, "error");
          } else if (paymentIntent) {
            // Calculate start and end date for the selected duration
            const startDate = new Date(); // Start date
            let endDate = new Date(startDate);

            // Determine the duration in months based on selected plan
            const durationInMonths =
              selectedDuration?.duration === "1 Month"
                ? 1
                : selectedDuration?.duration === "5 Months"
                ? 5
                : selectedDuration?.duration === "12 Months"
                ? 12
                : 0;

            endDate.setMonth(startDate.getMonth() + durationInMonths); // Adjust end date

            const paymentID = generatePaymentID(); // Unique payment ID
            const todayDateTime = getCurrentDateTime(); // Current date-time

            // Prepare data to send to the server for payment record
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

            // Send payment data to the server
            await axiosPublic.post("/Tier_Upgrade_Payment", postPaymentData);

            // Log the payment ID
            setIsPaymentID(paymentID);

            // Prepare data to update user tier
            const userUpdateData = {
              email: email,
              tier: CurrentTierData?.name,
              duration: selectedDuration?.duration,
              updateTierStart: startDate.toISOString(),
              updateTierEnd: endDate.toISOString(),
            };

            // Send user tier update data to the server
            await axiosPublic.put("/Users/Update_User_Tier", userUpdateData);

            reset(); // Reset the form
            setSelectedDuration(null); // Clear selected plan
            document.getElementById("Payment_Finished").showModal(); // Show success modal
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
    <div className="px-4 space-y-5 rounded-lg shadow-xl mt-4">
      <TearUpgradePaymentPlan
        CurrentTierData={CurrentTierData}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      {/* Payment information section */}
      <div className="w-full bg-white/80 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
        <h2 className="text-xl font-semibold text-center bg-linear-to-bl from-blue-300 to-blue-600 text-white rounded-xl mb-4 py-2">
          Payment Information
        </h2>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Cardholder name input */}
          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              {...register("cardholderName", {
                required: "Cardholder name is required.",
              })}
              className="w-full bg-white text-black px-4 py-3 border rounded-lg focus:outline-hidden "
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardholderName.message}
              </p>
            )}
          </div>

          {/* Card details input */}
          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Card Details
            </label>
            <div className="w-full bg-white text-black px-4 py-3 border rounded-lg">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>

          {/* Confirmation checkbox */}
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

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300"
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
        </form>
      </div>

      {/* Payment success modal */}
      <dialog id="Payment_Finished" className="modal">
        <TearUpgradePaymentModal PaymentID={PaymentID} />
      </dialog>
    </div>
  );
};

export default TearUpgradePaymentBox;
