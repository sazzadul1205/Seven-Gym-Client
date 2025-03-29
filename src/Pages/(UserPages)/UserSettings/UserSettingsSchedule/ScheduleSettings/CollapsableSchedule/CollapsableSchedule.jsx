import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const CollapsableSchedule = () => {
  return (
    <div className="space-y-4">
      {Object.keys(UserScheduleData).map((day) => {
        // Use dayData.date for day status
        const dayData = UserScheduleData[day];
        const dayStatus = getDayStatus(dayData.date);
        const isExpanded = expandedDays.has(day);
        // Get all schedule IDs for the day and check if all are selected
        const dayScheduleIds = Object.keys(dayData.schedule).map(
          (time) => dayData.schedule[time].id
        );
        const allSelected =
          dayScheduleIds.length > 0 &&
          dayScheduleIds.every((id) => selectedSchedules.has(id));

        return (
          <div
            key={day}
            className="bg-gray-100 border border-gray-300 rounded-lg"
          >
            {/* Day Header */}
            <div
              className="font-semibold text-black flex items-center gap-3 p-3 cursor-pointer"
              onClick={() => toggleCollapse(day, dayStatus)}
            >
              {/* Day Checkbox: disabled & grayed if the day has passed */}
              <input
                type="checkbox"
                className="checkbox checkbox-error border-black"
                checked={allSelected}
                onChange={handleDayCheckboxChange(dayData)}
                onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
                disabled={dayStatus === "passed"}
              />
              {/* Day Information */}
              <div
                className={`flex items-center gap-5 border-l-2 pl-2 ${
                  dayStatus === "passed"
                    ? "border-gray-400 text-gray-400"
                    : "border-black text-black"
                }`}
              >
                <p className="w-[80px]">{dayData.dayName}</p>
                <p>[ {dayData.date} ]</p>
              </div>
              {/* Regenerate option for passed day */}
              {dayStatus === "passed" && (
                <div className="flex items-center gap-4 ml-7">
                  <p className="text-red-500 font-semibold">
                    Day has passed. Generate new day.
                  </p>

                  {/* Generate Button */}
                  <CommonButton
                    text="Generate"
                    bgColor="red"
                    py="py-2"
                    clickEvent={() =>
                      handleRegenerateClick(dayData.dayName, dayData.schedule)
                    }
                  />
                  <p className="text-red-500 font-semibold">
                    {/* for [{updated date}] */}
                  </p>
                </div>
              )}
            </div>

            {/* Collapse Content: Schedule Items */}
            <div
              className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                dayStatus === "passed"
                  ? "max-h-0 opacity-0" // Force closed if passed
                  : isExpanded
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3">
                <div className="space-y-4">
                  {Object.keys(dayData.schedule).map((time) => {
                    const schedule = dayData.schedule[time];
                    const { originalTime, updatedTime } = formatTime(time);
                    return (
                      <div
                        key={schedule.id}
                        // Schedule item: light red background if selected; white otherwise
                        className={`flex justify-between items-center p-3 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md ${
                          selectedSchedules.has(schedule.id)
                            ? "bg-red-100"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Schedule Checkbox */}
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error border-black"
                            checked={selectedSchedules.has(schedule.id)}
                            onChange={() =>
                              handleScheduleCheckboxChange(schedule.id)
                            }
                            onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
                          />
                          {/* Time Range */}
                          <div className="flex justify-between font-semibold text-black gap-5 w-[220px] border-l-2 border-gray-500 pl-5">
                            <p>{originalTime}</p>
                            <p>-</p>
                            <p>{updatedTime}</p>
                          </div>
                          {/* Schedule Details */}
                          <div className="border-l-2 border-gray-500 pl-5">
                            {schedule.title ? (
                              <div className="text-xs text-gray-600 mt-1">
                                <p>
                                  <strong>Title:</strong> {schedule.title}
                                </p>
                                {schedule.notes && (
                                  <p>
                                    <strong>Notes:</strong> {schedule.notes}
                                  </p>
                                )}
                                {schedule.location && (
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    {schedule.location}
                                  </p>
                                )}
                                {schedule.status && (
                                  <p>
                                    <strong>Status:</strong> {schedule.status}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nothing scheduled yet
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CollapsableSchedule;
