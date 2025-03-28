import { FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const ScheduleSettings = ({ UserScheduleData, refetch }) => {
  return (
    <div>
      {/* Top part */}
      <div className="bg-gray-400/50 p-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-black py-1">
          Schedule for the Whole Week
        </h3>
        {/* Divider */}
        <div className="bg-white p-[2px] w-1/2"></div>
        {/* Buttons */}
        <div className="flex justify-between items-center pt-2">
          {/* Delete button */}
          <div>
            <button className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-lg text-xl font-semibold gap-3 px-8 py-3 cursor-pointer">
              Delete
              <FaRegTrashAlt />
            </button>
          </div>

          {/* Re-Generate button */}
          <div>
            <button
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
              data-tooltip-id="ReGenerateToolTip"
            >
              <FiRefreshCcw />
            </button>
            <Tooltip
              id="ReGenerateToolTip"
              place="top"
              content="Generate All 'Passed' Schedules"
            />
          </div>

          {/* Time Change button */}
          <div>
            <button
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
              data-tooltip-id="manageTimeToolTip"
            >
              <FaRegClock />
            </button>
            <Tooltip id="manageTimeToolTip" place="top" content="Time Change" />
          </div>
        </div>
      </div>

      {/* List of days */}
      <div className="space-y-4 mt-4">
        {Object.keys(UserScheduleData).map((day) => {
          const dayData = UserScheduleData[day];
          return (
            <div key={day} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-700">
                {dayData.dayName}
              </h4>
              <p className="text-sm text-gray-500">{dayData.date}</p>

              {/* Schedule for the day */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                {Object.keys(dayData.schedule).map((time) => {
                  const schedule = dayData.schedule[time];
                  return (
                    <div
                      key={schedule.id}
                      className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700">{time}</span>
                        <span className="text-xs text-gray-500">
                          {schedule.title || "No Title"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-2"
                          data-tooltip-id="timeEditToolTip"
                        >
                          <FaRegClock />
                        </button>
                        <Tooltip
                          id="timeEditToolTip"
                          place="top"
                          content="Edit Time"
                        />

                        <button
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2"
                          data-tooltip-id="timeDeleteToolTip"
                        >
                          <FaRegTrashAlt />
                        </button>
                        <Tooltip
                          id="timeDeleteToolTip"
                          place="top"
                          content="Delete Schedule"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleSettings;
