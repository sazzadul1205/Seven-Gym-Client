/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import ClassTrainersCard from "../../../../(Public Pages)/(Classes)/ClassesDetails/ClassTrainersCard/ClassTrainersCard";
import USTrainer from "../../../../../assets/USTrainer.png";
import Loading from "../../../../../Shared/Loading/Loading";

const UPTeachers = ({ usersData }) => {
  const axiosPublic = useAxiosPublic();

  // Extract trainer names from usersData.attendingTrainer
  const trainerNames =
    usersData?.attendingTrainer?.map((trainer) => trainer.name) || [];

  // Fetch trainer details
  const {
    data: TrainerDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["TrainerDetails", trainerNames],
    queryFn: async () => {
      if (trainerNames.length === 0) return [];
      const res = await axiosPublic.get(
        `/Trainers/searchByNames?names=${trainerNames.join(",")}`
      );
      return res.data;
    },
    enabled: trainerNames.length > 0, // Prevent fetching if trainerNames are empty
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loading />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-6">
          Something went wrong. Please try again.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-5 shadow-xl rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={USTrainer} alt="Trainer Icon" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-black">
          My Current Trainers
        </h2>
      </div>

      {/* Trainer List */}
      {TrainerDetails?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TrainerDetails.map((trainer, index) => (
            <ClassTrainersCard
              key={trainer.trainersID || index}
              trainer={trainer}
              role="Trainer"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-gray-600 text-lg">No trainers assigned yet.</p>
          <Link
            to="/Trainers"
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Book Teacher
          </Link>
        </div>
      )}
    </div>
  );
};

export default UPTeachers;
