const trainersData = [
  {
    id: 1,
    name: "John Doe",
    specialization: "Fitness Expert",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Gold",
    availableFrom: "9:00 AM", // Time available from
    availableUntil: "6:00 PM", // Time available until
    availableDays: ["Monday", "Wednesday", "Friday"], // Available days
  },
  {
    id: 2,
    name: "Jane Smith",
    specialization: "Yoga Instructor",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Silver",
    availableFrom: "8:00 AM",
    availableUntil: "5:00 PM",
    availableDays: ["Tuesday", "Thursday", "Saturday"], // Available days
  },
  {
    id: 3,
    name: "Robert Lee",
    specialization: "Personal Trainer",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Diamond",
    availableFrom: "10:00 AM",
    availableUntil: "7:00 PM",
    availableDays: ["Monday", "Wednesday", "Friday", "Sunday"], // Available days
  },
  {
    id: 4,
    name: "Emily Turner",
    specialization: "Pilates Instructor",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Gold",
    availableFrom: "7:00 AM",
    availableUntil: "3:00 PM",
    availableDays: ["Monday", "Thursday"], // Available days
  },
  {
    id: 5,
    name: "Michael Adams",
    specialization: "Strength Coach",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Platinum",
    availableFrom: "9:30 AM",
    availableUntil: "6:30 PM",
    availableDays: ["Tuesday", "Wednesday", "Friday"], // Available days
  },
  {
    id: 6,
    name: "Sarah Lee",
    specialization: "Cardio Specialist",
    imageUrl: "https://i.ibb.co.com/Tryb0YT/User.jpg",
    tier: "Diamond",
    availableFrom: "8:00 AM",
    availableUntil: "5:00 PM",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"], // Available days
  },
];

const FeaturedTrainers = () => {
  // Function to return tier badge style
  const getTierBadge = (tier) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500 text-white";
      case "Silver":
        return "bg-gray-400 text-white";
      case "Diamond":
        return "bg-blue-600 text-white";
      case "Platinum":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Our Featured Teachers
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-11">
          {trainersData.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col"
            >
              {/* Tier Badge */}
              <span
                className={`absolute opacity-80 top-4 left-4 inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTierBadge(
                  trainer.tier
                )}`}
              >
                {trainer.tier} Tier
              </span>

              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-left flex-1">
                <h3 className="text-2xl font-bold ">{trainer.name}</h3>
                <p className="font-semibold">({trainer.specialization})</p>

                {/* Active Time Works */}
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Active Time: </strong>
                    {trainer.availableFrom} - {trainer.availableUntil}
                  </p>
                  <p>
                    <strong>Available Days: </strong>
                    {trainer.availableDays.join(", ")}
                  </p>
                </div>
              </div>

              {/* Book Teacher Button */}
              <div className="mt-auto mb-1 mx-1">
                <button className="px-6 py-2 font-semibold border-2 border-[#F72C5B] hover:bg-[#F72C5B] text-[#F72C5B] hover:text-white w-full">
                  Book Teacher
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className=" px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Find More Teachers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTrainers;
