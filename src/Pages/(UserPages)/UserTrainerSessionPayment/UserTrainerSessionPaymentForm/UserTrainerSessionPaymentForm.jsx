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

  const onSubmit = async (data) => {
    let stepName = "Initial Setup";
    setIsProcessing(true);

    try {
      // 1. Ensure Stripe.js and Elements are initialized
      if (!stripe || !elements) {
        throw new Error("Stripe is not ready. Check Stripe.js initialization.");
      }

      // 2. Check confirmation
      if (!isConfirmed) {
        return Swal.fire("Warning", "Please confirm before paying.", "warning");
      }

      // 3. User confirmation popup
      stepName = "User Confirmation";
      const { isConfirmed: userOk } = await Swal.fire({
        title: "Proceed with payment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, pay now",
        cancelButtonText: "Cancel",
      });
      if (!userOk) return;

      // 4. Validate price
      stepName = "Total Price Validation";
      const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);
      if (isNaN(totalPrice)) {
        throw new Error("Total price is invalid or missing.");
      }

      // 5. Create PaymentIntent
      stepName = "Creating Stripe PaymentIntent";
      const { data: { clientSecret } = {} } = await axiosPublic.post(
        "/Stripe_Payment_Intent",
        { totalPrice }
      );
      if (!clientSecret) {
        throw new Error("Server did not return a client secret.");
      }

      // 6. Confirm card payment
      stepName = "Confirming Stripe Payment";
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: data.cardholderName },
          },
        });
      if (stripeError) {
        throw new Error(`Stripe Error: ${stripeError.message}`);
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

      // 8. Get session info
      stepName = "Fetching Session Info";
      const sessionQuery = updatedBooking.sessions
        .map((id) => `ids=${encodeURIComponent(id)}`)
        .join("&");

      const { data: sessionInfo } = await axiosPublic.get(
        `/Trainers_Schedule/BasicInfoByID?${sessionQuery}`
      );

      // 9. Store payment info
      stepName = "Storing Payment Info in Backend";
      await axiosPublic.post("/Trainer_Session_Payment", {
        BookingInfo: updatedBooking,
        sessionInfo,
        cardHolder: data.cardholderName,
        paymentMethod: "Card",
        stripePaymentID,
        paymentTime: new Date().toISOString(),
      });

      // 10. Update trainer schedule
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

      // 13. Delete original request
      stepName = "Deleting Original Booking Request";
      await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${TrainerBookingRequestByIDData._id}`
      );

      // 14. Redirect
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
    // 1. Verify user confirmation checkbox
    if (!isConfirmed) {
      return Swal.fire(
        "Warning",
        "Please confirm before proceeding.",
        "warning"
      );
    }

    // 2. Final “Are you sure?” prompt
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
    const totalPrice = Number(TrainerBookingRequestByIDData?.totalPrice);

    if (isNaN(totalPrice)) {
      return Swal.fire("Error", "Invalid total price.", "error");
    }

    // 4. Generate a dummy payment ID
    const now = new Date();

    const dateString = now.toISOString().slice(0, 10).replace(/-/g, "");

    const dummyPaymentID = `DUMMY_${dateString}_${Math.floor(
      Math.random() * 1e6
    )}_Free`;

    setIsProcessing(true);

    try {
      // 5. Mark booking as accepted (paid with dummy ID)
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

      const sessionQuery = updatedBooking.sessions
        .map((id) => `ids=${encodeURIComponent(id)}`)
        .join("&");

      const { data: sessionInfo } = await axiosPublic.get(
        `/Trainers_Schedule/BasicInfoByID?${sessionQuery}`
      );

      // 6. Record the “payment” on server
      await axiosPublic.post("/Trainer_Session_Payment", {
        BookingInfo: updatedBooking,
        sessionInfo,
        cardHolder: data.cardholderName,
        paymentMethod: "Free",
        stripePaymentID: dummyPaymentID,
        paymentTime: new Date().toISOString(),
      });

      // 7. Update trainer schedule for accepted booking
      await axiosPublic.patch("/Trainers_Schedule/AcceptBooking", {
        sessionIds: updatedBooking.sessions,
        acceptedAt: formattedDateAndTime,
        stripePaymentID: dummyPaymentID,
        bookerEmail: TrainerBookingRequestByIDData.bookerEmail,
      });

      // 8. Log trainer–student interaction
      await axiosPublic.post("/Trainer_Student_History", {
        trainerId: TrainerBookingRequestByIDData?.trainerId,
        studentEntry: {
          bookerEmail: TrainerBookingRequestByIDData?.bookerEmail,
          ActiveTime: formattedDateAndTime,
        },
      });

      Swal.fire("Success", "Booking confirmed without payment!", "success");

      // 9. Clean up original booking request and navigate
      await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${TrainerBookingRequestByIDData._id}`
      );
      navigate("/User/UserTrainerManagement?tab=User-Active-Session");
    } catch (err) {
      console.error("Booking error:", err);

      let errorMessage = "Something went wrong during booking confirmation.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data, null, 2);
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Booking Error",
        html: `<pre style="text-align:left; white-space:pre-wrap;">${errorMessage}</pre>`,
      });
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
  }).isRequired,
};

export default UserTrainerSessionPaymentForm;
