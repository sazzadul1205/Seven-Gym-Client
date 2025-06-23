import { useEffect, useState } from "react";

// Import Packages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Im[port Stripe Component
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// Import Icons
import { FaCalendarAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Import Common Button
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

// Import Basic Info
import TrainerBookingRequestUserBasicInfo from "../../../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Shared
import FetchingError from "../../../../../../Shared/Component/FetchingError";
import Loading from "../../../../../../Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const ClassAcceptedPaymentDetailsModalInner = ({
  setPaymentSuccessData,
  applicantData,
  refetchAll,
}) => {
  const axiosPublic = useAxiosPublic();
  const elements = useElements();
  const stripe = useStripe();

  // Local State Management
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  // Destructure Data
  const className = applicantData?.applicant?.classesName;
  const applicant = applicantData?.applicant?.applicantData;
  const email = applicant?.email;
  const totalPrice = applicantData?.applicant?.totalPrice;
  const bookingId = applicantData?._id;

  // React Form Control
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const {
    data: ClassData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ClassData", className],
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${className}`)
        .then((res) => res.data),
    enabled: !!className,
  });

  // Handle form submission (payment processing)
  const onSubmit = async (data) => {
    // Step 1: Check if Stripe and Elements are ready
    if (!stripe || !elements) {
      setPaymentError("Stripe is not ready. Please refresh the page.");
      return;
    }

    let clientSecret;

    // Step 2: Create a payment intent from the server
    try {
      const response = await axiosPublic.post("/Stripe_Payment_Intent", {
        description: `Class Booking for ${className}`,
        totalPrice,
      });
      clientSecret = response?.data?.clientSecret;

      if (!clientSecret) throw new Error("No clientSecret received");
    } catch (err) {
      console.log(err);
      setPaymentError("Failed to initiate payment. Try again later.");
      return;
    }

    // Step 3: Set processing state
    setIsProcessing(true);

    try {
      // Step 4: Retrieve the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element is null");

      // Step 5: Confirm card payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: data?.cardholderName },
          },
        }
      );

      // Step 6: Handle Stripe payment error
      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
        return;
      }

      // Step 7: Prepare payment data
      const paidAt = new Date().toISOString();

      // eslint-disable-next-line no-unused-vars
      const { _id, ...cleanedApplicantData } = applicantData;

      const paymentRecord = {
        ...cleanedApplicantData,
        paymentMethod: "Card",
        stripePaymentID: paymentIntent.id,
        paidAt,
        paid: true,
      };

      // Step 8: Save payment to database
      await axiosPublic.post("/Class_Booking_Payment", paymentRecord);

      // Step 9: Mark booking as paid
      await axiosPublic.put(`/Class_Booking_Accepted/${bookingId}`, {
        stripePaymentID: paymentIntent.id,
        paid: true,
        paidAt,
      });

      // Step 10: Final UI updates
      setPaymentSuccess("Payment completed successfully.");
      setPaymentSuccessData(paymentRecord);
      setIsConfirmed(false);
      handleClose?.();
      refetchAll?.();
      reset?.();

      // Step 11: Show payment receipt modal
      const receiptModal = document.getElementById("Payed_Class_Recept_Modal");
      if (receiptModal) {
        receiptModal.showModal();
      }
    } catch (err) {
      // Step 12: Handle unexpected errors
      console.log(err);
      setPaymentError("An error occurred during payment. Try again.");
    } finally {
      // Step 13: Reset processing state
      setIsProcessing(false);
    }
  };

  // Automatically clear payment messages after 5 seconds
  useEffect(() => {
    if (paymentError || paymentSuccess) {
      const timer = setTimeout(() => {
        setPaymentError("");
        setPaymentSuccess("");
      }, 5000);

      // Cleanup on unmount or re-trigger
      return () => clearTimeout(timer);
    }
  }, [paymentError, paymentSuccess]);
  const handleClose = () => {
    document.getElementById("Class_Accepted_Payment_Details_Modal")?.close();
    setPaymentError("");
    setPaymentSuccess("");
  };

  // Loading & Error
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div className="modal-box w-full max-w-2xl p-0 bg-gradient-to-b from-white to-gray-200 text-black max-h-[90vh] overflow-y-auto rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 px-4 sm:px-5 py-3 sm:py-4 bg-white rounded-t-lg">
        <h3 className="font-bold text-lg sm:text-xl">
          Class Booking Accepted Payment
        </h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Warning / Info */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mx-4 sm:mx-5 mt-4 rounded-md text-sm sm:text-base">
        <p>
          Are you sure you want to proceed with the payment of{" "}
          <strong>${applicantData?.applicant?.totalPrice}</strong> for{" "}
          <strong>{className}</strong>? Please confirm below.
        </p>
      </div>

      {/* Success/Error Feedback */}
      {(paymentError || paymentSuccess) && (
        <div
          className={`mx-4 sm:mx-5 mt-4 p-3 rounded-md text-sm ${
            paymentError
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`}
        >
          {paymentError || paymentSuccess}
        </div>
      )}

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 space-y-6">
        {/* Class & User Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Class Info */}
          <div className="flex items-center gap-4">
            <img
              src={ClassData?.icon}
              alt={`${className} icon`}
              className="w-14 h-14 rounded-lg border border-gray-300"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{className}</h2>
              <p className="text-gray-600 capitalize text-sm sm:text-base">
                {applicantData?.applicant?.duration} duration
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-2 md:mt-0">
            <TrainerBookingRequestUserBasicInfo email={email} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            <FaMoneyBillAlt className="text-green-600 text-lg" />
            <span>Total Price: ${applicantData?.applicant?.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            <FaCalendarAlt className="text-blue-500 text-lg" />
            <span>Submitted: {applicantData?.applicant?.submittedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            <FaClock className="text-indigo-500 text-lg" />
            <span>
              Accepted: {new Date(applicantData?.acceptedAt).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            {applicantData?.paid ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
                Paid
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm">
                Waiting for Payment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="w-full">
        <h2 className="text-lg sm:text-xl font-semibold text-center bg-blue-600 text-white py-2">
          Payment Information
        </h2>

        <form
          className="flex flex-col gap-4 px-4 sm:px-6 pb-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Cardholder Name */}
          <div className="pt-2">
            <label className="block text-sm sm:text-base font-semibold text-black mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              {...register("cardholderName", {
                required: "Cardholder name is required.",
              })}
              className="w-full bg-white text-black px-4 py-2 border rounded-lg"
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardholderName.message}
              </p>
            )}
          </div>

          {/* Card Element */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-black mb-2">
              Card Details
            </label>
            <div className="w-full bg-white text-black px-4 py-3 border rounded-lg">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="confirmation"
              className="w-5 h-5 cursor-pointer"
              onChange={(e) => setIsConfirmed(e.target.checked)}
              checked={isConfirmed}
            />
            <label htmlFor="confirmation" className="text-sm text-gray-700">
              I am sure I want to proceed with this payment.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center sm:justify-end mt-2">
            <CommonButton
              type="submit"
              text="Pay Now"
              isLoading={isProcessing}
              loadingText="Processing..."
              bgColor="blue"
              width="full sm:w-1/2 md:w-1/3"
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
    </div>
  );
};

// Prop Validation
ClassAcceptedPaymentDetailsModalInner.propTypes = {
  setPaymentSuccessData: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
  applicantData: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      acceptedAt: PropTypes.string,
      paid: PropTypes.bool,
      applicant: PropTypes.shape({
        duration: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        submittedDate: PropTypes.string,
        classesName: PropTypes.string,
        applicantData: PropTypes.shape({
          email: PropTypes.string,
        }),
      }),
    }),
    PropTypes.string, // fallback to avoid runtime error
  ]).isRequired,
};

export default ClassAcceptedPaymentDetailsModalInner;
