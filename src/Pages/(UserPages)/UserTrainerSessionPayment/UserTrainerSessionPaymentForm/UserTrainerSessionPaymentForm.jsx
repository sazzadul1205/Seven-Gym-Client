/* eslint-disable react/prop-types */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const UserTrainerSessionPaymentForm = ({ TrainerBookingRequestByIDData }) => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

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

  const date = new Date();
  const formattedDateAndTime = `${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}T${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  // Handle form submission and payment processing
  const onSubmit = async (data) => {
    // Step 1: Check if Stripe and Elements are ready
    if (!stripe || !elements) {
      return Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
    }

    // Step 2: Ensure the user has confirmed the payment
    if (!isConfirmed) {
      return Swal.fire("Error", "Please confirm before paying.", "warning");
    }

    // Step 3: Ask the user for final confirmation before proceeding with payment
    const confirmPayment = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to proceed with the payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "Cancel",
    });

    if (!confirmPayment.isConfirmed) return;

    let clientSecret;

    // Get Price
    const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);

    // Step 4: Check if the total price is valid
    if (isNaN(totalPrice)) {
      return Swal.fire("Error", "Invalid total price provided.", "error");
    }

    // Start Button Load State
    setIsProcessing(true);

    // Step 5: Initialize Stripe payment
    try {
      const res = await axiosPublic.post("/Stripe_Payment_Intent", {
        totalPrice,
      });

      // get Client secret
      clientSecret = res.data?.clientSecret;

      // client secret not available
      if (!clientSecret) throw new Error("Client secret missing.");

      // Error Part
    } catch (err) {
      console.error("Stripe init error:", err);
      return Swal.fire(
        "Error",
        "Payment setup failed. Try again later.",
        "error"
      );
    }

    try {
      // Step 6: Confirm card payment
      const cardElement = elements.getElement(CardElement);

      // Stripe Payment Intent
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: data.cardholderName },
          },
        }
      );

      // Step 7: Handle payment failure
      if (error) {
        return Swal.fire("Payment Failed", error.message, "error");
      }

      // Get Stripe Payment Id
      const stripePaymentID = paymentIntent.id;

      // Step 8: Build payload for accepted booking
      const sessionAcceptedPayload = {
        ...TrainerBookingRequestByIDData,
        paid: true,
        paidAt: formattedDateAndTime,
        paymentID: stripePaymentID,
      };

      // Step 9: Update booking as accepted
      try {
        const TrainerBookingAcceptRes = await axiosPublic.post(
          "/Trainer_Booking_Accepted",
          sessionAcceptedPayload
        );

        // Get Trainer Booking Accepted Data
        const updatedSessionInfo = TrainerBookingAcceptRes.data;

        // Step 10: Prepare payment payload
        const paymentPayload = {
          sessionInfo: {
            ...updatedSessionInfo,
          },
          cardHolder: data.cardholderName,
          paymentMethod: "Card",
          stripePaymentID,
        };

        try {
          // Step 11: Post payment info
          await axiosPublic.post("/Trainer_Session_Payment", paymentPayload);

          Swal.fire(
            "Success",
            "Payment successful and booking confirmed!",
            "success"
          );

          // ✅ Step 12: Delete original booking request
          try {
            await axiosPublic.delete(
              `/Trainers_Booking_Request/${TrainerBookingRequestByIDData._id}`
            );
            console.log("Original booking request deleted.");
            navigate("/User/UserTrainerManagement?tab=User-Active-Session");

            // Errors
          } catch (deleteError) {
            console.error("Failed to delete booking request:", deleteError);
          }
        } catch (paymentError) {
          console.error("Payment update failed:", paymentError);
          Swal.fire(
            "Payment Success",
            "Booking status update failed. Contact support.",
            "warning"
          );
        }
      } catch (sessionError) {
        console.error("Booking update failed:", sessionError);
        return Swal.fire(
          "Error",
          "Session update failed. Contact support.",
          "error"
        );
      }
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
          <CommonButton
            type="submit"
            text="Pay Now"
            isLoading={isProcessing}
            loadingText="Processing..."
            bgColor="blue" // You can customize this or use bgFromColor/bgToColor directly
            width="1/3"
            py="py-3"
            textColor="text-white"
            borderRadius="rounded-lg"
            cursorStyle={
              !stripe ||
              !elements ||
              isSubmitting ||
              !isConfirmed ||
              isProcessing
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
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

export default UserTrainerSessionPaymentForm;
