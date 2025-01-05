import { useForm } from "react-hook-form";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";

const TUPaymentBox = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full  p-4 rounded-lg border border-gray-200 bg-white min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-4 py-2 bg-blue-500 text-white rounded-3xl">
        Payment Information
      </h2>
      {/* Form */}
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Payment Method Selection */}
        <div className="mb-4">
          {/* Title */}
          <h3 className="block text-lg font-semibold mb-2">
            Select Payment Method
          </h3>

          {/* Card Picker */}
          <div className="flex space-x-4 justify-between px-28">
            {/* Visa */}
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
            {/* Master Card */}
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

          {/* Error */}
          <p className="text-red-500 text-sm">
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">
                Please select a payment method.
              </p>
            )}
          </p>
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
              <label className="block text-lg font-semibold mb-2">CVV</label>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default TUPaymentBox;
