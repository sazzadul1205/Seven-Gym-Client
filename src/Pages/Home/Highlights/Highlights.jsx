import { FaDumbbell, FaUsers, FaAppleAlt, FaHeartbeat } from "react-icons/fa";
import { Link } from "react-router"; // Correct import for React Router

const Highlights = () => {
  const services = [
    {
      id: 1,
      icon: <FaDumbbell className="text-4xl text-blue-500" />,
      title: "Personal Training",
      description:
        "Work one-on-one with expert trainers to achieve your goals.",
      link: "/personal-training",
    },
    {
      id: 2,
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: "Group Classes",
      description: "Join dynamic group classes to stay motivated and fit.",
      link: "/group-classes",
    },
    {
      id: 3,
      icon: <FaAppleAlt className="text-4xl text-blue-500" />,
      title: "Nutrition Guidance",
      description:
        "Get personalized diet plans to complement your fitness journey.",
      link: "/nutrition-guidance",
    },
    {
      id: 4,
      icon: <FaHeartbeat className="text-4xl text-blue-500" />,
      title: "Fitness Assessments",
      description: "Track your progress with professional assessments.",
      link: "/fitness-assessments",
    },
  ];

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Our Services
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-11">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.link}
              className="block transform transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-white shadow-lg hover:shadow-2xl rounded-lg p-6 text-center h-[180px] w-full flex flex-col justify-between">
                {/* Icon */}
                <div className="flex justify-center items-center mb-4">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlights;
