import React from "react";

// import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import icons
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
import { FaCog, FaPlus, FaRegTrashAlt } from "react-icons/fa";

// Import bModal
import AboutUsTeamCardAddModal from "./AboutUsTeamCardAddModal/AboutUsTeamCardAddModal";
import AboutUsBackgroundEditModal from "./AboutUsBackgroundEditModal/AboutUsBackgroundEditModal";
import AboutUsHeroSectionEditModal from "./AboutUsHeroSectionEditModal/AboutUsHeroSectionEditModal";
import AboutUsFeaturesCardAddModal from "./AboutUsFeaturesCardAddModal/AboutUsFeaturesCardAddModal";
import AboutUsChooseUsCardAddModal from "./AboutUsChooseUsCardAddModal/AboutUsChooseUsCardAddModal";
import AboutUsIntroductionSectionEditModal from "./AboutUsIntroductionSectionEditModal/AboutUsIntroductionSectionEditModal";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Icon Map
const iconsMap = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  github: FaGithub,
  portfolio: FaGlobe,
};

const AboutUsPageManagement = ({ AboutUsData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Handle Delete
  const handleDeleteInformation = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Information Card will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.patch(`/AboutUs/DeleteMissionVisionValue/${id}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Information has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Information could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  // Handle Delete
  const handleDeleteChooseUS = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Choose Us Card will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.patch(`/AboutUs/DeleteFeature/${id}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Choose Us has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Choose Us could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  // Handle Delete
  const handleDeleteMember = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Member Card will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.patch(`/AboutUs/DeleteTeamMember/${id}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Member has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Member could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gray-400 py-2 flex items-center">
        {/* Left: Balance No Content */}
        <div className="flex-shrink-0 w-10" />

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Our Missions (Admin)
        </h3>

        {/* Right: Edit Background Button */}
        <div className="flex-shrink-0 w-10">
          <button
            onClick={() => {
              document
                .getElementById("About_Us_Background_Edit_Modal")
                .showModal();
            }}
            id="edit-background-image-btn"
            className="cursor-pointer"
            aria-label="Edit background-image"
          >
            <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
          <Tooltip
            anchorSelect="#edit-background-image-btn"
            content="Edit Background Image Section"
          />
        </div>
      </div>

      {/* Container */}
      <div
        className="bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${AboutUsData?.background})` }}
      >
        {/* Hero */}
        <section className="relative h-[500px]">
          {/* Background image */}
          <img
            src={AboutUsData.hero.img}
            alt={AboutUsData.hero.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 bg-gray-700/60 flex flex-col items-center justify-center">
            {/* Title */}
            <h1 className="text-5xl font-extrabold text-white mb-4">
              {AboutUsData.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-white font-bold max-w-2xl text-center">
              {AboutUsData.hero.subTitle}
            </p>
          </div>

          {/* Edit Icon with Tooltip */}
          <div className="absolute top-4 right-4 z-10 group ">
            <button
              onClick={() => {
                document
                  .getElementById("About_Us_Hero_Section_Edit_Modal")
                  .showModal();
              }}
              id="edit-hero-btn"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
              aria-label="Edit Hero"
            >
              <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <Tooltip
              anchorSelect="#edit-hero-btn"
              content="Edit Hero Section"
            />
          </div>
        </section>

        {/* Introduction */}
        <section className="relative text-center py-10 mx-auto rounded-lg shadow-lg bg-black/80">
          {/* Title */}
          <h2 className="text-4xl text-center font-extrabold text-white mb-6">
            {AboutUsData.introduction.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-center text-white mx-auto max-w-4xl leading-relaxed">
            {AboutUsData.introduction.description}
          </p>

          {/* Edit Icon */}
          <div className="absolute top-2 right-4 z-10 group">
            <button
              onClick={() => {
                document
                  .getElementById("About_Us_Introduction_Section_Edit_Modal")
                  .showModal();
              }}
              id="edit-who-we-are-btn"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
              aria-label="Edit-who-we-are-Section"
            >
              <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <Tooltip
              anchorSelect="#edit-who-we-are-btn"
              content="Edit Who We Are Section"
            />
          </div>
        </section>

        {/* Information */}
        <section className="relative bg-gray-200/70 py-3 md:py-10">
          {/* Add Icon with Tooltip */}
          <div className="absolute top-6 left-4 z-10 group ">
            <button
              id={`add-info-btn`}
              className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
              onClick={() => {
                document
                  .getElementById("About_Us_Information_Card_Add_Modal")
                  .showModal();
              }}
            >
              <FaPlus className="text-green-500" />
            </button>
            <Tooltip
              anchorSelect={`#add-info-btn`}
              content="Add information Card"
            />
          </div>

          {/* Data */}
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 md:px-4">
            {AboutUsData.missionVisionValues.map((item, i) => (
              <div
                key={i}
                className="relative bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center cursor-pointer "
              >
                {/* Delete Button */}
                <>
                  <button
                    id={`delete-value-btn-${item.id}`}
                    className="absolute top-3 right-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                    onClick={() => handleDeleteInformation(item.id)}
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#delete-value-btn-${item.id}`}
                    content="Delete Information Card"
                  />
                </>
                {/* Icon */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 mx-auto mb-4"
                />
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-black pt-4">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Choose Us */}
        <section className="relative bg-black/70 py-3 md:py-10">
          {/* Add Icon with Tooltip */}
          <div className="absolute top-6 left-4 z-10 group ">
            <button
              id={`add-choose-us-btn`}
              className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
              onClick={() => {
                document
                  .getElementById("About_Us_Choose_Us_Card_Add_Modal")
                  .showModal();
              }}
            >
              <FaPlus className="text-green-500" />
            </button>
            <Tooltip
              anchorSelect={`#add-choose-us-btn`}
              content="Add choose-us Card"
            />
          </div>

          {/* Data */}
          <div className="mx-auto ">
            {/* Title */}
            <h2 className="text-4xl font-bold text-white text-center mb-8">
              Why Choose <span className="text-yellow-500">Us?</span>
            </h2>

            {/* Card */}
            <div className="relative mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 md:px-4">
              {AboutUsData.features.map((feature, i) => (
                <div
                  key={i}
                  className="relative bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center cursor-pointer "
                >
                  {/* Delete Button */}
                  <>
                    <button
                      id={`delete-choose-us-btn-${feature.id}`}
                      className="absolute top-3 right-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                      onClick={() => handleDeleteChooseUS(feature.id)}
                    >
                      <FaRegTrashAlt className="text-red-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#delete-choose-us-btn-${feature.id}`}
                      content="Delete Choose Us Card"
                    />
                  </>
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
        <section className="relative bg-gray-100/80 py-16">
          {/* Add Icon with Tooltip */}
          <div className="absolute top-6 left-4 z-10 group ">
            <button
              id={`add-team-btn`}
              className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
              onClick={() => {
                document
                  .getElementById("About_Us_Team_Card_Add_Modal")
                  .showModal();
              }}
            >
              <FaPlus className="text-green-500" />
            </button>
            <Tooltip anchorSelect={`#add-team-btn`} content="Add Team Card" />
          </div>

          {/* Data */}
          <div className="mx-auto px-4">
            {/* Title */}
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
              Meet Our <span className="text-yellow-500">Team</span>
            </h2>

            {/* Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {AboutUsData.teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="relative bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center flex flex-col items-center cursor-pointer"
                >
                  {/* Delete Button */}
                  <>
                    <button
                      id={`delete-member-btn-${member.id}`}
                      className="absolute top-3 right-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                      onClick={() => handleDeleteMember(member?.id)}
                    >
                      <FaRegTrashAlt className="text-red-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#delete-member-btn-${member?.id}`}
                      content="Delete Member Card"
                    />
                  </>
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
                        <p className="text-gray-600 text-center md:text-left">
                          {member.role}
                        </p>
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
      </div>

      {/* Modals */}
      <>
        {/* Edit About Us Background Modal */}
        <dialog id="About_Us_Background_Edit_Modal" className="modal">
          <AboutUsBackgroundEditModal
            Refetch={Refetch}
            AboutUsData={AboutUsData}
          />
        </dialog>

        {/* Edit About Us Hero Section Modal */}
        <dialog id="About_Us_Hero_Section_Edit_Modal" className="modal">
          <AboutUsHeroSectionEditModal
            Refetch={Refetch}
            AboutUsData={AboutUsData}
          />
        </dialog>

        {/* Edit About Us Introduction Section Modal */}
        <dialog id="About_Us_Introduction_Section_Edit_Modal" className="modal">
          <AboutUsIntroductionSectionEditModal
            Refetch={Refetch}
            AboutUsData={AboutUsData}
          />
        </dialog>

        {/* Edit About Us Information Card Add Modal */}
        <dialog id="About_Us_Information_Card_Add_Modal" className="modal">
          <AboutUsFeaturesCardAddModal Refetch={Refetch} />
        </dialog>

        {/* Edit About Us Information Card Add Modal */}
        <dialog id="About_Us_Choose_Us_Card_Add_Modal" className="modal">
          <AboutUsChooseUsCardAddModal Refetch={Refetch} />
        </dialog>

        {/* Edit About Us Team Card Add Modal */}
        <dialog id="About_Us_Team_Card_Add_Modal" className="modal">
          <AboutUsTeamCardAddModal Refetch={Refetch} />
        </dialog>
      </>
    </>
  );
};

// Prop Validation
AboutUsPageManagement.propTypes = {
  AboutUsData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hero: PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subTitle: PropTypes.string.isRequired,
    }).isRequired,
    introduction: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    missionVisionValues: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    teamMembers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        socials: PropTypes.shape({
          linkedin: PropTypes.string,
          twitter: PropTypes.string,
          facebook: PropTypes.string,
          github: PropTypes.string,
          portfolio: PropTypes.string,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,

  Refetch: PropTypes.func.isRequired,
};

export default AboutUsPageManagement;
