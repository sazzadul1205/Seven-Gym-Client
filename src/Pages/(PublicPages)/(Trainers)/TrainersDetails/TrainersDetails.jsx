import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Trainer_Details_Page_Background from "../../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";

import TDPricing from "./TDContent/TDPricing";
import TDDetails from "./TDContent/TDDetails";
import TDTestimonials from "./TDContent/TDTestimonials";
import TrainersDetailsAbout from "./TrainersDetailsAbout/TrainersDetailsAbout";
import TrainersDetailsHeader from "./TrainersDetailsHeader/TrainersDetailsHeader";
import TrainerDetailsContact from "./TrainerDetailsContact/TrainerDetailsContact";

import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

const TrainersDetails = () => {
  const { name } = useParams();
  const axiosPublic = useAxiosPublic();

  // Decode the trainer's name from the URL
  const decodedName = decodeURIComponent(name);

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

  // Fetch Trainer Schedule
  const {
    data: Trainer_ScheduleData,
    isLoading: isLoadingTrainerSchedule,
    error: errorTrainerSchedule,
  } = useQuery({
    queryKey: ["Trainer_ScheduleData", decodedName],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/byName?name=${decodedName}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (isLoadingTrainerDetails || isLoadingTrainerSchedule) {
    return <Loading />;
  }

  // Handle errors for either API call
  if (errorTrainerDetails || errorTrainerSchedule) {
    return <FetchingError />;
  }

  // Extract trainer details and schedule from API response
  const TrainerDetails = Trainer_DetailData?.[0];
  const TrainerSchedule = Trainer_ScheduleData?.[0];

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
        <TrainersDetailsHeader TrainerDetails={TrainerDetails} />

        {/* Content Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trainer Bio and Experience */}
            <TrainersDetailsAbout TrainerDetails={TrainerDetails} />

            {/* Trainer Contact Information */}
            <TrainerDetailsContact TrainerDetails={TrainerDetails} />
          </div>

          {/* Trainer Pricing and Availability */}
          <TDPricing
            TrainerDetails={TrainerDetails}
            TrainerSchedule={TrainerSchedule}
          />

          {/* Trainer Certifications & Details */}
          <TDDetails TrainerDetails={TrainerDetails} />

          {/* Trainer Testimonials */}
          <TDTestimonials TrainerDetails={TrainerDetails} />
        </div>
      </div>
    </div>
  );
};

export default TrainersDetails;
