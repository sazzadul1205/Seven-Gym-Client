import { Link } from "react-router";

// Import Package
import PropTypes from "prop-types";

// Importing icons for UI enhancement
import {
  FaAward,
  FaCertificate,
  FaRegCalendarAlt,
  FaTools,
  FaHandshake,
} from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

const TrainerProfileDetails = ({ TrainerDetails }) => {
  // Check if TrainerDetails is available
  if (!TrainerDetails) return null;

  return (
    <div className="relative max-w-7xl mx-auto pt-3">
      {/* Settings Icon (Top Right) */}
      <div
        className="absolute top-2 right-2 p-2"
        data-tooltip-id="Trainer_Profile_Settings_Details_Tooltip"
      >
        <Link to="/Trainer/TrainerSettings?tab=User_Info_Settings">
          <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </Link>
      </div>
      <Tooltip
        id="Trainer_Profile_Settings_Details_Tooltip"
        place="top"
        content="Trainer Profile Details Settings"
      />
      {/* Trainer Profile Details Section */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 pt-12">
        {/* Trainer Certifications Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaCertificate className="mr-3 text-2xl text-blue-600" />
            Certifications
          </h2>

          {/* Certifications List */}
          <ul className="list-decimal text-black space-y-2 pl-6">
            {TrainerDetails?.certifications?.length ? (
              TrainerDetails?.certifications.map((cert, index) => (
                <li key={index} className="text-lg">
                  {cert}
                </li>
              ))
            ) : (
              <li className="text-lg text-gray-500">No equipment listed.</li>
            )}
          </ul>
        </div>

        {/* Trainer Awards Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaAward className="mr-3 text-2xl text-yellow-500" />
            Awards
          </h2>

          {/* Awards List */}
          <div className="px-1">
            {TrainerDetails?.awards?.length ? (
              TrainerDetails?.awards.map((award, index) => (
                // Display each award with title, year, and organization
                <div key={index} className="mb-2">
                  <h3 className="font-semibold text-xl text-black">
                    {award.title}
                  </h3>
                  <p className="text-gray-800 text-lg">
                    <span className="font-bold">{award.year}</span> -{" "}
                    {award.organization}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500">No awards listed.</p>
            )}
          </div>
        </div>

        {/* Trainer Preferences Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaRegCalendarAlt className="mr-3 text-2xl text-green-500" />
            Training Preferences
          </h2>

          {/* Preferences List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
            {/* Focus Areas */}
            <div>
              <h3 className="font-semibold text-xl text-black border-b-2 border-gray-600 pb-2">
                Focus Areas
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-black">
                {TrainerDetails?.preferences?.focusAreas?.length ? (
                  TrainerDetails?.preferences.focusAreas.map((focus, index) => (
                    <li key={index} className="text-lg">
                      {focus}
                    </li>
                  ))
                ) : (
                  <li className="text-lg text-gray-500">
                    No focus areas listed.
                  </li>
                )}
              </ul>
            </div>

            {/* Class Types */}
            <div>
              <h3 className="font-semibold text-xl text-black border-b-2 border-gray-600 pb-2">
                Class Types
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-black">
                {TrainerDetails?.preferences?.classTypes?.length ? (
                  TrainerDetails?.preferences.classTypes.map((type, index) => (
                    <li key={index} className="text-lg">
                      {type}
                    </li>
                  ))
                ) : (
                  <li className="text-lg text-gray-500">
                    No class types listed.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaTools className="mr-3 text-2xl text-purple-600" />
            Additional Services
          </h2>

          {/* Services List */}
          <ul className="list-decimal text-black space-y-2 pl-6">
            {TrainerDetails?.additionalServices?.length ? (
              TrainerDetails?.additionalServices.map((service, index) => (
                <li key={index} className="text-lg">
                  {service}
                </li>
              ))
            ) : (
              <li className="text-lg text-gray-500">
                No additional services listed.
              </li>
            )}
          </ul>
        </div>

        {/* Equipment Used Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaTools className="mr-3 text-2xl text-orange-500" />
            Equipment Used
          </h2>

          {/* Equipment List */}
          <ul className="list-decimal text-black space-y-2 pl-6">
            {TrainerDetails?.equipmentUsed?.length ? (
              TrainerDetails?.equipmentUsed.map((equipment, index) => (
                <li key={index} className="text-lg">
                  {equipment}
                </li>
              ))
            ) : (
              <li className="text-lg text-gray-500">No equipment listed.</li>
            )}
          </ul>
        </div>

        {/* Partnerships Section */}
        <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-6 cursor-pointer">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
            <FaHandshake className="mr-3 text-2xl text-teal-600" />
            Partnerships
          </h2>

          {/* Partnerships List */}
          <div className="space-y-4">
            {TrainerDetails?.partnerships?.length ? (
              TrainerDetails?.partnerships.map((partner, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-xl text-black">
                    {partner.partnerName}
                  </h3>
                  <a
                    href={partner.website}
                    className="text-blue-500 hover:underline text-lg font-semibold pl-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {partner.website}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500">No partnerships listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type-checking
TrainerProfileDetails.propTypes = {
  TrainerDetails: PropTypes.shape({
    certifications: PropTypes.arrayOf(PropTypes.string),
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        organization: PropTypes.string.isRequired,
      })
    ),
    preferences: PropTypes.shape({
      focusAreas: PropTypes.arrayOf(PropTypes.string),
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
    additionalServices: PropTypes.arrayOf(PropTypes.string),
    equipmentUsed: PropTypes.arrayOf(PropTypes.string),
    partnerships: PropTypes.arrayOf(
      PropTypes.shape({
        partnerName: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default TrainerProfileDetails;
