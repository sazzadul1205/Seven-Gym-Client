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

const TrainerProfile = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Fetch trainer data based on the logged-in user's email
  const {
    data: MyTrainerData,
    isLoading: MyTrainerDataLoading,
    error: MyTrainerDataError,
  } = useQuery({
    queryKey: ["MyTrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Fetch trainer details
  const TrainerProfileData = MyTrainerData?.[0];

  const {
    data: TrainerScheduleData,
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
    enabled: !!TrainerProfileData, // Ensure MyTrainerData exists before running
  });

  // Fetch trainer schedule data
  const TrainerProfileScheduleData = TrainerScheduleData?.[0];

  // Loading and Error handling
  if (MyTrainerDataLoading || TrainerScheduleIsLoading) return <Loading />;
  if (MyTrainerDataError || TrainerScheduleError) return <FetchingError />;

  return (
    <div className=" bg-fixed bg-cover bg-center bg-white">
      <div className="bg-linear-to-b from-white/20 to-white/10">
        {/* Header Section */}
        <TrainerProfileHeader TrainerDetails={TrainerProfileData || {}} />

        {/* Content Section */}
        <div className="bg-linear-to-t from-gray-500/50 to-gray-500/30 pb-5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trainer Bio and Experience */}
            <TrainersDetailsAbout TrainerDetails={TrainerProfileData || {}} />

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
          <TrainerDetailsTestimonials
            TrainerDetails={TrainerProfileData || {}}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
