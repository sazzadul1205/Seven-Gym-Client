import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

// Function to determine gender icon & label
const getGenderIcon = (gender) => {
  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 font-bold" />,
      label: "Other",
    },
  };

  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-2xl" />,
      label: "Not specified",
    }
  );
};

// Function to determine tier badge styles
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-orange-300 to-orange-500 ring-2 ring-orange-700",
    Silver:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-500 ring-2 ring-gray-700",
    Gold: "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-500 ring-2 ring-yellow-700",
    Diamond:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-500 ring-2 ring-blue-700",
    Platinum:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-gray-900",
  };

  return `px-10 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg  ${
    tierStyles[tier] ||
    "bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-500"
  }`;
};

const TrainerBookingDetails = ({ trainer }) => {
  // Get gender details (icon + label)
  const { icon } = getGenderIcon(trainer?.gender);

  return (
    <div className="bg-linear-to-bl from-gray-500/80 to-gray-500/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-10 px-4">
        {/* Left Section : Trainer image and basic info */}
        <div className="items-center space-x-4 w-3/4 md:w-auto my-auto">
          {/* Trainer Profile Picture */}
          <img
            src={trainer?.imageUrl}
            alt="Trainer Profile"
            className="w-52 h-52 rounded-full border border-gray-300"
          />

          {/* Trainer Name and Specialization */}
          <div className="py-1 w-full mx-auto flex flex-col items-center text-center">
            {/* Trainer name and Icon */}
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{trainer?.name}</h3>
              <span className="text-xl font-bold">{icon}</span>
            </div>

            {/* Trainer Specialization */}
            <p className="text-sm">{trainer?.specialization}</p>

            {/* Trainer Tier Badge */}
            {trainer?.tier && (
              <span
                className={`inline-block px-6 py-1 mt-2 rounded-full text-sm font-semibold cursor-pointer ${getTierBadge(
                  trainer?.tier
                )}`}
              >
                {trainer?.tier} Tier
              </span>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/3 lg:pl-8 mt-6 lg:mt-0 space-y-4">
          <div className="items-center gap-2 text-gray-200">
            <p className="text-gray-200">About {trainer?.name}:</p>{" "}
            <p className="bg-white">{trainer?.bio || "N/A"}</p>
          </div>
          <p>
            <strong className="text-gray-200">Experience:</strong>{" "}
            {trainer?.experience ? `${trainer.experience} years` : "N/A"}
          </p>

          {/* Certifications */}
          <p>
            <strong className="text-gray-200">Certifications:</strong>{" "}
            {trainer?.certifications?.length > 0
              ? trainer.certifications.map((cert, index) => (
                  <span key={index}>
                    {cert}
                    {index < trainer.certifications.length - 1 ? ", " : ""}
                  </span>
                ))
              : "N/A"}
          </p>

          {/* Focus Areas */}
          <p>
            <strong className="text-gray-200">Focus Areas:</strong>{" "}
            {trainer?.preferences?.focusAreas?.length > 0
              ? trainer.preferences.focusAreas.map((area, index) => (
                  <span key={index}>
                    {area}
                    {index < trainer.preferences.focusAreas.length - 1
                      ? ", "
                      : ""}
                  </span>
                ))
              : "N/A"}
          </p>

          {/* Languages Spoken */}
          <p>
            <strong className="text-gray-200">Languages Spoken:</strong>{" "}
            {trainer?.languagesSpoken?.length > 0
              ? trainer.languagesSpoken.map((lang, index) => (
                  <span key={index}>
                    {lang}
                    {index < trainer.languagesSpoken.length - 1 ? ", " : ""}
                  </span>
                ))
              : "N/A"}
          </p>

          {/* Contact */}
          <p>
            <strong className="text-gray-200">Contact:</strong>{" "}
            {trainer?.contact?.email ? (
              <a
                href={`mailto:${trainer.contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {trainer.contact.email}
              </a>
            ) : (
              "N/A"
            )}{" "}
            {trainer?.contact?.phone ? `| ${trainer.contact.phone}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainerBookingDetails;
