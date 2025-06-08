/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import { getGenderIcon } from "../../../../Utility/getGenderIcon";
import { getTierBadge } from "../../../(TrainerPages)/TrainerProfile/TrainerProfileHeader/TrainerProfileHeader";
import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

const AllTrainerScheduleModal = ({ closeModal, selectedSchedule }) => {
  const axiosPublic = useAxiosPublic();
  console.log("selected Schedule :", selectedSchedule);

  // Fetch Booker Data
  const {
    data: TrainerBasicData,
    isLoading: TrainerBasicIsLoading,
    error: TrainerBasicError,
  } = useQuery({
    queryKey: ["TrainerBasic", selectedSchedule?.trainerId],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?id=${selectedSchedule?.trainerId}`)
        .then((res) => res.data),
    enabled: !!selectedSchedule?.trainerId,
  });

  // // Loading state
  if (TrainerBasicIsLoading) return <Loading />;

  // // Error handling
  if (TrainerBasicError) return <FetchingError />;

  console.log(TrainerBasicData);
  // Assuming you receive a `summary` prop object from the parent that looks like your JSON
  const {
    totalSessions,
    totalParticipants,
    totalParticipantLimit,
    unlimitedParticipants,
    daysActive,
    mostCommonClassType,
    earliestStart,
    latestEnd,
    activeHours,
  } = selectedSchedule?.summary || {};

  const { icon: trainerIcon } = getGenderIcon(TrainerBasicData?.gender);

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black pb-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Trainer Schedule : {selectedSchedule?.trainerName}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => closeModal()}
        />
      </div>

      <div className="overflow-auto">
        <div className="flex justify-between bg-gray-200 py-2 px-5 gap-2">
          {/* Trainer information */}
          <div className="min-w-1/2 border-r border-black">
            {/* Information */}
            <div className="flex gap-5 py-2">
              {/* Image */}
              <img
                src={TrainerBasicData?.imageUrl || "/default-profile.png"}
                alt={TrainerBasicData?.name || "Trainer"}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
                loading="lazy"
              />

              {/* Trainer Content */}
              <div className="items-center text-left my-auto space-y-1">
                {/* User Name & Gender */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-xl sm:text-2xl font-bold">
                    {TrainerBasicData?.name || "Unknown Trainer"}
                  </p>
                  {trainerIcon}
                </div>

                {/* Email */}
                <p className="text-center md:text-left italic text-gray-600">
                  {TrainerBasicData?.specialization || "Email Unavailable"}
                </p>

                {/* Tier Badge */}
                {TrainerBasicData?.tier && (
                  <div className="w-full flex justify-center sm:justify-start">
                    <p
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                        TrainerBasicData?.tier || "None"
                      )}`}
                    >
                      {TrainerBasicData?.tier || "None"} Tier
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-1/2">
            <h4 className="font-semibold mb-2 border-b border-gray-300">
              Schedule Summary
            </h4>
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Sessions :</p>
              <p>{totalSessions ?? "-"}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Participants : </p>
              <p>
                {totalParticipants ?? "-"} / {totalParticipantLimit ?? "-"}
              </p>
              {unlimitedParticipants ? (
                <p className="text-sm text-green-600 font-medium">
                  Unlimited Participants
                </p>
              ) : null}
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">Most Common Class Type</p>
              <p>{mostCommonClassType || "-"}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">Class Time : </p>
              <div className="flex items-center gap-2">
                <p>
                  {formatTimeTo12Hour(earliestStart)} -
                  {formatTimeTo12Hour(latestEnd)}
                </p>
                <p>( {activeHours} hrs )</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}

        <div className="inline-block bg-white rounded-md shadow-md p-4  w-full">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Active Days
          </p>
          <p className="text-base text-gray-900 leading-snug">
            {daysActive || (
              <span className="text-gray-400">No data available</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllTrainerScheduleModal;
