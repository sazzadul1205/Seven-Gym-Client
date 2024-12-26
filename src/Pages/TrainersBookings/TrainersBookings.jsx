import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loading from "../../Shared/Loading/Loading";
import useAuth from "../../Hooks/useAuth";
import TrainerBookingDetails from "./TrainerBookingDetails/TrainerBookingDetails";
import SameTimeWeekClass from "./SameTimeWeekClass/SameTimeWeekClass";
import BookedTable from "./BookedTable/BookedTable";
import SameClassTypeWeekClass from "./SameClassTypeWeekClass/SameClassTypeWeekClass";

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
        .get(`/Trainers/searchByNames?names=${name}`)
        .then((res) => res.data),
  });

  const trainer = TrainerDetailData?.[0];
  const pricePerSession = trainer?.perSession;

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
    console.error(
      "Error fetching data:",
      SameTimeData || UsersData || TrainerDetailData || SameClassTypeData
    );
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load trainer details.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#F72C5B] py-11 text-center text-white"></div>

      {/* Trainer Details */}
      <TrainerBookingDetails trainer={trainer} />

      {/* Booked Table */}
      <BookedTable
        setListedSessions={setListedSessions}
        pricePerSession={pricePerSession}
        listedSessions={listedSessions}
        SameTimeData={SameTimeData}
        ClassType={ClassType}
        Day={Day}
      />

      {/* Classes The Same Day */}
      <SameTimeWeekClass
        SameTimeData={SameTimeData}
        Day={Day}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      />

      {/* Classes The Same Day */}
      <SameClassTypeWeekClass
        SameClassTypeData={SameClassTypeData}
        Day={Day}
        listedSessions={listedSessions}
        setListedSessions={setListedSessions}
      />
    </div>
  );
};

export default TrainersBookings;
