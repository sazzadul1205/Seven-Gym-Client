import { useParams, useLocation } from "react-router";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loading from "../../Shared/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import AllWeekClasses from "./AllWeekClasses/AllWeekClasses";
import { useState } from "react";
import PaymentTrainerDetails from "./PaymentTrainerDetails/PaymentTrainerDetails";

const TrainerPayment = () => {
  const axiosPublic = useAxiosPublic();
  const { name } = useParams();
  const location = useLocation();
  const { user } = useAuth(); // Access user context

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const day = searchParams.get("day");
  const timeStart = searchParams.get("timeStart");
  const initialClassType = searchParams.get("classType");

  // Local state for toggling classType
  const [currentClassType, setCurrentClassType] = useState(initialClassType);

  // Fetch session details
  const {
    data: SessionData,
    isLoading: SessionDataIsLoading,
    error: SessionDataError,
  } = useQuery({
    queryKey: ["trainerSession", name, day, timeStart],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/schedule`, {
          params: { name, day, timeStart },
        })
        .then((res) => res.data),
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

  // Fetch classes with the same timeStart all week
  const {
    data: AllWeekClassesData,
    isLoading: AllWeekClassesDataLoading,
    error: AllWeekClassesDataError,
  } = useQuery({
    queryKey: ["AllWeekClassesData", currentClassType],
    queryFn: () =>
      axiosPublic
        .get(
          `/Trainers_Schedule/searchTimeAndType?name=${name}&timeStart=${timeStart}`
        )
        .then((res) => res.data),
  });

  // Loading state
  if (
    SessionDataIsLoading ||
    TrainerDetailDataLoading ||
    UsersDataLoading ||
    AllWeekClassesDataLoading
  )
    return <Loading />;

  // Error handling
  if (
    SessionDataError ||
    TrainerDetailDataError ||
    UsersDataError ||
    AllWeekClassesDataError
  ) {
    console.error("Error fetching data:", SessionDataError || UsersDataError);
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

  const trainer = TrainerDetailData[0];
  const handlePayment = () => {
    alert(
      "This is a demo payment gateway. Payment processing is not implemented."
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#F72C5B] py-11 text-center text-white">
        <h1 className="text-4xl font-bold">Book a Session</h1>
        <p className="mt-4 text-lg">
          Trainer: <strong>{name}</strong> | Day: <strong>{day}</strong> | Time
          Start: <strong>{timeStart}</strong>
        </p>
      </div>

      {/* Trainer Details */}
      <PaymentTrainerDetails trainer={trainer} />

      {/* Payment Section */}
      <div className="p-8 bg-gray-100">
        <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-6">
          {/* User Details Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <p className="text-gray-700">
              <strong>Full Name:</strong> {UsersData.fullName || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {UsersData.phone || "N/A"}
            </p>
          </div>

          {/* Payment Details Section */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <p className="text-gray-700 mb-6">
              Booking this session with <strong>{trainer.name}</strong> will
              cost <strong>${trainer.perSession}</strong>.
            </p>
            <button
              onClick={handlePayment}
              className="px-6 py-3 bg-[#F72C5B] text-white font-bold rounded-lg hover:bg-[#e02550] transition"
            >
              Send Booking Request
            </button>
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="p-8 bg-gray-50">
        <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Session Details</h2>
          <p className="text-gray-700">
            <strong>Time Start:</strong> {SessionData.timeStart}
          </p>
          <p className="text-gray-700">
            <strong>Time End:</strong> {SessionData.timeEnd}
          </p>
          <p className="text-gray-700">
            <strong>Class Type:</strong> {SessionData.classType}
          </p>
          <p className="text-gray-700">
            <strong>Participants:</strong>{" "}
            {SessionData.participants.length > 0
              ? SessionData.participants.join(", ")
              : "No participants yet."}
          </p>
        </div>
      </div>

      {/* Other sections */}
      <AllWeekClasses
        allWeekClasses={AllWeekClassesData}
        classType={currentClassType}
        onToggleClassType={(type) => setCurrentClassType(type)}
      />
    </div>
  );
};

export default TrainerPayment;
