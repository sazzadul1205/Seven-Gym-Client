import { useNavigate, useParams } from "react-router";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const TearUpgradePaymentBronze = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Details
  const {
    data: Trainer_DetailData,
    isLoading: isLoadingTrainerDetails,
    error: errorTrainerDetails,
  } = useQuery({
    queryKey: ["Trainer_DetailData", decodedName],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/SearchTrainersByNames?names=${decodedName}`)
        .then((res) => res.data),
  });

  const handleResetToBronze = async () => {
    try {
      await axiosPublic.post("/resetTier", { email, tier: "Bronze" });
      alert(
        "Your tier has been reset to Bronze. Please contact our management staff for further assistance."
      );
      navigate(-1);
    } catch (error) {
      alert("Failed to reset tier. Please contact our management staff.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Suitable Package Already Selected
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          It appears you already have a suitable package selected, so this
          upgrade isn’t necessary. If you’d like to stop your current tier’s
          services and reset your tier to Bronze, please click the button below.
          For further assistance, contact our management staff on site.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleResetToBronze}
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Reset to Bronze
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TearUpgradePaymentBronze;