const gymFeatures = [
  {
    id: 1,
    title: "Modern Equipment",
    description: "State-of-the-art fitness machines for every workout.",
    icon: "https://via.placeholder.com/100x100?text=Equipment",
  },
  {
    id: 2,
    title: "Spacious Workout Areas",
    description: "Plenty of space to move around and get your workout done.",
    icon: "https://via.placeholder.com/100x100?text=Workout+Space",
  },
  {
    id: 3,
    title: "Clean and Sanitized Environment",
    description: "We maintain high standards of cleanliness and hygiene.",
    icon: "https://via.placeholder.com/100x100?text=Clean",
  },
  {
    id: 4,
    title: "Locker and Shower Facilities",
    description: "Secure lockers and refreshing showers for your convenience.",
    icon: "https://via.placeholder.com/100x100?text=Locker",
  },
  {
    id: 5,
    title: "Personal Trainers",
    description: "Certified trainers to help you achieve your fitness goals.",
    icon: "https://via.placeholder.com/100x100?text=Trainer",
  },
  {
    id: 6,
    title: "Group Classes",
    description: "Join engaging classes like yoga, Zumba, and aerobics.",
    icon: "https://via.placeholder.com/100x100?text=Classes",
  },
  {
    id: 7,
    title: "Nutrition Advice",
    description: "Get expert guidance on diet and nutrition plans.",
    icon: "https://via.placeholder.com/100x100?text=Nutrition",
  },
  {
    id: 8,
    title: "24/7 Access",
    description: "Work out at your convenience with round-the-clock access.",
    icon: "https://via.placeholder.com/100x100?text=Access",
  },
];

const GymFeatures = () => {
  return (
    <div className="py-16 ">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Gym Features
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-11">
          {gymFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-110"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymFeatures;
