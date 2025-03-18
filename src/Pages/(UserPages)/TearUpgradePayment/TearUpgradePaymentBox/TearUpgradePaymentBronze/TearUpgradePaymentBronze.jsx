import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";

const TearUpgradePaymentBronze = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Fetch user data
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await axiosPublic.get(`/Users?email=${user.email}`);
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!user, // Fetch only if user exists
  });

  const handleResetToBronze = async () => {
    try {
      await axiosPublic.post("/resetTier", { email, tier: "Bronze" });
      alert(
        "Your tier has been successfully reset to Bronze. Please contact our management staff for further assistance."
      );
      navigate(-1);
    } catch (error) {
      alert("Failed to reset tier. Please contact our management staff.");
    }
  };

  // Handle loading and errors
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  console.log("My Tier :", userData?.tier);
  console.log("My Duration :", userData?.tierDuration?.duration);
  console.log("My Duration End :", userData?.tierDuration?.end);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center">
        <div className="text-2xl font-semibold text-green-600 mb-4">
          <p>Package Already Selected</p> <p>( {userData?.tier} )</p>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          You already have a suitable package selected, so this upgrade
          isn&apos;t required. If you&apos;d like to reset your tier to{" "}
          <strong>Bronze</strong>, click the button below. For further
          assistance, please speak with our management staff.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleResetToBronze}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md"
          >
            Reset to Bronze
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TearUpgradePaymentBronze;
