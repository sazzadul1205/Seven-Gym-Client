/* eslint-disable react/prop-types */
import {
  FaAward,
  FaCertificate,
  FaRegCalendarAlt,
  FaTools,
  FaHandshake,
} from "react-icons/fa"; // Importing icons

const TDDetails = ({ TrainerDetails }) => {
  return (
    <div className="space-y-8 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
      {/* Trainer Certifications */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaCertificate className="mr-3 text-xl text-blue-600" />
          Certifications
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {TrainerDetails.certifications.map((cert, index) => (
            <li key={index} className="text-lg">
              {cert}
            </li>
          ))}
        </ul>
      </div>

      {/* Trainer Awards */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaAward className="mr-3 text-xl text-yellow-500" />
          Awards
        </h2>
        <div className="space-y-4">
          {TrainerDetails.awards.map((award, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold text-xl">{award.title}</h3>
              <p className="text-gray-600 text-lg">
                {award.year} - {award.organization}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Preferences */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaRegCalendarAlt className="mr-3 text-xl text-green-500" />
          Training Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-2">Focus Areas</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {TrainerDetails.preferences.focusAreas.map((focus, index) => (
                <li key={index} className="text-lg">
                  {focus}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Class Types</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {TrainerDetails.preferences.classTypes.map((type, index) => (
                <li key={index} className="text-lg">
                  {type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaTools className="mr-3 text-xl text-purple-600" />
          Additional Services
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {TrainerDetails.additionalServices.map((service, index) => (
            <li key={index} className="text-lg">
              {service}
            </li>
          ))}
        </ul>
      </div>

      {/* Equipment Used */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaTools className="mr-3 text-xl text-orange-500" />
          Equipment Used
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {TrainerDetails.equipmentUsed.map((equipment, index) => (
            <li key={index} className="text-lg">
              {equipment}
            </li>
          ))}
        </ul>
      </div>

      {/* Partnerships */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaHandshake className="mr-3 text-xl text-teal-600" />
          Partnerships
        </h2>
        <div className="space-y-4">
          {TrainerDetails.partnerships.map((partner, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default TDDetails;
