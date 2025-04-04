import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";
import TrainerBookingDetails from "./TrainerBookingDetails/TrainerBookingDetails";
import SameTimeWeekClass from "./SameTimeWeekClass/SameTimeWeekClass";
import BookedTable from "./BookedTable/BookedTable";
import SameClassTypeWeekClass from "./SameClassTypeWeekClass/SameClassTypeWeekClass";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Fetch Trainer Background Image
import Trainer_Details_Page_Background from "../../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";

const TrainersBookings = () => {
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const { name } = useParams();
  const { user } = useAuth();

  // State to track clicked sessions
  const [listedSessions, setListedSessions] = useState([]);

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const Day = searchParams.get("day");
  const TimeStart = searchParams.get("timeStart");
  const ClassType = searchParams.get("classType");

  // Fetch session details
  const {
    data: SameTimeData,
    isLoading: SameTimeDataIsLoading,
    error: SameTimeDataError,
  } = useQuery({
    queryKey: ["SameTimeData"],
    queryFn: () =>
      axiosPublic
        .get(`Trainers_Schedule/${name}/time/${TimeStart}`)
        .then((res) => res.data),
  });

  // Fetch session details
  const {
    data: SameClassTypeData,
    isLoading: SameClassTypeDataIsLoading,
    error: SameClassTypeDataError,
  } = useQuery({
    queryKey: ["SameClassTypeData"],
    queryFn: () =>
      axiosPublic
        .get(`Trainers_Schedule/${name}/classType/${ClassType}`)
        .then((res) => res.data),
  });

  // Fetch user details
  const {
    data: UsersData,
    isLoading: UsersDataLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  // Fetch trainer details
  const {
    data: TrainerDetailData,
    isLoading: TrainerDetailDataLoading,
    error: TrainerDetailDataError,
  } = useQuery({
    queryKey: ["TrainerDetailData"],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/SearchTrainersByNames?names=${name}`)
        .then((res) => res.data),
  });

  const trainer = TrainerDetailData?.[0];

  // Loading state
  if (
    SameTimeDataIsLoading ||
    UsersDataLoading ||
    TrainerDetailDataLoading ||
    SameClassTypeDataIsLoading
  )
    return <Loading />;

  // Error handling
  if (
    SameTimeDataError ||
    UsersDataError ||
    TrainerDetailDataError ||
    SameClassTypeDataError
  ) {
    return <FetchingError />;
  }

  console.log("SameTimeData :", SameTimeData);
  console.log("SameClassTypeData :", SameClassTypeData);
  console.log("UsersData :", UsersData);
  console.log("trainer :", trainer);

  return (
    <div
      className=" bg-fixed bg-cover bg-center bg-linear-to-b from-white/50 to-white/20"
      style={{
        backgroundImage: `url(${Trainer_Details_Page_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Trainer Details */}
      <TrainerBookingDetails trainer={trainer} />

      {/* Booked Table */}
      {/* <BookedTable
        setListedSessions={setListedSessions}
        listedSessions={listedSessions}
        SameTimeData={SameTimeData}
        Day={Day}
        trainer={trainer}
      /> */}

      {/* Classes The Same Day */}
      {/* <SameTimeWeekClass
        SameTimeData={SameTimeData}
        Day={Day}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      /> */}

      {/* Classes The Same Day */}
      {/* <SameClassTypeWeekClass
        SameClassTypeData={SameClassTypeData}
        Day={Day}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      /> */}
    </div>
  );
};

export default TrainersBookings;
