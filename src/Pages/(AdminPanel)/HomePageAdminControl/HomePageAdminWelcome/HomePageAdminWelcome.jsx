import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaChevronRight, FaEdit } from "react-icons/fa";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Modal
import HomePageAdminWelcomeEditModal from "./HomePageAdminWelcomeEditModal/HomePageAdminWelcomeEditModal";

const HomePageAdminWelcome = ({ Refetch, HomeWelcomeSectionData }) => {
  // Selected Welcome
  const [selectedWelcome, setSelectedWelcome] = useState(null);

  return (
    <section>
      {/* Title */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Edit Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id={`edit-welcome-btn`}
            className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => {
              setSelectedWelcome(HomeWelcomeSectionData);
              document.getElementById("Edit_Welcome_Modal").showModal();
            }}
          >
            <FaEdit className="text-yellow-500" />
          </button>
          <Tooltip
            anchorSelect={`#edit-welcome-btn`}
            content="Edit Welcome Section"
          />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Welcome Section
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Welcome Section */}
      <div className="hidden md:flex relative h-[800px] w-full text-white m-2">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={HomeWelcomeSectionData.videoUrl}
            title="Background Video"
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 px-6">
          {/* Hero Text */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
            {HomeWelcomeSectionData.title}
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-center mb-6 max-w-2xl opacity-80 sm:opacity-90">
            {HomeWelcomeSectionData.description}
          </p>

          {/* Call to Action (CTA) Buttons */}
          <div className="flex gap-4 items-center">
            {/* View Classes Button */}

            <button
              className="border bg-linear-to-bl hover:bg-linear-to-tr from-gray-500/50 to-gray-800/70 py-3 px-10 rounded-lg text-sm md:text-lg cursor-pointer "
              onClick={() => alert("Redirect to - /Classes")}
            >
              View Classes
            </button>

            {/* Conditional Button: Join Now or Trainers */}
            <CommonButton
              text={"Join Now"}
              textColor="text-white"
              clickEvent={() => alert("Redirect to - /SignUp")}
              bgColor="blue"
              px="px-10"
              py="py-4"
              className="text-sm md:text-lg"
              icon={<FaChevronRight />}
              iconPosition="after"
              borderRadius="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Edit Welcome Modal */}
      <dialog id="Edit_Welcome_Modal" className="modal">
        <HomePageAdminWelcomeEditModal
          setSelectedWelcomer={setSelectedWelcome}
          selectedWelcomer={selectedWelcome}
          Refetch={Refetch}
        />
      </dialog>
    </section>
  );
};

// PropTypes validation
HomePageAdminWelcome.propTypes = {
  Refetch: PropTypes.func.isRequired,
  HomeWelcomeSectionData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    videoUrl: PropTypes.string,
  }).isRequired,
};

export default HomePageAdminWelcome;
