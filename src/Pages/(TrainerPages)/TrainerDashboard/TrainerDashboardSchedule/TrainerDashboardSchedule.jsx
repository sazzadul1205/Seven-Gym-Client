import { useMemo } from "react";
import getNextClassesInfo from "./getNextClassInfo";

const TrainerDashboardSchedule = ({ TrainerScheduleData }) => {
  const nextClasses = useMemo(
    () => getNextClassesInfo(TrainerScheduleData),
    [TrainerScheduleData]
  );

  return (
    <div className="w-full text-black px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        Trainer Schedule & Notification
      </h2>

      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Next Classes */}
        <div className="md:w-2/3 w-full border border-gray-300 rounded-xl p-5 bg-white shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Classes
          </h3>
          <div className="h-[2px] bg-gradient-to-r from-black to-gray-500 mb-4" />

          {nextClasses && nextClasses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {nextClasses.map((next, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Day & Date */}
                  <div className="bg-gray-200 justify-center flex py-2 gap-5">
                    {/* Day */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 uppercase">Day :</p>
                      <p className="text-lg font-semibold">{next.day}</p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 uppercase">Date :</p>
                      <p className="text-lg font-semibold">{next.date}</p>
                    </div>
                  </div>

{/* Start and End  */}
                  <div className="flex items-center justify-center gap-5 py-2 bg-gray-100">
                    <p className="text-sm text-gray-500 uppercase">Time</p>
                    <p className="text-lg font-semibold">
                      {next.start} - {next.end}
                    </p>
                  </div>

                  {/* Class Type & Participants */}
                  <div className="bg-gray-50 justify-between flex py-2 px-3 gap-5">
                    {/*  Class Type */}
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🏷️</span>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">
                          Class Type
                        </p>
                        <p className="text-lg font-semibold">
                          {next.classType}
                        </p>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">👥</span>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">
                          Participants
                        </p>
                        <p className="text-lg font-semibold">
                          {next.participantCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No upcoming classes found.</p>
          )}
        </div>

        {/* Notification Placeholder */}
        <div className="md:w-1/3 w-full bg-amber-400 rounded-xl p-5 shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">
            Notifications
          </h3>
          <p className="text-white">No new notifications.</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardSchedule;
