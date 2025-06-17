import { useQuery } from "@tanstack/react-query";
import React from "react";

// Shared Components
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CallToAction from "../../Home/CallToAction/CallToAction";

import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";

// Icon Map
const iconsMap = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  github: FaGithub,
  portfolio: FaGlobe,
};

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch mission data
  const {
    data: aboutUs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["aboutUs"],
    queryFn: () => axiosPublic.get(`/AboutUs`).then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  console.log(aboutUs);

  return (
    <div
      className="bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${aboutUs.background})` }}
    >
      {/* Hero */}
      <div className="relative h-[500px]">
        {/* Background image */}
        <img
          src={aboutUs.hero.img}
          alt={aboutUs.hero.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Content */}
        <div className="absolute inset-0 bg-gray-700/60 flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="text-5xl font-extrabold text-white mb-4">
            {aboutUs.hero.title}
          </h1>
          {/* Description */}
          <p className="text-xl text-white font-bold max-w-2xl text-center">
            {aboutUs.hero.subTitle}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="text-center py-10 mx-auto rounded-lg shadow-lg bg-black/80">
        {/* Title */}
        <h2 className="text-4xl text-center font-extrabold text-white mb-6">
          {aboutUs.introduction.title}
        </h2>
        {/* Description */}
        <p className="text-lg text-center text-white mx-auto max-w-4xl leading-relaxed">
          {aboutUs.introduction.description}
        </p>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-gray-200/70 py-3 md:py-10">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 md:px-4">
          {aboutUs.missionVisionValues.map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center cursor-pointer "
            >
              {/* Icon */}
              <img
                src={item.image}
                alt={item.title}
                className="w-16 mx-auto mb-4"
              />
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>

              {/* Description */}
              <p className="text-black pt-4">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/70 py-3 md:py-10">
        <div className="mx-auto ">
          {/* Title */}
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Why Choose <span className="text-yellow-500">Us?</span>
          </h2>

          {/* Card */}
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 md:px-4">
            {aboutUs.features.map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center cursor-pointer "
              >
                {/* Icon */}
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-20 mx-auto"
                />
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-black pt-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-100/80 py-16">
        <div className="mx-auto px-4">
          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Meet Our <span className="text-yellow-500">Team</span>
          </h2>

          {/* Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutUs.teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center flex flex-col items-center cursor-pointer"
              >
                {/* Image & Info Part */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                  {/* Avatar & Basic Info */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Avatar */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    {/* Basic Info */}
                    <div className="pt-4 text-left">
                      {/* Name */}
                      <h3 className="text-xl font-semibold text-gray-800">
                        {member.name}
                      </h3>
                      {/* Role */}
                      <p className="text-gray-600 text-center md:text-left">{member.role}</p>
                    </div>
                  </div>

                  {/* Link Icons */}
                  <div className="flex flex-col items-center justify-start space-y-2">
                    {Object.entries(member.socials)
                      // eslint-disable-next-line no-unused-vars
                      .filter(([_, url]) => url)
                      .reduce((acc, curr, idx, arr) => {
                        if (idx % 3 === 0) acc.push(arr.slice(idx, idx + 3));
                        return acc;
                      }, [])
                      .map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex items-center justify-center gap-3"
                        >
                          {row.map(([platform, url], idx) => {
                            const IconComponent = iconsMap[platform];
                            if (!IconComponent) return null;

                            const anchorId = `social-icon-${platform}-${rowIndex}-${idx}`;

                            return (
                              <React.Fragment key={platform}>
                                <a
                                  id={anchorId}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:scale-110 transition-transform"
                                >
                                  <IconComponent className="w-6 h-6 text-gray-700" />
                                </a>
                                <Tooltip
                                  anchorSelect={`#${anchorId}`}
                                  content={
                                    platform.charAt(0).toUpperCase() +
                                    platform.slice(1)
                                  }
                                />
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                  </div>
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
