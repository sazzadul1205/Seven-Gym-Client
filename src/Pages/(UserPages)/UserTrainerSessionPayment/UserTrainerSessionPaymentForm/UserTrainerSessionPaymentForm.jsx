/* eslint-disable react/prop-types */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const UserTrainerSessionPaymentForm = ({ TrainerBookingRequestByIDData }) => {
  const axiosPublic = useAxiosPublic();

  console.log(TrainerBookingRequestByIDData);

  // Get Element & Stripe
  const stripe = useStripe();
  const elements = useElements();

  // Local state for confirmation and processing status
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handle form submission and payment processing
  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
    }

    if (!isConfirmed) {
      return Swal.fire("Error", "Please confirm before paying.", "warning");
    }

    // Ask for final user confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to proceed with the payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    let clientSecret;

    try {
      const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
      if (isNaN(totalPrice)) {
        return Swal.fire("Error", "Invalid total price provided.", "error");
      }

      const res = await axiosPublic.post("/Stripe_Payment_Intent", {
        totalPrice,
      });

      clientSecret = res.data?.clientSecret;
      if (!clientSecret) throw new Error("Client secret missing.");
    } catch (err) {
      console.error("Stripe init error:", err);
      return Swal.fire(
        "Error",
        "Payment setup failed. Try again later.",
        "error"
      );
    }

    setIsProcessing(true);

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
        return Swal.fire("Payment Failed", error.message, "error");
      }

      // ✅ Payment successful
      const stripePaymentID = paymentIntent.id;

      // 1. Update Booking Request
      try {
        await axiosPublic.put(
          `/Trainers_Booking_Request/${TrainerBookingRequestByIDData?._id}`,
          { paid: true, paymentID: stripePaymentID }
        );
      } catch (updateError) {
        console.error("Booking update failed:", updateError);
        return Swal.fire(
          "Payment Success",
          "Booking status update failed. Contact support.",
          "warning"
        );
      }

      // 2. Save Payment Record to Trainer_Session_Payment
      try {
        await axiosPublic.post("/Trainer_Session_Payment", {
          trainerName: TrainerBookingRequestByIDData?.trainer,
          userId: TrainerBookingRequestByIDData?.userId,
          bookingId: TrainerBookingRequestByIDData?._id,
          paymentID: stripePaymentID,
          cardholderName: data.cardholderName,
          amount: Number(TrainerBookingRequestByIDData?.totalPrice),
          currency: "usd",
          status: "paid",
          timestamp: new Date().toISOString(),
        });
      } catch (recordError) {
        console.error("Payment record failed:", recordError);
        // Don’t block user for this failure
      }

      Swal.fire(
        "Success",
        "Payment successful and booking confirmed!",
        "success"
      );
    } catch (err) {
      console.error("Stripe error:", err);
      Swal.fire("Error", "Something went wrong during payment.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="m-2 p-2 rounded-3xl border border-gray-400">
      {/* Title Section */}
      <h2 className="text-xl text-center text-white font-semibold bg-linear-to-bl from-blue-200 to-blue-500 rounded-2xl py-4">
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
            className={`w-1/3 py-3 text-white font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600"
            }`}
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

export default UserTrainerSessionPaymentForm;
