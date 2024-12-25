/* eslint-disable react/prop-types */

const TrainerBookingDetails = ({ trainer }) => {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl my-5">
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-8">
        {/* Left Section */}
        <div className="w-full lg:w-1/3 text-center lg:text-left">
          <img
            src={trainer.imageUrl}
            alt={trainer.name}
            className="w-32 h-32 lg:w-48 lg:h-48 rounded-full border-4 border-[#F72C5B] mx-auto lg:mx-0 mb-6"
          />
          <h2 className="text-2xl font-bold">{trainer.name}</h2>
          <p className="text-gray-600">{trainer.specialization}</p>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/3 lg:pl-8 mt-6 lg:mt-0 space-y-4">
          <p>
            <strong className="text-gray-800">Bio:</strong> {trainer.bio}
          </p>
          <p>
            <strong className="text-gray-800">Experience:</strong>{" "}
            {trainer.experience} years
          </p>
          <p>
            <strong className="text-gray-800">Certifications:</strong>{" "}
            {trainer.certifications.join(", ")}
          </p>
          <p>
            <strong className="text-gray-800">Focus Areas:</strong>{" "}
            {trainer.preferences.focusAreas.join(", ")}
          </p>
          <p>
            <strong className="text-gray-800">Languages Spoken:</strong>{" "}
            {trainer.languagesSpoken.join(", ")}
          </p>
          <p>
            <strong className="text-gray-800">Contact:</strong>{" "}
            <a
              href={`mailto:${trainer.contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {trainer.contact.email}
            </a>{" "}
            | {trainer.contact.phone}
          </p>
          <p>
            <strong className="text-gray-800">Per Session Price:</strong> $
            {trainer.perSession}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainerBookingDetails;
