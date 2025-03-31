// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks and Shared
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Components
import TrainersDetailsAbout from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainersDetailsAbout/TrainersDetailsAbout";
import TrainerDetailsContact from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsContact/TrainerDetailsContact";
import TrainerDetailsDetails from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsDetails/TrainerDetailsDetails";
import TrainerDetailsSchedule from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsSchedule/TrainerDetailsSchedule";
import TrainerDetailsTestimonials from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsTestimonials/TrainerDetailsTestimonials";
import TrainerProfileHeader from "./TrainerProfileHeader/TrainerProfileHeader";
import TrainerProfileAbout from "./TrainerProfileAbout/TrainerProfileAbout";

const TrainerProfile = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Fetch trainer data based on the logged-in user's email
  const {
    data: MyTrainerData = [],
    isLoading: MyTrainerDataLoading,
    error: MyTrainerDataError,
  } = useQuery({
    queryKey: ["MyTrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email, // Runs only if email exists
  });

  // Extract trainer details
  const TrainerProfileData = MyTrainerData?.[0] || null;

  // Fetch trainer schedule data
  const {
    data: TrainerScheduleData = [],
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
  } = useQuery({
    queryKey: ["TrainerScheduleData", TrainerProfileData?.name],
    queryFn: () =>
      axiosPublic
        .get(
          `/Trainers_Schedule/ByTrainerName?trainerName=${encodeURIComponent(
            TrainerProfileData?.name
          )}`
        )
        .then((res) => res.data),
    enabled: !!TrainerProfileData?.name, // Runs only if trainer's name exists
  });

  // Extract schedule details
  const TrainerProfileScheduleData = TrainerScheduleData?.[0] || null;

  // Handle Loading and Errors
  if (MyTrainerDataLoading || TrainerScheduleIsLoading) return <Loading />;
  if (MyTrainerDataError || TrainerScheduleError)
    return <FetchingError error={MyTrainerDataError || TrainerScheduleError} />;

  return (
    <div className="bg-fixed bg-cover bg-center">
      {/* Header Section */}
      <div className="bg-linear-to-b from-gray-200 to-gray-400">
        <TrainerProfileHeader TrainerDetails={TrainerProfileData || {}} />
      </div>

      {/* Content Section */}
      <div className="bg-linear-to-b from-gray-400 to-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trainer Bio and Experience */}
          <TrainerProfileAbout TrainerDetails={TrainerProfileData || {}} />

          {/* Trainer Contact Information */}
          <TrainerDetailsContact TrainerDetails={TrainerProfileData || {}} />
        </div>

        {/* Trainer Pricing and Availability */}
        <TrainerDetailsSchedule
          TrainerDetails={TrainerProfileData || {}}
          TrainerSchedule={TrainerProfileScheduleData || {}}
        />

        {/* Trainer Certifications & Details */}
        <TrainerDetailsDetails TrainerDetails={TrainerProfileData || {}} />

        {/* Trainer Testimonials */}
        <TrainerDetailsTestimonials TrainerDetails={TrainerProfileData || {}} />
      </div>
    </div>
  );
};

export default TrainerProfile;
