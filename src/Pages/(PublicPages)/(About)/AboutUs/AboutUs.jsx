import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Import Assets
import Background from "../../../../assets/Home-Background/Home-Background.jpeg";
import AboutUsBanner from "../../../../assets/AboutUS/AboutUsBanner.jpg";

// Shared Components
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching About Us Data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["AboutUsData"],
    queryFn: async () => {
      const response = await axiosPublic.get(`/AboutUs`);
      return response.data[0]; // Accessing the first object
    },
  });

  // Memoizing the data to prevent unnecessary re-renders
  const AboutUsData = useMemo(() => data, [data]);

  // Handle loading and error states
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Section with Banner */}
      <img src={AboutUsBanner} alt="About Us" className="w-full" />

      {/* Content Wrapper */}
      <div className="bg-gradient-to-b from-black/50 to-black/20">
        {/* Introduction Section */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 py-2">
          {/* Image Section */}
          <img
            src={AboutUsData?.introduction?.image}
            alt="Our Gym"
            className="rounded-3xl w-full md:w-1/3"
          />

          {/* Text Content */}
          <div className="w-full md:w-2/3 space-y-3 text-white text-center md:text-left">
            <h2 className="text-3xl font-bold">
              {AboutUsData?.introduction?.title}
            </h2>
            <p className="text-lg ">
              {AboutUsData?.introduction?.description}
            </p>
          </div>
        </div>

        {/* Mission, Vision, and Values Section */}
        <div className="bg-gradient-to-bl from-gray-200/50 to-gray-500/50 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {AboutUsData?.missionVisionValues?.map((item, index) => (
              <div
                key={index}
                className="text-center border border-black rounded-3xl p-6 bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 transition-all"
              >
                <img
                  src={item?.image}
                  alt={item?.title}
                  className="w-16 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {item?.title}
                </h3>
                <p className="text-lg text-black">{item?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
              Why Choose <span className="text-yellow-500">Us?</span>
            </h2>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {AboutUsData?.features?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center"
                >
                  <img
                    src={feature?.image}
                    alt={feature?.title}
                    className="w-20 mx-auto"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mt-2">
                    {feature?.title}
                  </h3>
                  <p className="text-gray-600">{feature?.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-gradient-to-bl from-gray-50/90 to-gray-100/80 py-16">
          <div className="container mx-auto px-4">
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
              Meet Our <span className="text-yellow-500">Team</span>
            </h2>

            {/* Team Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {AboutUsData?.teamMembers?.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center"
                >
                  <img
                    src={member?.image}
                    alt={member?.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {member?.name}
                  </h3>
                  <p className="text-gray-600">{member?.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-bl from-yellow-500 to-yellow-600 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {AboutUsData?.callToAction?.title}
          </h2>
          <p className="text-lg text-white mb-6">
            {AboutUsData?.callToAction?.description}
          </p>
          <a
            href={AboutUsData?.callToAction?.buttonLink}
            className="bg-gradient-to-bl hover:bg-gradient-to-tr from-white to-gray-300 text-black font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl px-10 py-3 inline-block transition-all"
          >
            {AboutUsData?.callToAction?.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
