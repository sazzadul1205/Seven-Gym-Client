/* eslint-disable react/prop-types */
const SameTimeWeekClass = ({
  SameTimeData,
  Day,
  listedSessions,
  setListedSessions,
}) => {
  const { name, schedule } = SameTimeData;

  // Function to generate a unique key for a session
  const generateKey = (classType, timeStart, timeEnd, day) => {
    return `${classType}-${timeStart}-${timeEnd}-${day}`;
  };

  const handleAddSession = (
    classType,
    timeStart,
    timeEnd,
    day,
    classIdentifier,
    price
  ) => {
    const sessionKey = generateKey(classType, timeStart, timeEnd, day);
    const session = {
      key: sessionKey,
      classType,
      timeStart,
      timeEnd,
      day,
      classIdentifier,
      price, // Add price to the session
    };

    setListedSessions((prev) => {
      const isAlreadyListed = prev.some((s) => s.key === sessionKey);
      if (!isAlreadyListed) {
        return [...prev, session];
      }
      return prev;
    });
  };

  const getClassButton = (
    classType,
    timeStart,
    timeEnd,
    day,
    participants,
    classIdentifier,
    price
  ) => {
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
            onClick={() =>
              handleAddSession(
                classType,
                timeStart,
                timeEnd,
                day,
                classIdentifier,
                price // Pass the price when booking the session
              )
            }
            className="bg-[#F72C5B] text-white px-3 py-2 rounded-2xl hover:bg-[#f72c5b83] w-full"
          >
            Book Session
          </button>
        );
      case "Drop-In Class":
      case "Open Gym Class":
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
          <button className="bg-green-500 text-white px-3 py-2 rounded-2xl hover:bg-green-600 w-full">
            Classes
          </button>
        );
    }
  };

  const filteredSchedule = Object.keys(schedule).filter((day) => day !== Day);

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 shadow-xl rounded-xl">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Schedule for {name} This Week
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSchedule.map((day) => (
          <div
            key={day}
            className="bg-white border rounded-lg shadow-lg py-4 hover:scale-105"
          >
            {schedule[day].map((classItem, index) => (
              <div key={index} className="px-5">
                <h3 className="text-xl font-semibold text-center">{day}</h3>
                <p className="font-semibold text-center italic">
                  {classItem.classType}
                </p>
                <p className="text-center">
                  <strong>Time:</strong> {classItem.timeStart} -{" "}
                  {classItem.timeEnd}
                </p>
                <p className="text-center text-lg font-semibold text-green-500">
                  Price: ${classItem.price} {/* Show the price */}
                </p>
                <div className="py-2">
                  {getClassButton(
                    classItem.classType,
                    classItem.timeStart,
                    classItem.timeEnd,
                    day,
                    classItem.participants || [],
                    classItem.classIdentifier,
                    classItem.price // Pass price to the button
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

export default SameTimeWeekClass;
