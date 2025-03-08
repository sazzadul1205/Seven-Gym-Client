import PropTypes from "prop-types"; // Importing PropTypes for type-checking
import {
  FaAward,
  FaCertificate,
  FaRegCalendarAlt,
  FaTools,
  FaHandshake,
} from "react-icons/fa"; // Importing icons for UI enhancement

const TrainerDetailsDetails = ({ TrainerDetails }) => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
      {/* Trainer Certifications Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaCertificate className="mr-3 text-2xl text-blue-600" />
          Certifications
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-black">
          {TrainerDetails.certifications?.length ? (
            TrainerDetails.certifications.map((cert, index) => (
              <li key={index} className="text-lg">
                {cert}
              </li>
            ))
          ) : (
            <li className="text-lg text-gray-500">No certifications listed.</li>
          )}
        </ul>
      </div>

      {/* Trainer Awards Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaAward className="mr-3 text-2xl text-yellow-500" />
          Awards
        </h2>
        <div className="space-y-4">
          {TrainerDetails.awards?.length ? (
            TrainerDetails.awards.map((award, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold text-xl">{award.title}</h3>
                <p className="text-gray-600 text-lg">
                  {award.year} - {award.organization}
                </p>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No awards listed.</p>
          )}
        </div>
      </div>

      {/* Trainer Preferences Section */}
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaRegCalendarAlt className="mr-3 text-2xl text-green-500" />
          Training Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Focus Areas */}
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-2">Focus Areas</h3>
            <ul className="list-disc pl-6 space-y-2 text-black">
              {TrainerDetails.preferences?.focusAreas?.length ? (
                TrainerDetails.preferences.focusAreas.map((focus, index) => (
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
            <h3 className="font-semibold text-xl mb-2">Class Types</h3>
            <ul className="list-disc pl-6 space-y-2 text-black">
              {TrainerDetails.preferences?.classTypes?.length ? (
                TrainerDetails.preferences.classTypes.map((type, index) => (
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
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaTools className="mr-3 text-2xl text-purple-600" />
          Additional Services
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-black">
          {TrainerDetails.additionalServices?.length ? (
            TrainerDetails.additionalServices.map((service, index) => (
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
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaTools className="mr-3 text-2xl text-orange-500" />
          Equipment Used
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-black">
          {TrainerDetails.equipmentUsed?.length ? (
            TrainerDetails.equipmentUsed.map((equipment, index) => (
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
      <div className="bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center border-b-2 border-black pb-2">
          <FaHandshake className="mr-3 text-2xl text-teal-600" />
          Partnerships
        </h2>
        <div className="space-y-4">
          {TrainerDetails.partnerships?.length ? (
            TrainerDetails.partnerships.map((partner, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg">{partner.partnerName}</h3>
                <a
                  href={partner.website}
                  className="text-blue-500 underline text-lg"
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
  );
};

// PropTypes for type-checking
TrainerDetailsDetails.propTypes = {
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

export default TrainerDetailsDetails;
