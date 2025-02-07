
import Background from "../../../../assets/Background.jpeg";

import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching AboutUs Data
  const {
    data: AboutUsData,
    isLoading: AboutUsDataIsLoading,
    error: AboutUsDataError,
  } = useQuery({
    queryKey: ["AboutUsData"],
    queryFn: () => axiosPublic.get(`/AboutUs`).then((res) => res.data[0]), // Access the first object
  });

  // Loading and error states (render below hooks)
  if (AboutUsDataIsLoading) {
    return <Loading />;
  }

  if (AboutUsDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
      }}
      className="bg-fixed bg-cover bg-center min-h-screen"
    >
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${AboutUsData.heroImage})` }}
      ></div>

      {/* Introduction Section */}
      <div className="container mx-auto px-4 py-16 text-white">
        <h2 className="text-3xl md:text-4xl font-bold  text-center mb-8">
          {AboutUsData.introduction.title}
        </h2>
        <p className="text-lg text-center max-w-4xl mx-auto">
          {AboutUsData.introduction.description}
        </p>
        <div className="flex justify-center mt-8">
          <img
            src={AboutUsData.introduction.image}
            alt="Our Gym"
            className="rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/2"
          />
        </div>
      </div>

      {/* Mission, Vision, and Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {AboutUsData.missionVisionValues.map((item, index) => (
            <div key={index} className="text-center">
              <img src={item.image} alt={item.title} className="w-16 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Why Choose <span className="text-yellow-500">Us</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AboutUsData.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-20 mx-auto"
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

      {/* Our Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Meet Our <span className="text-yellow-500">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AboutUsData.teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center bg-gray-50 p-6 rounded-lg shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-yellow-500 py-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {AboutUsData.callToAction.title}
        </h2>
        <p className="text-lg text-white mb-6">
          {AboutUsData.callToAction.description}
        </p>
        <a
          href={AboutUsData.callToAction.buttonLink}
          className="px-6 py-3 bg-white text-yellow-500 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          {AboutUsData.callToAction.buttonText}
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
