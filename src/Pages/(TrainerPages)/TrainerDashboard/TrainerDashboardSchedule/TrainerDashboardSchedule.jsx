// React
import { useMemo } from "react";

// React Router
import { Link } from "react-router";

// Utilities
import getNextClassesInfo from "./getNextClassInfo";

// PropTypes
import PropTypes from "prop-types";

const TrainerDashboardSchedule = ({ TrainerScheduleData }) => {
  const nextClasses = useMemo(
    () => getNextClassesInfo(TrainerScheduleData),
    [TrainerScheduleData]
  );

  return (
    <div className="w-full text-black">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Schedule & Notification
      </h2>

      {/* Layout container */}
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* ---------------------- Upcoming Classes ---------------------- */}
        <div className="md:w-2/3 w-full border border-gray-300 rounded-xl p-4 sm:p-5 bg-white shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Upcoming Classes
          </h3>
          <div className="h-[2px] bg-gradient-to-r from-black to-gray-500 mb-4" />

          {nextClasses?.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {nextClasses.map((next, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden min-w-0"
                >
                  {/* Day & Date */}
                  <div className="bg-gray-200 flex justify-center py-2 gap-5 flex-wrap text-center sm:text-left">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-500 uppercase">
                        Day:
                      </p>
                      <p className="text-sm sm:text-lg font-semibold">
                        {next.day}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-500 uppercase">
                        Date:
                      </p>
                      <p className="text-sm sm:text-lg font-semibold">
                        {next.date}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-center gap-2 sm:gap-5 py-2 bg-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 uppercase">
                      Time
                    </p>
                    <p className="text-sm sm:text-lg font-semibold">
                      {next.start} - {next.end}
                    </p>
                  </div>

                  {/* Class Type & Participants */}
                  <div className="bg-gray-50 flex justify-between py-2 px-3 gap-2 sm:gap-5 text-sm sm:text-base">
                    <div className="flex items-center">
                      <span className="text-xl sm:text-2xl mr-2">🏷️</span>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 uppercase">
                          Class Type
                        </p>
                        <p className="font-semibold">{next.classType}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="text-xl sm:text-2xl mr-2">👥</span>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 uppercase">
                          Participants
                        </p>
                        <p className="font-semibold">{next.participantCount}</p>
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

        {/* ---------------------- Notifications ---------------------- */}
        <div className="md:w-1/3 w-full border border-gray-300 rounded-xl p-4 sm:p-5 bg-white shadow-md">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
            Notifications & Messages
          </h3>

          <div className="bg-gray-100 rounded-lg p-4 space-y-3 text-gray-800 shadow-inner">
            {/* Notification Links */}
            {[
              {
                to: "/Trainer?tab=Trainer_Booking_Request",
                label: "New Booking Request",
                color: "green",
              },
              {
                to: "/Trainer?tab=Schedule_Participant",
                label: "Cancellation Notice",
                color: "red",
              },
              {
                to: "/Trainer?tab=Trainer_Testimonials",
                label: "Client Feedback Alert",
                color: "blue",
              },
              {
                to: "/Trainer?tab=Trainer_Announcement_Board",
                label: "System Announcement",
                color: "yellow",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span className={`text-${item.color}-600 text-xl sm:text-2xl`}>
                  •
                </span>
                <p className={`hover:ml-2 hover:text-${item.color}-600`}>
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
TrainerDashboardSchedule.propTypes = {
  TrainerScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired, // Ensure day is always present
      date: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      participantCount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TrainerDashboardSchedule;
