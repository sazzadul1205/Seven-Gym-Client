// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import icons
import {
  FaRegFileAlt,
  FaInfoCircle,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

// Import Info Component
import { InfoSection } from "../../../(PublicPages)/(Classes)/ClassesDetails/ClassesDetailsContent/ClassesDetailsContent";

const ManagementClassDetailsContent = ({ selectedClass }) => {
  return (
    <div className="relative">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Detail_Content_Edit"
          onClick={() =>
            document
              .getElementById("Class_Detail_Content_Edit_Modal")
              .showModal()
          }
        >
          <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Detail_Content_Edit"
          place="top"
          className="z-50"
          content="Edit Class Details Content "
        />
      </>

      {/* Content */}
      <div className=" bg-gradient-to-bl from-gray-200/80 to-gray-400/50 p-1 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
        <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-8">
          {/* Left Section - Details */}
          <div className="md:col-span-2 space-y-2 md:space-y-6 md:w-2/3">
            {/* Description */}
            <InfoSection
              icon={FaRegFileAlt}
              title="Description"
              content={
                selectedClass?.description || "No description available."
              }
            />

            {/* Additional Info */}
            <InfoSection
              icon={FaInfoCircle}
              title="Additional Info"
              content={
                selectedClass?.additionalInfo ||
                "No additional information provided."
              }
            />

            {/* Difficulty Level */}
            <InfoSection
              icon={FaChartLine}
              title="Difficulty Level"
              content={selectedClass?.difficultyLevel || "Not specified."}
            />

            {/* Prerequisites */}
            <InfoSection
              icon={FaClipboardList}
              title="Prerequisites"
              content={
                selectedClass?.prerequisites || "No prerequisites required."
              }
            />
          </div>

          {/* Right Section - Module Card */}
          <div className="flex flex-col items-center justify-center gap-4 border border-black/30 border-dashed rounded-2xl p-6 bg-linear-to-bl hover:bg-linear-to-tr from-white/50 to-gray-300/90 shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 ease-in-out min-h-[320px] md:min-h-[380px] md:w-1/3">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-300 shadow-md bg-white">
              <img
                src={selectedClass?.icon}
                alt={selectedClass?.module || "Module Icon"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Module Name */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
              {selectedClass?.module || "Untitled Module"}
            </h2>

            {/* Divider */}
            <div className="w-16 border-b-2 border-red-400" />

            {/* Overview Text */}
            <p className="text-sm md:text-base text-gray-700 text-center leading-relaxed px-2">
              Dive into an engaging and thoughtfully designed experience crafted
              for learners of all levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ManagementClassDetailsContent.propTypes = {
  selectedClass: PropTypes.shape({
    _id: PropTypes.string,
    module: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    additionalInfo: PropTypes.string,
    difficultyLevel: PropTypes.string,
    prerequisites: PropTypes.string,
  }),
  Refetch: PropTypes.func,
};

export default ManagementClassDetailsContent;
