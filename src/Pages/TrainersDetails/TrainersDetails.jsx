import { useParams } from "react-router";
import Loading from "../../Shared/Loading/Loading";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import TDImages from "./TDContent/TDImages";
import TDBio from "./TDContent/TDBio";
import TDContact from "./TDContent/TDContact";
import TDTestimonials from "./TDContent/TDTestimonials";
import TDDetails from "./TDContent/TDDetails";
import TDPricing from "./TDContent/TDPricing";

const TrainersDetails = () => {
  const axiosPublic = useAxiosPublic();
  let { name } = useParams();
  // Decode the URL parameter to handle spaces correctly
  const decodedName = decodeURIComponent(name); // Decode the name parameter

  // Fetching Trainer_Detail Data
  const {
    data: Trainer_DetailData,
    isLoading: Trainer_DetailDataIsLoading,
    error: Trainer_DetailDataError,
  } = useQuery({
    queryKey: ["Trainer_DetailData", decodedName], // Adding 'decodedName' to the query key
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/searchByNames?names=${decodedName}`) // Pass the decoded name in the API call
        .then((res) => res.data),
  });
  // Fetching Trainer_Schedule Data
  const {
    data: Trainer_ScheduleData,
    isLoading: Trainer_ScheduleDataIsLoading,
    error: Trainer_ScheduleDataError,
  } = useQuery({
    queryKey: ["Trainer_ScheduleData", decodedName], // Adding 'decodedName' to the query key
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/byName?name=${decodedName}`) // Pass the decoded name in the API call
        .then((res) => res.data),
  });

  // Loading and error states
  if (Trainer_DetailDataIsLoading || Trainer_ScheduleDataIsLoading) {
    return <Loading />;
  }

  if (Trainer_DetailDataError || Trainer_ScheduleDataError) {
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

  const TrainerDetails = Trainer_DetailData[0];
  const TrainerSchedule = Trainer_ScheduleData[0];

  return (
    <div className=" bg-[#f72c5b44]">
      <div className="bg-[#F72C5B] py-11"></div>

      {/* images and Name */}
      <TDImages TrainerDetails={TrainerDetails} />

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trainer Bio and Experience */}
          <TDBio TrainerDetails={TrainerDetails} />

          {/* Trainer Contact Info */}
          <TDContact TrainerDetails={TrainerDetails} />
        </div>
        {/* Trainer Pricing */}
        <TDPricing
          TrainerDetails={TrainerDetails}
          TrainerSchedule={TrainerSchedule}
        />

        {/* Trainer Certifications */}
        <TDDetails TrainerDetails={TrainerDetails} />

        {/* Testimonials */}
        <TDTestimonials TrainerDetails={TrainerDetails} />
      </div>
    </div>
  );
};

export default TrainersDetails;
