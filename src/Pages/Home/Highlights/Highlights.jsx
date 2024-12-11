import { Link } from "react-router"; // Correct import for React Router
import Title from "../../../Shared/Componenet/Title";

const Highlights = () => {
  const services = [
    {
      icon: "https://i.ibb.co/HXTdzWQ/Dumble.png",
      title: "Personal Training",
      description:
        "Work one-on-one with expert trainers to achieve your goals.",
      link: "/personal-training",
    },
    {
      icon: "https://i.ibb.co/VtBmHkJ/Group.png",
      title: "Group Classes",
      description: "Join dynamic group classes to stay motivated and fit.",
      link: "/group-classes",
    },
    {
      icon: "https://i.ibb.co/MBwPnsQ/Assessments.png",
      title: "Nutrition Guidance",
      description:
        "Get personalized diet plans to complement your fitness journey.",
      link: "/nutrition-guidance",
    },
    {
      icon: "https://i.ibb.co/VBDGH4M/Nutrition.png",
      title: "Fitness Assessments",
      description: "Track your progress with professional assessments.",
      link: "/fitness-assessments",
    },
  ];

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Our Services"} />
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-8 mt-5 md:mt-11 px-2">
          {services.map((service, index) => (
            <Link
              key={index} // Use index as the key since the id is not available
              to={service.link}
              className="block transform transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-white shadow-lg hover:shadow-2xl rounded-lg p-6 text-center h-[190px] w-full flex flex-col justify-between">
                {/* Icon */}
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-12 h-12"
                  />
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
