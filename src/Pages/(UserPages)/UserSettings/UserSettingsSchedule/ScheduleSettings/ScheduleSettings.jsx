import { FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const ScheduleSettings = ({ UserScheduleData, refetch }) => {
  console.log(UserScheduleData);
  
  return (
    <div>
      {/* Top part */}
      <div className="bg-gray-400/50 p-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-black py-1">
          Schedule for the The Whole Week
        </h3>
        {/* Divider */}
        <div className="bg-white p-[2px] w-1/2"></div>
        {/* Buttons */}
        <div className="flex justify-between items-center pt-2">
          {/* Delete button */}
          <div>
            <button className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-lg text-xl font-semibold gap-3 px-8 py-3 cursor-pointer ">
              Delete
              <FaRegTrashAlt />
            </button>
          </div>

          {/* Re-Generate button */}
          <div>
            <button
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer "
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
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer "
              data-tooltip-id="manageTimeToolTip"
            >
              <FaRegClock />
            </button>
            <Tooltip id="manageTimeToolTip" place="top" content="Time Change" />
          </div>
        </div>
      </div>

      {/* List */}
      <div>
        
      </div>
    </div>
  );
};

export default ScheduleSettings;
