/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useParams } from "react-router";

const TUPaymentBox = ({ CurrentTierData }) => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch the client secret when a plan is selected
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (selectedDuration) {
          const response = await axiosPublic.post("/Create_Payment_Intent", {
            tier: CurrentTierData?.name,
            totalPrice: selectedDuration.totalPrice,
          });
          setClientSecret(response.data.clientSecret);
        }
      } catch (error) {
        console.error("Failed to fetch client secret:", error);
        Swal.fire(
          "Error",
          "Failed to initiate payment. Please try again later.",
          "error"
        );
      }
    };

    fetchClientSecret();
  }, [selectedDuration, CurrentTierData, axiosPublic]);

  // Function to generate Payment ID
  const generatePaymentID = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format date as DDMMYYYY
    return `TUP${randomDigits}${currentDate}`;
  };

  // Function to get today's date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // Format as 'MM/DD/YYYY, HH:mm:ss AM/PM' or local format
  };

  // Payment submission
  const onSubmit = async (data) => {
    // Check if Stripe is ready
    if (!stripe || !elements || !clientSecret) {
      Swal.fire(
        "Error",
        "Stripe is not ready. Please refresh the page and try again.",
        "error"
      );
      return;
    }
    // Confirm payment
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
      // If user confirms payment
      if (result.isConfirmed) {
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
          } else if (paymentIntent) {
            Swal.fire(
              "Payment Successful",
              "Your payment was processed successfully.",
              "success"
            );

            const paymentID = generatePaymentID(); // Generate unique payment ID
            const todayDateTime = getCurrentDateTime(); // Get today's date and time
            const postPaymentData = {
              tier: CurrentTierData?.name,
              email: email,
              duration: selectedDuration?.duration,
              totalPrice: selectedDuration?.totalPrice,
              paymentID: paymentID,
              paymentMethod: "Card",
              Payed: true,
              dateTime: todayDateTime, // Add date and time to the payload
            };
            console.log(postPaymentData);

            try {
              const response = await axiosPublic.post(
                "/Tier_Upgrade_Payment",
                postPaymentData
              );
              console.log("Post-payment success data:", response.data);
            } catch (postError) {
              console.error("Post-payment API error:", postError);
            }
          }
        } catch (error) {
          console.error("Error processing payment:", error);
          Swal.fire(
            "Error",
            "An error occurred during payment. Please try again.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="py-5 px-4 space-y-5 bg-white rounded-lg shadow-xl mt-4">
      <h1 className="text-4xl italic font-bold text-center mb-2">
        Select a Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Basic Plan",
            duration: "1 Month",
            multiplier: 1,
            icon: "📅",
            description: "Perfect for short-term needs.",
          },
          {
            name: "Value Plan",
            duration: "5 Months",
            multiplier: 4.8,
            icon: "⏳",
            description: "Great value for medium-term plans.",
          },
          {
            name: "Premium Plan",
            duration: "12 Months",
            multiplier: 11.5,
            icon: "🏆",
            description: "Best for long-term commitment.",
          },
        ].map((option, index) => (
          <div
            key={index}
            className={`px-4 py-6 border-4 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 transition-all duration-300 cursor-pointer ${
              selectedDuration?.duration === option.duration
                ? "border-blue-500 shadow-2xl scale-105"
                : "border-gray-200 hover:border-blue-300 hover:shadow-xl"
            }`}
            onClick={() =>
              setSelectedDuration({
                duration: option.duration,
                name: option.name,
                totalPrice: (CurrentTierData?.price || 0) * option.multiplier,
              })
            }
          >
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              {option.name}
            </h2>
            <div className="flex items-center gap-4 border-b border-t border-gray-400 py-4">
              <div className="text-5xl">{option.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {option.duration}
                </h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-800 text-center mt-2">
              Price: ${(CurrentTierData?.price || 0) * option.multiplier}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full p-6 rounded-lg border border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-center mb-4 py-2 bg-blue-500 text-white rounded-3xl">
          Payment Information
        </h2>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-lg font-semibold mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              {...register("cardholderName", {
                required: "Cardholder name is required.",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cardholder name"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardholderName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Card Details
            </label>
            <div className="w-full px-4 py-2 border rounded-lg">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirmation"
              className="w-5 h-5"
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <label htmlFor="confirmation" className="text-sm text-gray-700">
              I am sure I want to proceed with this payment.
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300"
            disabled={
              !stripe ||
              !elements ||
              !clientSecret ||
              isSubmitting ||
              !isConfirmed
            }
          >
            {isSubmitting ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TUPaymentBox;
