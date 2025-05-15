import PropTypes from "prop-types";

// Import Icons
import {
  FaAward,
  FaCertificate,
  FaHandshake,
  FaRegCalendarAlt,
  FaTools,
} from "react-icons/fa";

// PreviewDetails component to display trainer information
const PreviewDetails = ({ trainerBasicInfo }) => {
  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-1 md:p-4">
      {/* Trainer Certifications Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaCertificate className="mr-2 text-xl text-blue-600" />
          Certifications
        </h2>

        {/* Certifications List */}
        <ul className="text-black space-y-1 text-sm">
          {trainerBasicInfo?.certifications?.length ? (
            trainerBasicInfo?.certifications.map((cert, index) => (
              <li key={index} className="text-base">
                {index + 1}. <span className="font-semibold">{cert}</span>
              </li>
            ))
          ) : (
            <li className="text-base text-gray-500">
              No certifications listed.
            </li>
          )}
        </ul>
      </div>

      {/* Trainer Awards Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaAward className="mr-2 text-xl text-yellow-500" />
          Awards
        </h2>

        {/* Awards List */}
        <div className="px-1 text-sm">
          {trainerBasicInfo?.awards?.length ? (
            trainerBasicInfo?.awards.map((award, index) => (
              <div key={index} className="mb-2 space-y-1">
                <h3 className="font-semibold text-lg text-black">
                  # {index + 1} [ {award.title} ]
                </h3>
                <p className="text-gray-800 text-base">
                  <span className="font-bold">{award.year}</span> -{" "}
                  {award.organization}
                </p>
                <hr className="bg-gray-200 p-[1px]" />
              </div>
            ))
          ) : (
            <p className="text-base text-gray-500">No awards listed.</p>
          )}
        </div>
      </div>

      {/* Trainer Preferences Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaRegCalendarAlt className="mr-2 text-xl text-green-500" />
          Training Preferences
        </h2>

        {/* Preferences List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 text-sm">
          {/* Focus Areas */}
          <div>
            <h3 className="font-semibold text-lg text-black border-b-2 border-gray-600 pb-2">
              Focus Areas
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-black">
              {trainerBasicInfo?.preferences?.focusAreas?.length ? (
                trainerBasicInfo?.preferences.focusAreas.map((focus, index) => (
                  <li key={index} className="text-base">
                    {focus}
                  </li>
                ))
              ) : (
                <li className="text-base text-gray-500">
                  No focus areas listed.
                </li>
              )}
            </ul>
          </div>

          {/* Class Types */}
          <div>
            <h3 className="font-semibold text-lg text-black border-b-2 border-gray-600 pb-2">
              Class Types
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-black">
              {trainerBasicInfo?.preferences?.classTypes?.length ? (
                trainerBasicInfo?.preferences.classTypes.map((type, index) => (
                  <li key={index} className="text-base">
                    {type}
                  </li>
                ))
              ) : (
                <li className="text-base text-gray-500">
                  No class types listed.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaTools className="mr-2 text-xl text-purple-600" />
          Additional Services
        </h2>

        {/* Services List */}
        <ul className="list-decimal text-black space-y-1 pl-5 text-sm">
          {trainerBasicInfo?.additionalServices?.length ? (
            trainerBasicInfo?.additionalServices.map((service, index) => (
              <li key={index} className="text-base">
                {service}
              </li>
            ))
          ) : (
            <li className="text-base text-gray-500">
              No additional services listed.
            </li>
          )}
        </ul>
      </div>

      {/* Equipment Used Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaTools className="mr-2 text-xl text-orange-500" />
          Equipment Used
        </h2>

        {/* Equipment List */}
        <ul className="list-decimal text-black space-y-1 pl-5 text-sm">
          {trainerBasicInfo?.equipmentUsed?.length ? (
            trainerBasicInfo?.equipmentUsed.map((equipment, index) => (
              <li key={index} className="text-base">
                {equipment}
              </li>
            ))
          ) : (
            <li className="text-base text-gray-500">No equipment listed.</li>
          )}
        </ul>
      </div>

      {/* Partnerships Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg mx-auto w-full p-4 cursor-pointer">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center border-b-2 border-gray-400 pb-2">
          <FaHandshake className="mr-2 text-xl text-teal-600" />
          Partnerships
        </h2>

        {/* Partnerships List */}
        <div className="space-y-3 text-sm">
          {trainerBasicInfo?.partnerships?.length ? (
            trainerBasicInfo?.partnerships.map((partner, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-black">
                  {partner.partnerName}
                </h3>
                <a
                  href={partner.website}
                  className="text-blue-500 hover:underline text-sm font-semibold pl-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partner.website}
                </a>
              </div>
            ))
          ) : (
            <p className="text-base text-gray-500">No partnerships listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Prop validation for trainerBasicInfo
PreviewDetails.propTypes = {
  trainerBasicInfo: PropTypes.shape({
    certifications: PropTypes.arrayOf(PropTypes.string),
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
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
  }),
};

export default PreviewDetails;
