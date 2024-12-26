/* eslint-disable react/prop-types */
const SameClassTypeWeekClass = ({
  SameClassTypeData,
  listedSessions,
  setListedSessions,
}) => {
  const { name, schedule } = SameClassTypeData;

  // Function to generate a unique key for a session
  const generateKey = (classType, timeStart, timeEnd, day) => {
    return `${classType}-${timeStart}-${timeEnd}-${day}`;
  };

  // Function to format the date for each day
  const formatDate = (day) => {
    const date = new Date();
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(day);
    date.setDate(date.getDate() + ((dayIndex - date.getDay() + 7) % 7)); // Adjusts the date to the specific day
    return date.toLocaleDateString(); // Returns formatted date (e.g., 12/26/2024)
  };

  const handleAddSession = (classType, timeStart, timeEnd, day) => {
    const sessionKey = generateKey(classType, timeStart, timeEnd, day);
    const session = { key: sessionKey, classType, timeStart, timeEnd, day };

    setListedSessions((prev) => {
      const isAlreadyListed = prev.some((s) => s.key === sessionKey);
      if (!isAlreadyListed) {
        return [...prev, session];
      }
      return prev;
    });
  };

  const getClassButton = (classType, timeStart, timeEnd, day, participants) => {
    const sessionKey = generateKey(classType, timeStart, timeEnd, day);
    const isListed = listedSessions.some((s) => s.key === sessionKey);

    if (
      participants.length === 1 &&
      ![
        "Group Classes",
        "Online Class",
        "Outdoor Class",
        "Partner Workout",
      ].includes(classType)
    ) {
      return (
        <div className="flex mx-auto w-[180px]">
          <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
            Booked
          </button>
        </div>
      );
    }

    if (isListed) {
      return (
        <div className="flex mx-auto w-[180px]">
          <button className="bg-gray-400 text-white font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
            Listed
          </button>
        </div>
      );
    }

    switch (classType) {
      case "Group Classes":
      case "Online Class":
      case "Outdoor Class":
      case "Partner Workout":
      case "Private Training":
      case "Semi-Private Training":
      case "Workshops":
        return (
          <button
            onClick={() => handleAddSession(classType, timeStart, timeEnd, day)}
            className="bg-[#F72C5B] text-white px-3 py-2 rounded-2xl hover:bg-[#f72c5b83] w-full"
          >
            Book Session
          </button>
        );
      case "Drop-In Class":
        return (
          <div className="flex mx-auto w-[180px]">
            <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
              Free Class
            </button>
          </div>
        );
      case "Break":
        return (
          <div className="flex mx-auto w-[180px]">
            <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
              On a Break
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => handleAddSession(classType, timeStart, timeEnd, day)}
            className="bg-green-500 text-white px-3 py-2 rounded-2xl hover:bg-green-600 w-full"
          >
            Visit Class
          </button>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 shadow-xl rounded-xl py-5">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Same Class Schedule for {name} This Week
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Loop through each day in the schedule */}
        {Object.keys(schedule).map((day) => (
          <div key={day} className="py-4">
            {/* Display day name and the formatted date */}
            <div className="text-center mb-3">
              <h3 className="text-xl font-semibold">{day}</h3>
              <p className="text-gray-600">{formatDate(day)}</p>
            </div>

            {schedule[day].map((classItem, index) => (
              <div
                key={index}
                className="px-5 py-3 my-2 bg-white shadow-2xl rounded-2xl  hover:scale-105"
              >
                <p className="font-semibold text-center italic">
                  {classItem.classType}
                </p>
                <p className="text-center">
                  <strong>Time:</strong> {classItem.timeStart} -{" "}
                  {classItem.timeEnd}
                </p>
                <div className="py-2">
                  {getClassButton(
                    classItem.classType,
                    classItem.timeStart,
                    classItem.timeEnd,
                    day,
                    classItem.participants || []
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SameClassTypeWeekClass;
