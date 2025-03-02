import { IoWarningOutline } from "react-icons/io5";

const FetchingError = () => {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white animate-fadeIn"
      aria-live="polite"
    >
      {/* Warning Icon */}
      <IoWarningOutline className="text-red-600 text-6xl mb-4" />

      {/* Error Message */}
      <p className="text-center text-red-600 font-bold text-3xl mb-6">
        Oops! Something went wrong.
      </p>
      <p className="text-center text-gray-700 text-lg mb-6">
        Please check your connection or try reloading the page.
      </p>

      {/* Reload Button */}
      <button
        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition duration-300"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

export default FetchingError;
