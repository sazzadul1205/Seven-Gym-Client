import { useState, useEffect } from "react";

const DailyScheduleSection = ({ userSchedule }) => {
  // State to track selected schedule items and days
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedDays, setSelectedDays] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [pastDatesExist, setPastDatesExist] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Check if past dates exist
    const hasPastDates = Object.values(userSchedule.schedule).some(
      (dayData) => dayData.date < today
    );
    setPastDatesExist(hasPastDates);
  }, [userSchedule, today]);

  // Toggle selection of a single schedule item
  const handleItemSelection = (day, time) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (!newSelection[day]) newSelection[day] = {};

      newSelection[day][time] = !newSelection[day][time];

      // If all items of the day are selected, auto-select the day
      const allTimes = Object.keys(userSchedule.schedule[day].schedule);
      const allSelected = allTimes.every((t) => newSelection[day][t]);

      setSelectedDays((prevDays) => ({
        ...prevDays,
        [day]: allSelected,
      }));

      return newSelection;
    });
  };

  // Toggle selection of a whole day
  const handleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const newSelectedDays = { ...prev, [day]: !prev[day] };

      setSelectedItems((prevItems) => {
        const newItems = { ...prevItems };
        const allTimes = Object.keys(userSchedule.schedule[day].schedule);

        allTimes.forEach((time) => {
          if (!newItems[day]) newItems[day] = {};
          newItems[day][time] = newSelectedDays[day];
        });

        return newItems;
      });

      return newSelectedDays;
    });
  };

  // Toggle selection of all schedule items
  const handleSelectAll = () => {
    const newSelection = !allSelected;
    setAllSelected(newSelection);

    const newSelectedItems = {};
    const newSelectedDays = {};

    Object.entries(userSchedule.schedule).forEach(([day, dayData]) => {
      newSelectedDays[day] = newSelection;
      newSelectedItems[day] = {};
      Object.keys(dayData.schedule).forEach((time) => {
        newSelectedItems[day][time] = newSelection;
      });
    });

    setSelectedItems(newSelectedItems);
    setSelectedDays(newSelectedDays);
  };

  // Get selected IDs
  const getSelectedIds = () => {
    const selectedIds = [];
    Object.entries(selectedItems).forEach(([day, times]) => {
      Object.entries(times).forEach(([time, isSelected]) => {
        if (isSelected) {
          selectedIds.push(userSchedule.schedule[day].schedule[time].id);
        }
      });
    });
    console.log("Selected Schedule IDs:", selectedIds);
  };

  return (
    <div className="p-5">
      {/* Select All Button */}
      <button
        onClick={handleSelectAll}
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>

      {pastDatesExist && (
        <button
          onClick={() => alert("Regenerating past schedule...")}
          className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
        >
          Regenerate Past Schedule
        </button>
      )}

      {Object.entries(userSchedule.schedule).map(([day, dayData]) => {
        const isDaySelected = selectedDays[day];
        const isPast = dayData.date < today;

        return (
          <div
            key={dayData.id}
            className={`collapse collapse-arrow border border-base-300 bg-base-200 mb-4 ${
              isDaySelected || isPast ? "opacity-50" : ""
            }`}
          >
            {/* Collapsible Header */}
            <input type="checkbox" />
            <div className="collapse-title text-lg font-bold text-gray-700 flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!isDaySelected}
                onChange={() => handleDaySelection(day)}
                className="w-5 h-5"
              />
              {dayData.dayName} - {dayData.date} {isPast && "(Past Date)"}
            </div>

            {/* Collapsible Content */}
            <div className="collapse-content">
              {Object.entries(dayData.schedule).map(([time, scheduleItem]) => {
                const isSelected = selectedItems[day]?.[time] || false;

                return (
                  <div
                    key={scheduleItem.id}
                    className={`flex items-center gap-4 p-3 rounded-md mb-2 ${
                      isSelected || isPast
                        ? "opacity-50 bg-gray-300"
                        : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleItemSelection(day, time)}
                      className="w-5 h-5"
                    />
                    <p className="text-md font-semibold text-gray-800">
                      {time}
                    </p>
                    {scheduleItem.title ? (
                      <>
                        <p className="text-gray-600">
                          <strong>Title:</strong> {scheduleItem.title}
                        </p>
                        <p className="text-gray-600">
                          <strong>Notes:</strong>{" "}
                          {scheduleItem.notes || "No notes"}
                        </p>
                        <p className="text-gray-600">
                          <strong>Location:</strong>{" "}
                          {scheduleItem.location || "Not specified"}
                        </p>
                        <p className="text-gray-600">
                          <strong>Status:</strong>{" "}
                          {scheduleItem.status || "Pending"}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">No schedule set.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Button to Log Selected IDs */}
      <button
        onClick={getSelectedIds}
        className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
      >
        Get Selected Schedule IDs
      </button>
    </div>
  );
};

export default DailyScheduleSection;
