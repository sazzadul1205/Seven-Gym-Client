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

  const onSubmit = async (data) => {
    let stepName = "Initial Setup";
    setIsProcessing(true);

    try {
      // 1. Ensure Stripe.js and Elements are initialized
      if (!stripe || !elements) {
        throw new Error("Stripe is not ready. Check Stripe.js initialization.");
      }

      // 2. Check confirmation checkbox
      if (!isConfirmed) {
        return Swal.fire("Warning", "Please confirm before paying.", "warning");
      }

      // 3. Final user confirmation modal before proceeding
      stepName = "Final User Confirmation";
      const { isConfirmed: proceed } = await Swal.fire({
        title: "Proceed with booking?",
        text: "Are you sure you want to confirm this booking and proceed with payment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
      });
      if (!proceed) return;

      // 4. Validate total price
      stepName = "Validating Total Price";
      const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
      if (isNaN(totalPrice) || totalPrice <= 0) {
        throw new Error("Total price is invalid or missing.");
      }

      // 5. Create Stripe PaymentIntent
      stepName = "Creating Payment Intent";
      const { data: { clientSecret } = {} } = await axiosPublic.post(
        "/Stripe_Payment_Intent",
        { totalPrice }
      );
      if (!clientSecret) {
        throw new Error("Failed to obtain client secret from server.");
      }

      // 6. Confirm card payment
      stepName = "Confirming Card Payment";
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found.");
      }

      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: data.cardholderName || "Unknown" },
          },
        });
      if (stripeError) {
        throw new Error(`Stripe error: ${stripeError.message}`);
      }
      if (!paymentIntent) {
        throw new Error("PaymentIntent confirmation failed.");
      }

      const stripePaymentID = paymentIntent.id;
      const formattedDateAndTime = new Date().toISOString();

      // 7. Mark booking as paid
      stepName = "Marking Booking as Paid";
      const acceptedPayload = {
        ...TrainerBookingRequestByIDData,
        paid: true,
        paidAt: formattedDateAndTime,
        paymentID: stripePaymentID,
      };
      const { data: updatedBooking } = await axiosPublic.post(
        "/Trainer_Booking_Accepted",
        acceptedPayload
      );

      // 8. Fetch session info
      stepName = "Fetching Session Info";
      const sessionQuery = updatedBooking.sessions
        .map((id) => `ids=${encodeURIComponent(id)}`)
        .join("&");
      const { data: sessionInfo } = await axiosPublic.get(
        `/Trainers_Schedule/BasicInfoByID?${sessionQuery}`
      );

      // 9. Store payment info in backend
      stepName = "Recording Payment Info";
      await axiosPublic.post("/Trainer_Session_Payment", {
        BookingInfo: updatedBooking,
        sessionInfo,
        cardHolder: data.cardholderName,
        paymentMethod: "Card",
        stripePaymentID,
        paymentTime: formattedDateAndTime,
      });

      // 10. Update trainer schedule with accepted booking
      stepName = "Updating Trainer Schedule";
      await axiosPublic.patch("/Trainers_Schedule/AcceptBooking", {
        sessionIds: updatedBooking.sessions,
        acceptedAt: formattedDateAndTime,
        stripePaymentID,
        bookerEmail: TrainerBookingRequestByIDData.bookerEmail,
      });

      // 11. Log trainer-student interaction
      stepName = "Logging Trainer-Student History";
      await axiosPublic.post("/Trainer_Student_History", {
        trainerId: TrainerBookingRequestByIDData?.trainerId,
        trainer: TrainerBookingRequestByIDData?.trainer,
        studentEntry: {
          bookerEmail: TrainerBookingRequestByIDData?.bookerEmail,
          ActiveTime: formattedDateAndTime,
        },
      });

      // 12. Notify success
      stepName = "Success Notification";
      await Swal.fire(
        "Success",
        "Payment successful and booking confirmed!",
        "success"
      );

      // 13. Delete original booking request
      stepName = "Deleting Original Booking Request";
      await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${TrainerBookingRequestByIDData._id}`
      );

      // 14. Redirect user to active sessions page
      stepName = "Redirecting to Active Sessions";
      navigate("/User/UserTrainerManagement?tab=User-Active-Session");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        JSON.stringify(error, null, 2) ||
        "Unknown error occurred";

      await Swal.fire({
        icon: "error",
        title: `Error at Step: ${stepName}`,
        html: `<pre style="text-align:left; white-space:pre-wrap;">${errorMessage}</pre>`,
      });

      console.error(`❌ Error at "${stepName}":`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  // New onSubmit handler that bypasses Stripe payments
  const onSubmitWithoutPayment = async (data) => {
    let stepName = "Initial Setup";
    setIsProcessing(true);

    try {
      // 1. Verify user confirmation checkbox
      stepName = "User Confirmation Checkbox Validation";
      if (!isConfirmed) {
        return Swal.fire(
          "Warning",
          "Please confirm before proceeding.",
          "warning"
        );
      }

      // 2. Final confirmation modal
      stepName = "Final User Prompt";
      const { isConfirmed: proceed } = await Swal.fire({
        title: "Proceed with booking?",
        text: "Do you really want to confirm this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
      });
      if (!proceed) return;

      // 3. Validate total price
      stepName = "Validating Total Price";
      const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
      if (isNaN(totalPrice)) {
        throw new Error("Total price is invalid or missing.");
      }

      // 4. Generate dummy payment ID
      stepName = "Generating Dummy Payment ID";
      const now = new Date();
      const dateString = now.toISOString().slice(0, 10).replace(/-/g, "");
      const dummyPaymentID = `DUMMY_${dateString}_${Math.floor(
        Math.random() * 1e6
      )}_Free`;
      const formattedDateAndTime = now.toISOString();

      // 5. Mark booking as accepted
      stepName = "Marking Booking as Accepted";
      const acceptPayload = {
        ...TrainerBookingRequestByIDData,
        paid: true,
        paidAt: formattedDateAndTime,
        paymentID: dummyPaymentID,
      };

      const { data: updatedBooking } = await axiosPublic.post(
        "/Trainer_Booking_Accepted",
        acceptPayload
      );

      // 6. Fetch associated session information
      stepName = "Fetching Session Details";
      const sessionQuery = updatedBooking.sessions
        .map((id) => `ids=${encodeURIComponent(id)}`)
        .join("&");

      const { data: sessionInfo } = await axiosPublic.get(
        `/Trainers_Schedule/BasicInfoByID?${sessionQuery}`
      );

      // 7. Log the free payment on server
      stepName = "Logging Free Payment";
      await axiosPublic.post("/Trainer_Session_Payment", {
        BookingInfo: updatedBooking,
        sessionInfo,
        cardHolder: data.cardholderName || "N/A",
        paymentMethod: "Free",
        stripePaymentID: dummyPaymentID,
        paymentTime: new Date().toISOString(),
      });

      // 8. Update trainer's schedule
      stepName = "Updating Trainer Schedule";
      await axiosPublic.patch("/Trainers_Schedule/AcceptBooking", {
        sessionIds: updatedBooking.sessions,
        acceptedAt: formattedDateAndTime,
        stripePaymentID: dummyPaymentID,
        bookerEmail: TrainerBookingRequestByIDData.bookerEmail,
      });

      // 9. Log trainer-student interaction
      stepName = "Logging Trainer-Student History";
      await axiosPublic.post("/Trainer_Student_History", {
        trainerId: TrainerBookingRequestByIDData?.trainerId,
        trainer: TrainerBookingRequestByIDData?.trainer,
        studentEntry: {
          bookerEmail: TrainerBookingRequestByIDData?.bookerEmail,
          ActiveTime: formattedDateAndTime,
        },
      });

      // 10. Notify user of success
      stepName = "Showing Success Message";
      await Swal.fire(
        "Success",
        "Booking confirmed without payment!",
        "success"
      );

      // 11. Remove original request
      stepName = "Deleting Original Booking Request";
      await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${TrainerBookingRequestByIDData._id}`
      );

      // 12. Redirect to Active Sessions
      stepName = "Redirecting to Active Sessions Page";
      navigate("/User/UserTrainerManagement?tab=User-Active-Session");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        JSON.stringify(err, null, 2) ||
        "Unknown error occurred";

      await Swal.fire({
        icon: "error",
        title: `Error at Step: ${stepName}`,
        html: `<pre style="text-align:left; white-space:pre-wrap;">${errorMessage}</pre>`,
      });

      console.error(`❌ Error at "${stepName}":`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-2 rounded-xl border border-gray-400 w-full sm:w-3/5 bg-white">
      {/* Title Section */}
      <h2 className="text-xl text-center text-white font-semibold bg-linear-to-bl from-blue-200 to-blue-500 rounded-2xl py-3 mb-5">
        Payment Information
      </h2>

      {/* Paid session form */}
      {Number(TrainerBookingRequestByIDData?.totalPrice) > 0 ? (
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
              className="w-full bg-white text-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-hidden"
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
            <div className="w-full bg-white text-black border border-gray-800 px-4 py-3 rounded-lg">
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
              bgColor="blue"
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
          {/* Free Text */}
          <p className="text-center mb-4 ">
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

          {/* Confirm Checkbox and Button */}
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

            {/* Buttons */}
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
    totalPrice: PropTypes.string.isRequired,
    trainerId: PropTypes.string.isRequired,
    bookerEmail: PropTypes.string.isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    paid: PropTypes.bool.isRequired,
    paidAt: PropTypes.string,
    paymentID: PropTypes.string,
    trainer: PropTypes.string,
  }).isRequired,
};

export default UserTrainerSessionPaymentForm;
