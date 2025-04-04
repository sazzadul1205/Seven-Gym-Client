import { useState } from "react";
import { useLocation, useParams } from "react-router";

// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Import Components
import SameTimeWeekClass from "./SameTimeWeekClass/SameTimeWeekClass";
import BookedTable from "./BookedTable/BookedTable";
import SameClassTypeWeekClass from "./SameClassTypeWeekClass/SameClassTypeWeekClass";
import TrainerBookingTrainer from "./TrainerBookingTrainer/TrainerBookingTrainer";

// Fetch Trainer Background Image
import Trainer_Details_Page_Background from "../../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";
import TrainerBookingSelectedData from "./TrainerBookingSelectedData/TrainerBookingSelectedData";

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

  // Fetch next session details using trainerName (or trainerId), day, and time
  const {
    data: SelectedSessionData,
    isLoading: SelectedSessionDataIsLoading,
    error: SelectedSessionDataError,
  } = useQuery({
    queryKey: ["SelectedSessionData", name, Day, TimeStart],
    queryFn: () =>
      axiosPublic
        .get("/Trainers_Schedule/SelectedSession", {
          params: {
            trainerName: name, // or trainerId if available
            day: Day,
            time: TimeStart,
          },
        })
        .then((res) => res.data),
  });

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

  const trainer = TrainerDetailData?.[0];

  // Loading state
  if (
    SameTimeDataIsLoading ||
    UsersDataLoading ||
    TrainerDetailDataLoading ||
    SameClassTypeDataIsLoading ||
    SelectedSessionDataIsLoading
  )
    return <Loading />;

  // Error handling
  if (
    SameTimeDataError ||
    UsersDataError ||
    TrainerDetailDataError ||
    SameClassTypeDataError ||
    SelectedSessionDataError
  )
    return <FetchingError />;

  // console.log("SameTimeData :", SameTimeData);
  // console.log("SameClassTypeData :", SameClassTypeData);
  // console.log("UsersData :", UsersData);
  // console.log("trainer :", trainer);
  // console.log("Selected Session Data :", SelectedSessionData);

  return (
    <div
      className="bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Trainer_Details_Page_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Selected Session Data */}
      <TrainerBookingSelectedData SelectedSessionData={SelectedSessionData} />

      {/* Trainer Details */}
      <TrainerBookingTrainer trainer={trainer} />

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
