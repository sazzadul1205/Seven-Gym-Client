// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import  Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Icons
import { FaEdit, FaRegTrashAlt, FaRegUser } from "react-icons/fa";
import { useState } from "react";

// Helper function: Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const TrainerSchedule = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch trainer data based on logged-in user's email
  const {
    data: MyTrainerData = [],
    isLoading: MyTrainerDataLoading,
    error: MyTrainerDataError,
  } = useQuery({
    queryKey: ["MyTrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email, // Runs only if email exists
  });

  // Extract trainer details
  const TrainerProfileData = MyTrainerData?.[0] || null;

  // Fetch trainer schedule data
  const {
    data: TrainerScheduleData = [],
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
    enabled: !!TrainerProfileData?.name, // Runs only if trainer's name exists
  });

  // Fetch available class types from API
  const {
    data: classTypes = [],
    isLoading: classTypesLoading,
    error: classTypesError,
  } = useQuery({
    queryKey: ["TrainerClassTypes"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/classTypes`).then((res) => res.data),
  });

  // Extract schedule details
  const TrainerProfileScheduleData = TrainerScheduleData?.[0] || null;
  const scheduleObj = TrainerProfileScheduleData?.trainerSchedule || {};
  const initialSchedule = TrainerProfileScheduleData?.trainerSchedule || {};

  // State to manage temporary schedule changes
  const [tempSchedule, setTempSchedule] = useState(initialSchedule);
  const [changesMade, setChangesMade] = useState(false);

  // Handle Loading and Errors
  if (MyTrainerDataLoading || TrainerScheduleIsLoading || classTypesLoading)
    return <Loading />;
  if (MyTrainerDataError || TrainerScheduleError || classTypesError)
    return (
      <FetchingError
        error={MyTrainerDataError || TrainerScheduleError || classTypesError}
      />
    );

  // Function to clear class data except time
  const handleClear = (day, time) => {
    setTempSchedule((prev) => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [time]: {
            ...prev[day][time],
            classType: "",
            participantLimit: "",
            classPrice: "",
          },
        },
      };
      setChangesMade(true);
      return updated;
    });
  };

  console.log(classTypes);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <h2 className="text-center text-black font-semibold text-2xl">
          {TrainerProfileData?.name || "Trainer"}&apos;s Schedule Management
        </h2>

        {/* Divider */}
        <div className="mx-auto w-1/2 h-1 bg-black my-2"></div>

        <div className="bg-gray-100">
          <p>Day Management</p>
        </div>

        {/* Schedule Display */}
        <div className="mt-6 space-y-6">
          {Object.entries(scheduleObj).map(([day, classesObj]) => {
            const classes = Object.values(classesObj);
            return (
              <div
                key={day}
                className="bg-linear-to-bl from-gray-100 to-gray-300 p-4 rounded-lg shadow"
              >
                {/* Day Header */}
                <h3 className="text-xl font-semibold text-black">{day}</h3>

                {/* Mobile View */}
                <div className="block sm:hidden">
                  {classes.map((classDetails, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={`text-black text-center ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } mt-3 p-4 rounded border`}
                    >
                      <p className="font-semibold">
                        {classDetails.start} - {classDetails.end}
                      </p>
                      <p>Class Type: {classDetails.classType}</p>
                      <p>
                        Participant Limit:{" "}
                        {classDetails.participantLimit === "No limit" ||
                        classDetails.participantLimit === "No Limit"
                          ? "No Limit"
                          : classDetails.participantLimit}
                      </p>
                      <p>
                        Price:{" "}
                        {typeof classDetails.classPrice === "string" &&
                        classDetails.classPrice.toLowerCase() === "free"
                          ? "Free"
                          : `$${classDetails.classPrice}`}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block">
                  <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mt-4">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b bg-gray-200">Time</th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Class Type
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Participant Limit
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Price
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(classesObj).map(
                        ([time, classDetails]) => (
                          <tr
                            key={`${day}-${time}`}
                            className="border-b bg-gray-50"
                          >
                            <td className="flex px-4 py-3">
                              <span className="w-20">
                                {formatTimeTo12Hour(classDetails.start)}
                              </span>
                              <span className="px-5">-</span>
                              <span className="w-20">
                                {" "}
                                {formatTimeTo12Hour(classDetails.end)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {classDetails.classType}
                            </td>
                            <td className="px-4 py-2">
                              {classDetails.participantLimit === "No limit" ||
                              classDetails.participantLimit === "No Limit" ? (
                                "No Limit"
                              ) : (
                                <div className="flex items-center gap-5">
                                  <span>{classDetails.participantLimit}</span>
                                  <FaRegUser />
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {typeof classDetails.classPrice === "string" &&
                              classDetails.classPrice.toLowerCase() === "free"
                                ? "Free"
                                : `$${classDetails.classPrice}`}
                            </td>
                            <td className="flex px-4 py-2 gap-2">
                              {/* Clear Button */}
                              <button
                                className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white rounded-full p-2 cursor-pointer"
                                onClick={() => handleClear(day, time)}
                              >
                                <FaRegTrashAlt />
                              </button>
                              {/* Edit Button */}
                              <button className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 text-white rounded-full p-2 cursor-pointer">
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainerSchedule;
