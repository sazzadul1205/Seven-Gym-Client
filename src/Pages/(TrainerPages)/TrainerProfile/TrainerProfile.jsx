// Import Packages
import { useQuery } from "@tanstack/react-query";

// |Import Background Image
import Trainer_Details_Page_Background from "../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";

// Import Hooks and Shared
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Components
import TrainersDetailsHeader from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainersDetailsHeader/TrainersDetailsHeader";
import TrainersDetailsAbout from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainersDetailsAbout/TrainersDetailsAbout";
import TrainerDetailsContact from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsContact/TrainerDetailsContact";
// import TrainerDetailsSchedule from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsSchedule/TrainerDetailsSchedule";
import TrainerDetailsDetails from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsDetails/TrainerDetailsDetails";
import TrainerDetailsTestimonials from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsTestimonials/TrainerDetailsTestimonials";

const TrainerProfile = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Fetch tier data
  const {
    data: MyTrainerData = [],
    isLoading: MyTrainerDataLoading,
    error: MyTrainerDataError,
  } = useQuery({
    queryKey: ["MyTrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
  });

  // Trainer Profile Data
  const trainerProfileData = MyTrainerData[0];

  // Fetch trainer schedule data
  const {
    data: MyTrainerScheduleData = [],
    isLoading: MyTrainerDataScheduleLoading,
    error: MyTrainerDataScheduleError,
  } = useQuery({
    queryKey: ["MyTrainerScheduleData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(
          `/Trainers_Schedule?ByTrainerName?trainerName=${trainerProfileData?.name}`
        )
        .then((res) => res.data),
  });

  // Loading and Error handling
  if (MyTrainerDataLoading || MyTrainerDataScheduleLoading) return <Loading />;
  if (MyTrainerDataError || MyTrainerDataScheduleError)
    return <FetchingError />;

  console.log("Trainer Data: ", trainerProfileData);
  console.log("Trainer Schedule Data: ", MyTrainerScheduleData);

  return (
    <div
      className=" bg-fixed bg-cover bg-center bg-linear-to-b from-white/50 to-white/20"
      style={{
        backgroundImage: `url(${Trainer_Details_Page_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-linear-to-b from-white/20 to-white/10">
        {/* Header Section */}
        <TrainersDetailsHeader TrainerDetails={trainerProfileData} />

        {/* Content Section */}
        <div className="bg-linear-to-t from-gray-500/50 to-gray-500/30 pb-5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trainer Bio and Experience */}
            {/* <TrainersDetailsAbout TrainerDetails={trainerProfileData} /> */}

            {/* Trainer Contact Information */}
            {/* <TrainerDetailsContact TrainerDetails={trainerProfileData} /> */}

            {/* Trainer Pricing and Availability */}
            {/* <TrainerDetailsSchedule
              TrainerDetails={trainerProfileData}
              TrainerSchedule={TrainerSchedule}
            /> */}

            {/* Trainer Certifications & Details */}
            {/* <TrainerDetailsDetails TrainerDetails={trainerProfileData} /> */}

            {/* Trainer Testimonials */}
            {/* <TrainerDetailsTestimonials TrainerDetails={trainerProfileData} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
