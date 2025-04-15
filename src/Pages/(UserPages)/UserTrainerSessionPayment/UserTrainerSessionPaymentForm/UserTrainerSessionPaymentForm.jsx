import { useState } from "react";
import { useNavigate } from "react-router";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Stripe
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Common Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const UserTrainerSessionPaymentForm = ({ TrainerBookingRequestByIDData }) => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  console.log(TrainerBookingRequestByIDData);

  // Get Element & Stripe from Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // Local state for confirmation and processing status
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Format the current date and time as "dd-mm-yyyyThh:mm"
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
    // Step 1: Ensure that Stripe and Elements are loaded
    if (!stripe || !elements) {
      return Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
    }

    // Step 2: Ensure user confirmation via checkbox
    if (!isConfirmed) {
      return Swal.fire("Error", "Please confirm before paying.", "warning");
    }

    // Step 3: Final confirmation before payment
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
    // Get total price from the booking data
    const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
    if (isNaN(totalPrice)) {
      return Swal.fire("Error", "Invalid total price provided.", "error");
    }

    setIsProcessing(true);

    // Step 4: Initialize Stripe Payment Intent on the server
    try {
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

    try {
      // Step 5: Confirm card payment with Stripe
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

      // Step 6: Retrieve the Stripe Payment ID
      const stripePaymentID = paymentIntent.id;

      // ===================== AcceptBooking Logic Begins =====================
      // Step 7: Build payload for marking the booking as accepted
      const sessionAcceptedPayload = {
        ...TrainerBookingRequestByIDData,
        paid: true,
        paidAt: formattedDateAndTime,
        paymentID: stripePaymentID,
      };

      // Step 8: Call the Accept Booking endpoint to update booking status
      const TrainerBookingAcceptRes = await axiosPublic.post(
        "/Trainer_Booking_Accepted",
        sessionAcceptedPayload
      );
      const updatedSessionInfo = TrainerBookingAcceptRes.data;

      // Step 9: Build payment record payload
      const paymentPayload = {
        sessionInfo: {
          ...updatedSessionInfo,
        },
        cardHolder: data.cardholderName,
        paymentMethod: "Card",
        stripePaymentID,
      };

      // Step 10: Save payment record on the server
      await axiosPublic.post("/Trainer_Session_Payment", paymentPayload);

      // Step 11: Accepted Booking Schedule Update Payload
      const acceptBookingSchedulePayload = {
        sessionIds: updatedSessionInfo?.sessions || [],
        acceptedAt: formattedDateAndTime,
        stripePaymentID,
        bookerEmail: TrainerBookingRequestByIDData.bookerEmail,
      };

      // Step 12: Patch the code
      await axiosPublic.patch(
        "/Trainers_Schedule/AcceptBooking",
        acceptBookingSchedulePayload
      );

      // Step 11: Notify the user that payment and booking acceptance were successful
      await Swal.fire(
        "Success",
        "Payment successful and booking confirmed!",
        "success"
      );

      // ===================== AcceptBooking Logic Ends =====================

      // Step 13: Delete the original booking request to clean up active requests
      try {
        await axiosPublic.delete(
          `/Trainers_Booking_Request?id=${TrainerBookingRequestByIDData?._id}`
        );

        // Navigate the user back to their session management page
        navigate("/User/UserTrainerManagement?tab=User-Active-Session");
      } catch (deleteError) {
        console.error("Failed to delete booking request:", deleteError);
      }
    } catch (err) {
      console.error("Stripe error:", err);
      Swal.fire("Error", "Something went wrong during payment.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // New onSubmit handler that bypasses Stripe payments
  const onSubmitWithoutPayment = async (data) => {
    // Step 1: Ensure user confirmation via checkbox
    if (!isConfirmed) {
      return Swal.fire("Error", "Please confirm before proceeding.", "warning");
    }

    // Step 2: Final confirmation before proceeding with the booking
    const confirmBooking = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to proceed with the booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    });

    if (!confirmBooking.isConfirmed) return;

    // Step 3: Validate total price from booking data
    const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
    if (isNaN(totalPrice)) {
      return Swal.fire("Error", "Invalid total price provided.", "error");
    }

    // Generate a dummy payment/stripe ID using a random number
    // Create a date string in the format YYYYMMDD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}${month}${day}`;

    // Generate dummy payment ID including date and "Free"
    const dummyPaymentID = `DUMMY_${dateString}_${Math.floor(
      Math.random() * 1000000
    )}_Free`;

    setIsProcessing(true);

    try {
      // Step 4: Build payload for marking the booking as accepted.
      // Mark as paid using the dummy ID and current formatted date and time.
      const sessionAcceptedPayload = {
        ...TrainerBookingRequestByIDData,
        paid: true,
        paidAt: formattedDateAndTime,
        paymentID: dummyPaymentID,
      };

      // Step 5: Call the Accept Booking endpoint to update booking status
      const TrainerBookingAcceptRes = await axiosPublic.post(
        "/Trainer_Booking_Accepted",
        sessionAcceptedPayload
      );
      const updatedSessionInfo = TrainerBookingAcceptRes.data;

      // Step 6: Build payment record payload with dummy payment details
      const paymentPayload = {
        sessionInfo: {
          ...updatedSessionInfo,
        },
        cardHolder: data.cardholderName,
        paymentMethod: "Free",
        stripePaymentID: dummyPaymentID,
      };

      // Step 7: Save the payment record on the server
      await axiosPublic.post("/Trainer_Session_Payment", paymentPayload);

      // Step 8: Build the schedule update payload for accepted bookings
      const acceptBookingSchedulePayload = {
        sessionIds: updatedSessionInfo?.sessions || [],
        acceptedAt: formattedDateAndTime,
        stripePaymentID: dummyPaymentID,
        bookerEmail: TrainerBookingRequestByIDData.bookerEmail,
      };

      // Step 9: Update trainer's schedule with the accepted booking
      await axiosPublic.patch(
        "/Trainers_Schedule/AcceptBooking",
        acceptBookingSchedulePayload
      );

      // Step 10: Notify the user of successful booking and dummy payment processing
      await Swal.fire(
        "Success",
        "Booking confirmed without actual payment!",
        "success"
      );

      // Step 11: Clean up by deleting the original booking request
      try {
        await axiosPublic.delete(
          `/Trainers_Booking_Request?id=${TrainerBookingRequestByIDData?._id}`
        );
        // Navigate the user back to their session management page
        navigate("/User/UserTrainerManagement?tab=User-Active-Session");
      } catch (deleteError) {
        console.error("Failed to delete booking request:", deleteError);
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire(
        "Error",
        "Something went wrong during booking confirmation.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="m-2 p-2 rounded-xl border border-gray-400">
      {/* Title Section */}
      <h2 className="text-xl text-center text-white font-semibold bg-linear-to-bl from-blue-200 to-blue-500 rounded-2xl py-4">
        Payment Information
      </h2>

      {Number(TrainerBookingRequestByIDData?.totalPrice) > 0 ? (
        // Paid session form
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
              width="[200px]"
              py="py-2"
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
      ) : (
        <form
          className="text-green-600 font-semibold py-4 px-4 sm:px-6 md:px-8 max-w-xl mx-auto"
          onSubmit={handleSubmit(onSubmitWithoutPayment)}
        >
          <p className="text-center mb-4">
            No payment required. This session is free.
          </p>

          {/* Cardholder Name Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-black mb-2">
              Your Name
            </label>
            <input
              type="text"
              {...register("cardholderName", {
                required: "Cardholder name is required.",
              })}
              className="w-full bg-white text-black px-4 py-3 border rounded-lg focus:outline-none"
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardholderName.message}
              </p>
            )}
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment Confirmation Checkbox */}
            <div className="flex items-center gap-2 w-full md:w-2/3">
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

            <div className="w-full">
              <CommonButton
                type="submit"
                text="Pay Now"
                isLoading={isProcessing}
                loadingText="Processing..."
                bgColor="blue"
                width="[200px]"
                py="py-2"
                textColor="text-white"
                borderRadius="rounded-lg"
                cursorStyle={
                  isProcessing ? "cursor-not-allowed" : "cursor-pointer"
                }
                disabled={isProcessing}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// Prop validation for TrainerBookingRequestByIDData component
UserTrainerSessionPaymentForm.propTypes = {
  TrainerBookingRequestByIDData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    bookerEmail: PropTypes.string.isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    paid: PropTypes.bool.isRequired,
    paidAt: PropTypes.string,
    paymentID: PropTypes.string,
  }).isRequired,
};

export default UserTrainerSessionPaymentForm;
