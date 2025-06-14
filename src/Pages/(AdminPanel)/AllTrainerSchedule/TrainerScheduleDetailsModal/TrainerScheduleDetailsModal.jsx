// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Shared
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Utility
import { getGenderIcon } from "../../../../Utility/getGenderIcon";
import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

// import Tier Badge
import { getTierBadge } from "../../../(TrainerPages)/TrainerProfile/TrainerProfileHeader/TrainerProfileHeader";

const TrainerScheduleDetailsModal = ({ closeModal, selectedSchedule }) => {
  const axiosPublic = useAxiosPublic();

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

  // Get Gender Icons
  const { icon: trainerIcon } = getGenderIcon(TrainerBasicData?.gender);

  // Loading state
  if (TrainerBasicIsLoading) return <Loading />;

  // Error handling
  if (TrainerBasicError) return <FetchingError />;

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

      {/* Body */}
      <div className="overflow-auto space-y-3">
        {/* Primary Information */}
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

          {/* Summary */}
          <div className="min-w-1/2">
            {/* Title */}
            <h4 className="font-semibold mb-2 border-b border-gray-300">
              Schedule Summary
            </h4>
            {/* Summary Details */}
            <div className="space-y-2">
              {/* Total Sessions */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Sessions :</p>
                <p>{selectedSchedule?.summary?.totalSessions ?? "-"}</p>
              </div>

              {/* Total Participants */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Participants : </p>
                <p>
                  {selectedSchedule?.summary?.totalParticipants ?? "-"} /{" "}
                  {selectedSchedule?.summary?.totalParticipantLimit ?? "-"}
                </p>
                {selectedSchedule?.summary?.unlimitedParticipants ? (
                  <p className="text-sm text-green-600 font-medium">
                    Unlimited Participants
                  </p>
                ) : null}
              </div>

              {/* Common Class Type */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Most Common Class Type</p>
                <p>{selectedSchedule?.summary?.mostCommonClassType || "-"}</p>
              </div>

              {/* Class Type */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Class Time : </p>
                <div className="flex items-center gap-2">
                  <p>
                    {formatTimeTo12Hour(
                      selectedSchedule?.summary?.earliestStart
                    )}{" "}
                    -{formatTimeTo12Hour(selectedSchedule?.summary?.latestEnd)}
                  </p>
                  <p>( {selectedSchedule?.summary?.activeHours} hrs )</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Date */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          {/* Title */}
          <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">
            Active Days
          </p>

          {/* Active day */}
          {selectedSchedule?.summary?.daysActive ? (
            <div className="flex flex-wrap gap-2">
              {selectedSchedule?.summary?.daysActive.split(",").map((day) => (
                <span
                  key={day.trim()}
                  className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium"
                >
                  {day.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No data available</p>
          )}
        </div>

        {/* Schedules */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          {/* Title */}
          <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">
            Schedule
          </p>

          {/* Class Schedule */}
          {selectedSchedule?.trainerSchedule &&
            Object.entries(selectedSchedule?.trainerSchedule).map(
              ([day, sessions]) => (
                <div key={day} className="mb-6">
                  {/* Day Header */}
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {day}
                  </h3>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    {/* Data Table */}
                    <table className="min-w-full table-auto border border-gray-300 text-sm">
                      {/* Table Header */}
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-2">Start - End</th>
                          <th className="px-4 py-2">Class Type</th>
                          <th className="px-4 py-2">Participants</th>
                          <th className="px-4 py-2">Limit</th>
                          <th className="px-4 py-2">Price ($)</th>
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody>
                        {Object.entries(sessions).map(([time, session]) => (
                          <tr key={time} className="border-b">
                            {/* Time */}
                            <td className="border px-4 py-2">
                              {formatTimeTo12Hour(session?.start)} -{" "}
                              {formatTimeTo12Hour(session?.end)}
                            </td>

                            {/* Class Type */}
                            <td className="border px-4 py-2">
                              {session?.classType}
                            </td>

                            {/* Participant Count  */}
                            <td className="border px-4 py-2">
                              {Object.keys(session?.participant || {})?.length}
                            </td>

                            {/* Participant Length */}
                            <td className="border px-4 py-2">
                              {session?.participantLimit}
                            </td>

                            {/* Price */}
                            <td className="border px-4 py-2">
                              {session?.classPrice > 0
                                ? `$ ${session?.classPrice}`
                                : "Free"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

// Prop Validation
TrainerScheduleDetailsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedSchedule: PropTypes.shape({
    trainerId: PropTypes.string,
    trainerName: PropTypes.string,
    summary: PropTypes.shape({
      totalSessions: PropTypes.number,
      totalParticipants: PropTypes.number,
      totalParticipantLimit: PropTypes.number,
      unlimitedParticipants: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
      ]),

      daysActive: PropTypes.string,
      mostCommonClassType: PropTypes.string,
      earliestStart: PropTypes.string,
      latestEnd: PropTypes.string,
      activeHours: PropTypes.number,
    }),
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
          classType: PropTypes.string.isRequired,
          participantLimit: PropTypes.number,
          classPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          participant: PropTypes.oneOfType([
            PropTypes.objectOf(PropTypes.any),
            PropTypes.arrayOf(PropTypes.any),
          ]),
        })
      )
    ),
  }),
};

export default TrainerScheduleDetailsModal;
