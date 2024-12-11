import Title from "../../../Shared/Componenet/Title";

const gymFeatures = [
  {
    title: "Modern Equipment",
    description: "State-of-the-art fitness machines for every workout.",
    icon: "https://i.ibb.co.com/1fGh9H9/Modern-Gym.png",
  },
  {
    title: "Spacious Workout Areas",
    description: "Plenty of space to move around and get your workout done.",
    icon: "https://i.ibb.co.com/Pc5q2kx/Spacious.png",
  },
  {
    title: "Clean and Sanitized Environment",
    description: "We maintain high standards of cleanliness and hygiene.",
    icon: "https://i.ibb.co.com/4sTr3n7/Cleaning.png",
  },
  {
    title: "Locker and Shower Facilities",
    description: "Secure lockers and refreshing showers for your convenience.",
    icon: "https://i.ibb.co.com/dDfFCY3/Locker.png",
  },
  {
    title: "Personal Trainers",
    description: "Certified trainers to help you achieve your fitness goals.",
    icon: "https://i.ibb.co.com/Xbdy73G/Personal.png",
  },
  {
    title: "Group Classes",
    description: "Join engaging classes like yoga, Zumba, and aerobics.",
    icon: "https://i.ibb.co.com/zF3dGTX/Group-class.png",
  },
  {
    title: "Nutrition Advice",
    description: "Get expert guidance on diet and nutrition plans.",
    icon: "https://i.ibb.co.com/ZgG2wwV/Nutrition.png",
  },
  {
    title: "24/7 Access",
    description: "Work out at your convenience with round-the-clock access.",
    icon: "https://i.ibb.co.com/1rPYvyn/24-hours.png",
  },
];

const GymFeatures = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Gym Features"} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-8 mt-6 md:mt-11">
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
