import { useEffect } from "react";
import { useParams } from "react-router";

// Import Package
import { useQuery } from "@tanstack/react-query";

// Import Background Image
import Trainer_Details_Page_Background from "../../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";

// |Import Components
import TrainersDetailsAbout from "./TrainersDetailsAbout/TrainersDetailsAbout";
import TrainersDetailsHeader from "./TrainersDetailsHeader/TrainersDetailsHeader";
import TrainerDetailsDetails from "./TrainerDetailsDetails/TrainerDetailsDetails";
import TrainerDetailsContact from "./TrainerDetailsContact/TrainerDetailsContact";
import TrainerDetailsSchedule from "./TrainerDetailsSchedule/TrainerDetailsSchedule";
import TrainerDetailsTestimonials from "./TrainerDetailsTestimonials/TrainerDetailsTestimonials";

// Import Hooks and Shared
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

const TrainersDetails = () => {
  const { name } = useParams();
  const axiosPublic = useAxiosPublic();

  // To Page Top Automatically on Page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // or just window.scrollTo(0, 0)
  }, []);

  // Decode the trainer's name from the URL
  const decodedName = decodeURIComponent(name);

  // Fetch Trainer Details
  const {
    data: TrainerDetailData,
    isLoading: TrainerDetailIsLoading,
    error: TrainerDetailError,
  } = useQuery({
    queryKey: ["Trainer_DetailData", decodedName],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/SearchTrainersByNames?names=${decodedName}`)
        .then((res) => res.data),
  });

  // Fetch Trainer Schedule
  const {
    data: TrainerScheduleData,
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
  } = useQuery({
    queryKey: ["TrainerScheduleData"],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByTrainerName?trainerName=${decodedName}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (TrainerDetailIsLoading || TrainerScheduleIsLoading) {
    return <Loading />;
  }

  // Handle errors for either API call
  if (TrainerDetailError || TrainerScheduleError) {
    return <FetchingError />;
  }

  // Extract trainer details and schedule from API response
  const TrainerDetails = TrainerDetailData?.[0];

  // Check if TrainerScheduleData is an array and has at least one element
  const TrainerSchedule = TrainerScheduleData?.[0];

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
        <div className="bg-linear-to-t from-gray-500/50 to-gray-500/30 pb-5">
          <div className="md:px-10 py-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Trainer Bio and Experience */}
            <TrainersDetailsAbout TrainerDetails={TrainerDetails} />

            {/* Trainer Contact Information */}
            <TrainerDetailsContact TrainerDetails={TrainerDetails} />
          </div>

          {/* Trainer Pricing and Availability */}
          <TrainerDetailsSchedule
            TrainerDetails={TrainerDetails}
            TrainerSchedule={TrainerSchedule}
          />

          {/* Trainer Certifications & Details */}
          <TrainerDetailsDetails TrainerDetails={TrainerDetails} />

          {/* Trainer Testimonials */}
          <TrainerDetailsTestimonials TrainerDetails={TrainerDetails} />
        </div>
      </div>
    </div>
  );
};

export default TrainersDetails;
