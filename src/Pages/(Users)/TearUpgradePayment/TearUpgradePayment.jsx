import { useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import { useForm } from "react-hook-form";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";

const TearUpgradePayment = () => {
  const axiosPublic = useAxiosPublic();
  const { tier } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData", tier],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
  });

  // Loading and error handling
  if (CurrentTierDataLoading) return <Loading />;
  if (CurrentTierDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load tier data.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  const getTierBadge = (tier) => {
    const styles = {
      Bronze:
        "bg-orange-600 hover:bg-orange-800 text-white ring-2 ring-orange-300 shadow-lg",
      Silver:
        "bg-gray-400 hover:bg-gray-600 text-white ring-2 ring-gray-200 shadow-lg",
      Gold: "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-300 shadow-lg",
      Diamond:
        "bg-blue-600 hover:bg-blue-800 text-white ring-2 ring-blue-300 shadow-lg",
      Platinum:
        "bg-gray-800 hover:bg-gray-600 text-white ring-2 ring-gray-500 shadow-lg",
    };
    return styles[tier] || "bg-gray-200 text-gray-700";
  };

  const onSubmit = async (data) => {
    console.log("Payment Data Submitted: ", data);
    // Handle payment submission logic here
  };

  return (
    <div className="bg-gradient-to-br from-red-300 to-white min-h-screen">
      {/* Title */}
      <p className="text-3xl font-bold text-center mb-6 pt-[100px] text-white border-b-2 border-white pb-2 mx-4 md:mx-40">
        Payment for {CurrentTierData.name} Tier
      </p>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-10 p-4">
        {/* Tier Information Section */}
        <div className="w-full lg:w-1/3">
          <div
            className={`flex flex-col p-4 shadow-lg rounded-lg border border-gray-200 ${CurrentTierData.bgColor} min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <h2
              className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 ${getTierBadge(
                CurrentTierData.name
              )} transition-all duration-300`}
            >
              {CurrentTierData.name}
            </h2>
            <ul className="flex-grow mb-4">
              {CurrentTierData.perks.map((perk, idx) => (
                <li
                  key={idx}
                  className="text-lg font-semibold flex items-center mb-2"
                >
                  <span className="text-green-500 mr-2">✔</span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">
                ${CurrentTierData.price} / month
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {CurrentTierData.discount}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="w-full lg:w-2/3 p-4 rounded-lg border border-gray-200 bg-white min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-center mb-4 py-2 bg-blue-500 text-white rounded-3xl">
            Payment Information
          </h2>
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Payment Method Selection */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Select Payment Method
              </label>
              <div className="flex space-x-4 justify-between px-28">
                <div className="form-control">
                  <label className="label cursor-pointer gap-5">
                    <input
                      type="radio"
                      value="Visa"
                      {...register("paymentMethod", { required: true })}
                      className="radio"
                    />
                    <FaCcVisa className="text-5xl" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer gap-5">
                    <input
                      type="radio"
                      value="MasterCard"
                      {...register("paymentMethod", { required: true })}
                      className="radio"
                    />
                    <FaCcMastercard className="text-5xl" />
                  </label>
                </div>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">
                  Please select a payment method.
                </p>
              )}
            </div>

            {/* New Card Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  {...register("cardholderName", {
                    required: "Name is required.",
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter cardholder name"
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-sm">
                    {errors.cardholderName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  {...register("cardNumber", {
                    required: "Card number is required.",
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: "Card number must be 16 digits.",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter card number"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-lg font-semibold mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    {...register("expiryDate", {
                      required: "Expiry date is required.",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: "Enter a valid expiry date (MM/YY).",
                      },
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-lg font-semibold mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    {...register("cvv", {
                      required: "CVV is required.",
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: "Enter a valid CVV.",
                      },
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CVV"
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TearUpgradePayment;
