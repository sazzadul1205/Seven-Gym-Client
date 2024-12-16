import WhoWeAre from "../../assets/WhoWeAre.jpg";

const AboutUs = () => {
  // Data arrays
  const features = [
    {
      id: 1,
      title: "Expert Trainers",
      description:
        "Our certified trainers are here to guide and motivate you at every step of your fitness journey.",
      image: "https://i.ibb.co/Br5880F/state-of-the-art.png",
    },
    {
      id: 2,
      title: "State-of-the-Art Equipment",
      description:
        "We offer top-notch equipment designed to meet all your workout needs and goals.",
      image: "https://i.ibb.co/xz1M28t/coach.png",
    },
    {
      id: 3,
      title: "Community Support",
      description:
        "Join a community of like-minded individuals who inspire and encourage each other.",
      image: "https://i.ibb.co/qd6k5P8/diversity.png",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "CEO",
      image: "https://i.ibb.co/ZmFCPmY/trainer1.jpg",
    },
    {
      id: 2,
      name: "Emily Johnson",
      role: "Chef Manager",
      image: "https://i.ibb.co/WF6XMSD/trainer2.jpg",
    },
    {
      id: 3,
      name: "Michael Lee",
      role: "Manager",
      image: "https://i.ibb.co/kHTBsmv/trainer3.jpg",
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-96"
        style={{
          backgroundImage: "url(https://i.ibb.co/N3Dzz47/About-Us-Wall.jpg)",
        }}
      ></div>

      {/* Introduction Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Who We Are
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
          At <strong>Peak Fitness Gym</strong>, we are more than just a fitness
          facility—we are a community dedicated to helping individuals achieve
          their health and wellness goals. Our state-of-the-art gym, experienced
          trainers, and welcoming atmosphere make fitness accessible and
          enjoyable for everyone.
        </p>
        <div className="flex justify-center mt-8">
          <img
            src={WhoWeAre}
            alt="Our Gym"
            className="rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2"
          />
        </div>
      </div>

      {/* Mission, Vision, and Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="text-center">
            <img
              src={"https://i.ibb.co/4Vpzch3/target.png"}
              alt=""
              className="w-16 mx-auto"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600">
              To empower individuals to lead healthier lives through fitness,
              nutrition, and a supportive community.
            </p>
          </div>
          {/* Vision */}
          <div className="text-center">
            <img
              src={"https://i.ibb.co/c606Kmt/vision.png"}
              alt=""
              className="w-16 mx-auto"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To become a global leader in fitness and wellness by providing
              exceptional services that inspire positive change.
            </p>
          </div>
          {/* Values */}
          <div className="text-center">
            <img
              src={"https://i.ibb.co/WprwvVz/values.png"}
              alt=""
              className="w-16 mx-auto"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Our Values
            </h3>
            <p className="text-gray-600">
              Integrity, community, excellence, and innovation are the core
              values that guide everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Why Choose <span className="text-yellow-500">Us</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
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
            {teamMembers.map((member) => (
              <div
                key={member.id}
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
          Join Our Fitness Community Today!
        </h2>
        <p className="text-lg text-white mb-6">
          Take the first step towards a healthier, stronger you. Explore our
          services and become a part of the Peak Fitness family.
        </p>
        <a
          href="/membership"
          className="px-6 py-3 bg-white text-yellow-500 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
