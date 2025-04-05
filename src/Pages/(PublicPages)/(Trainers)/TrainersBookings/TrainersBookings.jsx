import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";

// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Import Components
import BookedSessionTable from "./BookedSessionTable/BookedSessionTable";
import SameTimeWeekSession from "./SameTimeWeekSession/SameTimeWeekSession";
import TrainerBookingTrainer from "./TrainerBookingTrainer/TrainerBookingTrainer";
import SameClassTypeWeekSession from "./SameClassTypeWeekSession/SameClassTypeWeekSession";
import TrainerBookingSelectedData from "./TrainerBookingSelectedData/TrainerBookingSelectedData";

// Background
import Trainer_Details_Page_Background from "../../../../assets/Trainers-Details-Background/Trainer_Details_Page_Background.jpg";
import AllSessions from "./AllSessions/AllSessions";

const TrainersBookings = () => {
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const { name } = useParams();
  const { user } = useAuth();

  // State for listed sessions
  const [listedSessions, setListedSessions] = useState([]);

  // State for selected session data
  const searchParams = new URLSearchParams(location.search);

  // Extracting day from URL parameters
  const Day = searchParams.get("day");

  // Extracting timeStart from URL parameters
  const TimeStart = searchParams.get("timeStart");

  // Extracting classType from URL parameters
  const ClassType = searchParams.get("classType");

  // Fetch Trainer Detail Data
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

  // Fetch Trainer Schedule
  const {
    data: TrainerScheduleData,
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
  } = useQuery({
    queryKey: ["TrainerScheduleData", name],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByTrainerName?trainerName=${name}`)
        .then((res) => res.data),
  });

  // Check if TrainerScheduleData is an array and has at least one element
  const AllSessionData = TrainerScheduleData?.[0];

  // Fetch Selected Session Data
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
            trainerName: name,
            day: Day,
            time: TimeStart,
          },
        })
        .then((res) => res.data),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Fetch Same Class Type Data
  const {
    data: SameClassTypeData,
    isLoading: SameClassTypeDataIsLoading,
    error: SameClassTypeDataError,
  } = useQuery({
    queryKey: ["SameClassTypeData", name, ClassType],
    queryFn: () =>
      axiosPublic
        .get("/Trainers_Schedule/SameClassTypeSession", {
          params: {
            trainerName: name,
            classType: ClassType,
          },
        })
        .then((res) => res.data),
  });

  // Fetch Same Time Data
  const {
    data: SameTimeData,
    isLoading: SameTimeDataIsLoading,
    error: SameTimeDataError,
  } = useQuery({
    queryKey: ["SameTimeData", name, TimeStart],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/SameStartSession`, {
          params: {
            trainerName: name,
            start: TimeStart,
          },
        })
        .then((res) => res.data),
  });

  // Log TrainerDetailData
  const trainer = TrainerDetailData?.[0];

  //  Set listedSessions from selected session
  useEffect(() => {
    // console.log("SelectedSessionData:", SelectedSessionData);
    if (SelectedSessionData?.session) {
      setListedSessions([SelectedSessionData.session]);
    }
  }, [SelectedSessionData]);

  // Log when listedSessions updates
  useEffect(() => {
    // console.log("Updated listedSessions:", listedSessions);
  }, [listedSessions]);

  if (
    SameTimeDataIsLoading ||
    TrainerScheduleIsLoading ||
    TrainerDetailDataLoading ||
    SameClassTypeDataIsLoading ||
    SelectedSessionDataIsLoading
  )
    return <Loading />;

  if (
    SameTimeDataError ||
    TrainerScheduleError ||
    TrainerDetailDataError ||
    SameClassTypeDataError ||
    SelectedSessionDataError
  )
    return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Trainer_Details_Page_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Selected Trainer Data */}
      <TrainerBookingSelectedData SelectedSessionData={SelectedSessionData} />

      {/* Trainer Information */}
      <TrainerBookingTrainer trainer={trainer} />

      {/* Uncomment as needed */}
      <BookedSessionTable
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      />

      {/* Same Class Type Week Class */}
      <SameClassTypeWeekSession
        ClassType={ClassType}
        listedSessions={listedSessions}
        SameClassTypeData={SameClassTypeData}
        setListedSessions={setListedSessions}
      />

      {/* Same Time Week Class */}
      <SameTimeWeekSession
        Day={Day}
        SameTimeData={SameTimeData}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      />

      {/* Trainer Schedule */}
      <AllSessions
        AllSessionData={AllSessionData}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      />
    </div>
  );
};

export default TrainersBookings;
