/* eslint-disable react/prop-types */
import USTrainer from "../../../../assets/USTrainer.png";
import Loading from "../../../../Shared/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import ClassTrainersCard from "../../../(Public Pages)/(Classes)/ClassesDetails/ClassTrainersCard/ClassTrainersCard";
import { Link } from "react-router";

const UPTeachers = ({ usersData }) => {
  const axiosPublic = useAxiosPublic();

  // Extract trainer names from usersData.attendingTrainer
  const trainerNames =
    usersData?.attendingTrainer?.map((trainer) => trainer.name) || [];

  // Fetch detailed data for trainers by their names
  const {
    data: TrainerDetails,
    isLoading: TrainerDetailsIsLoading,
    error: TrainerDetailsError,
  } = useQuery({
    queryKey: ["TrainerDetails", trainerNames],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/searchByNames?names=${trainerNames.join(",")}`)
        .then((res) => res.data),
    enabled: trainerNames.length > 0, // Prevent fetching if trainerNames are empty
  });

  // Handle loading and error states
  if (TrainerDetailsIsLoading) {
    return <Loading />;
  }

  if (TrainerDetailsError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
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
    <div className="space-y-4 ">
      <div className="flex items-center space-x-2 border-b">
        <img src={USTrainer} alt="USTrainer Icon" className="w-5 h-5" />
        <h2 className="text-xl font-semibold text-black ">
          My Current Trainers
        </h2>
      </div>
      {TrainerDetails?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
