import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Shared Assets
import background from "../../../../assets/Home-Background/Home-Background.jpeg";

// Shared Components
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CallToAction from "../../Home/CallToAction/CallToAction";

// Fallback Static Data
const aboutUs = {
  description:
    "At Peak Fitness Gym, we are more than just a fitness facility—we are a close-knit community of health enthusiasts. From personalized training plans to wellness workshops, we cater to all fitness levels. Our mission goes beyond physical health—we’re committed to building confidence, mental strength, and lifelong habits. With a team of experts and a variety of programs, we ensure every member feels supported on their unique journey to transformation.",
  hero: {
    img: "https://i.ibb.co/N3Dzz47/About-Us-Wall.jpg",
    title: "About Us",
    subTitle: "Fitness. Community. Transformation.",
  },
  introduction: {
    title: "Who We Are",
    description:
      "At Peak Fitness Gym, we are more than just a fitness facility—we are a community dedicated to helping individuals achieve their health and wellness goals. Our state-of-the-art gym, experienced trainers, and welcoming atmosphere make fitness accessible and enjoyable for everyone.",
    image: "https://i.ibb.co/L5ngmz4/WhoWeAre.jpg",
  },
  missionVisionValues: [
    {
      title: "Our Mission",
      description:
        "To empower individuals to lead healthier lives through fitness, nutrition, and a supportive community.",
      image: "https://i.ibb.co/4Vpzch3/target.png",
    },
    {
      title: "Our Vision",
      description:
        "To become a global leader in fitness and wellness by providing exceptional services that inspire positive change.",
      image: "https://i.ibb.co/c606Kmt/vision.png",
    },
    {
      title: "Our Values",
      description:
        "Integrity, community, excellence, and innovation are the core values that guide everything we do.",
      image: "https://i.ibb.co/WprwvVz/values.png",
    },
  ],
  features: [
    {
      title: "Expert Trainers",
      description:
        "Our certified trainers are here to guide and motivate you at every step of your fitness journey.",
      image: "https://i.ibb.co/xz1M28t/coach.png",
    },
    {
      title: "State-of-the-Art Equipment",
      description:
        "We offer top-notch equipment designed to meet all your workout needs and goals.",
      image: "https://i.ibb.co/Br5880F/state-of-the-art.png",
    },
    {
      title: "Community Support",
      description:
        "Join a community of like-minded individuals who inspire and encourage each other.",
      image: "https://i.ibb.co/qd6k5P8/diversity.png",
    },
  ],
  teamMembers: [
    {
      name: "John Smith",
      role: "CEO",
      image: "https://i.ibb.co/ZmFCPmY/trainer1.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/johnsmith",
        twitter: "https://twitter.com/johnsmith",
        instagram: "https://instagram.com/johnsmith",
      },
    },
    {
      name: "Emily Johnson",
      role: "Chef Manager",
      image: "https://i.ibb.co/WF6XMSD/trainer2.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/emilyjohnson",
        twitter: "https://twitter.com/emilyjohnson",
        instagram: "https://instagram.com/emilyjohnson",
      },
    },
    {
      name: "Michael Lee",
      role: "Operations Manager",
      image: "https://i.ibb.co/kHTBsmv/trainer3.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/michaellee",
        twitter: "https://twitter.com/michaellee",
        instagram: "https://instagram.com/michaellee",
      },
    },
    {
      name: "Samantha Green",
      role: "Head Trainer",
      image: "https://i.ibb.co/yF8Fg3D/trainer4.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/samanthagreen",
        twitter: "https://twitter.com/samanthagreen",
        instagram: "https://instagram.com/samanthagreen",
      },
    },
    {
      name: "Carlos Mendes",
      role: "Nutritionist",
      image: "https://i.ibb.co/4PV2vFf/trainer5.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/carlosmendes",
        twitter: "https://twitter.com/carlosmendes",
        instagram: "https://instagram.com/carlosmendes",
      },
    },
  ],
};

const AboutUs = () => {
  return (
    <div
      className="bg-fixed bg-center bg-cover space-y-16 bg-black/50"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Hero */}
      <div className="relative h-[500px]">
        <img
          src={aboutUs.hero.img}
          alt={aboutUs.hero.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-700/60 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            {aboutUs.hero.title}
          </h1>
          <p className="text-xl text-white font-bold max-w-2xl text-center">
            {aboutUs.hero.subTitle}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="bg-gradient-to-b from-black/50 to-black/20 py-10 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <img
          src={aboutUs.introduction.image}
          alt="Our Gym"
          className="rounded-3xl w-full md:w-1/3"
        />
        <div className="w-full md:w-2/3 space-y-3 text-white text-center md:text-left">
          <h2 className="text-3xl font-bold">{aboutUs.introduction.title}</h2>
          <p className="text-lg">{aboutUs.introduction.description}</p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-gray-200/70 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {aboutUs.missionVisionValues.map((item, i) => (
            <div
              key={i}
              className="text-center border border-black rounded-3xl p-6 bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
              <p className="text-lg text-black">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Why Choose <span className="text-yellow-500">Us?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutUs.features.map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-20 mx-auto"
                />
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-100/80 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Meet Our <span className="text-yellow-500">Team</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutUs.teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-3">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                      alt="LinkedIn"
                      className="w-5 h-5"
                    />
                  </a>
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                      alt="Twitter"
                      className="w-5 h-5"
                    />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                      alt="Instagram"
                      className="w-5 h-5"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CallToAction />
    </div>
  );
};

export default AboutUs;
