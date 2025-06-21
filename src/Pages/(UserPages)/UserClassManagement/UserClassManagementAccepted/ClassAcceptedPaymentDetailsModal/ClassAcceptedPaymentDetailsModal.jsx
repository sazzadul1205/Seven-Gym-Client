import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import { FaCalendarAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";
import TrainerBookingRequestUserBasicInfo from "../../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { ImCross } from "react-icons/im";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

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
  selectedBookingAcceptedData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    applicant: PropTypes.shape({
      classesName: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      submittedDate: PropTypes.string.isRequired,
      applicantData: PropTypes.shape({
        email: PropTypes.string,
      }),
    }),
    acceptedAt: PropTypes.string,
    paid: PropTypes.bool,
  }).isRequired,
  setPaymentSuccessData: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
};

export default ClassAcceptedPaymentDetailsModal;

const ClassAcceptedPaymentDetailsModalInner = ({
  setPaymentSuccessData,
  applicantData,
  refetchAll,
}) => {
  const axiosPublic = useAxiosPublic();
  const elements = useElements();
  const stripe = useStripe();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const className = applicantData?.applicant?.classesName;
  const applicant = applicantData?.applicant?.applicantData;
  const email = applicant?.email;
  const totalPrice = applicantData?.applicant?.totalPrice;
  const bookingId = applicantData?._id;

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

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      setPaymentError("Stripe is not ready. Please refresh the page.");
      return;
    }

    let clientSecret;
    try {
      const response = await axiosPublic.post("/Stripe_Payment_Intent", {
        description: `Class Booking for ${className}`,
        totalPrice,
      });
      clientSecret = response.data.clientSecret;
    } catch (err) {
      console.error(err);
      setPaymentError("Failed to initiate payment. Try again later.");
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: data?.cardholderName },
          },
        }
      );

      if (error) {
        setPaymentError(error.message);
        return;
      }

      const paidAt = new Date().toISOString();

      const paymentRecord = {
        ...applicantData,
        paymentMethod: "Card",
        stripePaymentID: paymentIntent.id,
        paidAt,
        paid: true,
      };

      // 1. Save payment record
      await axiosPublic.post("/Trainer_Session_Payment", paymentRecord);

      // 2. Update the accepted booking entry
      await axiosPublic.put(`/Class_Booking_Accepted/${bookingId}`, {
        paid: true,
        paidAt,
      });

      // 3. UI Feedback
      setPaymentSuccess("Payment completed successfully.");
      setPaymentSuccessData(paymentRecord);
      setIsConfirmed(false);
      handleClose();
      refetchAll();
      reset();
      document.getElementById("Payed_Class_Recept_Modal").showModal();
    } catch (error) {
      console.error(error);
      setPaymentError("An error occurred during payment. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (paymentError || paymentSuccess) {
      const timer = setTimeout(() => {
        setPaymentError("");
        setPaymentSuccess("");
      }, 5000);
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
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-200 text-black max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 px-5 py-4 bg-white rounded-t-lg">
        <h3 className="font-bold text-lg">Class Booking Accepted Payment</h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Inline Confirmation at Top */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mx-5 mt-4 rounded-md">
        <p>
          Are you sure you want to proceed with the payment of{" "}
          <strong>${applicantData?.applicant?.totalPrice}</strong> for{" "}
          <strong>{className}</strong>? Please confirm below.
        </p>
      </div>

      {/* Success or Error Feedback */}
      {(paymentError || paymentSuccess) && (
        <div
          className={`mx-5 mt-4 p-3 rounded-md text-sm ${
            paymentError
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`}
        >
          {paymentError || paymentSuccess}
        </div>
      )}

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Class and User Info */}
        <div className="flex justify-between items-center">
          {/* Class Info */}
          <div className="flex items-center space-x-4">
            {/* Class Icon */}
            <img
              src={ClassData?.icon}
              alt={`${className} icon`}
              className="w-14 h-14 rounded-lg border border-gray-300"
            />

            {/* Detail Info */}
            <div>
              {/* Class Name */}
              <h2 className="text-xl font-semibold">{className}</h2>

              {/* Duration */}
              <p className="text-gray-600 capitalize">
                {applicantData?.applicant?.duration} duration
              </p>
            </div>
          </div>

          {/* User Info */}
          <TrainerBookingRequestUserBasicInfo email={email} />
        </div>

        {/* Details Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
          {/* Total Price */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaMoneyBillAlt className="text-2xl text-green-600" />
            <span>Total Price: ${applicantData?.applicant?.totalPrice}</span>
          </div>

          {/* Submitted At */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-2xl text-blue-500" />
            <span>Submitted: {applicantData?.applicant?.submittedDate}</span>
          </div>

          {/* Accepted At */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaClock className="text-2xl text-indigo-500" />
            <span>
              Accepted: {new Date(applicantData?.acceptedAt).toLocaleString()}
            </span>
          </div>

          {/* Payed or Not */}
          <div className="flex items-center gap-2 text-gray-700">
            {applicantData?.paid ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Paid
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Waiting for Payment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="w-full lg:flex-1">
        {/* Title */}
        <h2 className="text-xl font-semibold text-center bg-blue-600 text-white py-2">
          Payment Information
        </h2>

        {/* Payment Form */}
        <form
          className="flex flex-col px-6 pb-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Card Holder Name */}
          <div className="pt-4">
            <label className="block text-lg font-semibold text-black mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              {...register("cardholderName", {
                required: "Cardholder name is required.",
              })}
              className="w-full bg-white text-black px-4 py-3 border rounded-lg"
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardholderName.message}
              </p>
            )}
          </div>

          {/* Card details */}
          <div className="pt-4">
            <label className="block text-lg font-semibold text-black mb-2">
              Card Details
            </label>
            <div className="w-full bg-white text-black px-4 py-3 border rounded-lg">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>

          {/* CheckBox */}
          <div className="flex items-center gap-2 pt-4">
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

          {/* Confirm Payment */}
          <div className="flex justify-center sm:justify-end mt-4">
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
  applicantData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    applicant: PropTypes.shape({
      classesName: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      submittedDate: PropTypes.string.isRequired,
      applicantData: PropTypes.shape({
        email: PropTypes.string,
      }),
    }),
    acceptedAt: PropTypes.string,
    paid: PropTypes.bool,
  }).isRequired,
  setPaymentSuccessData: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
};
