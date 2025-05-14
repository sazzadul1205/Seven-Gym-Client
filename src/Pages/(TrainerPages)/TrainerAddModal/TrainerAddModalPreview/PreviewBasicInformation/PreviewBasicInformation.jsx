import PropTypes from "prop-types";
import { getGenderIcon } from "../../../../../Utility/getGenderIcon";

const PreviewBasicInformation = ({ trainerBasicInfo }) => {
  // Get gender icon using utility function, styled with Tailwind size "3xl"
  const { icon } = getGenderIcon(trainerBasicInfo?.gender, "3xl");

  return (
    <div className="p-2">
      {/* Trainer Profile Image */}
      <img
        src={trainerBasicInfo?.imageUrl || "/default-profile.png"}
        alt={trainerBasicInfo?.name || "Trainer"}
        className="w-40 h-40 rounded-xl mx-auto mb-2"
        loading="lazy"
      />

      {/* Trainer Name and Gender Icon */}
      <div className="flex justify-center items-center gap-3">
        <p className="text-xl font-bold text-black">
          {trainerBasicInfo?.name || "Unknown Trainer"}
        </p>
        {/* Gender icon next to the name */}
        <span>{icon}</span>
      </div>

      {/* Divider */}
      <hr className="bg-gray-500 p-[1px] w-1/2 mx-auto" />

      {/* Section containing bio and stats */}
      <div className="p-2 space-y-6">
        {/* Trainer Bio Section */}
        <div>
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800">
            About {trainerBasicInfo?.name || "Unknown Trainer"}
          </h2>

          {/* Bio content */}
          <div className="border border-black bg-white mt-2 p-4 min-h-[100px] rounded-md shadow-sm">
            <p className="text-lg text-black italic whitespace-pre-wrap">
              {trainerBasicInfo?.bio?.trim()
                ? trainerBasicInfo.bio
                : "No bio available."}
            </p>
          </div>
        </div>

        {/* Experience, Age, and Available Days Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dynamic stat card rendering */}
          {[
            {
              title: "Experience",
              value: trainerBasicInfo?.experience
                ? `${trainerBasicInfo.experience} years`
                : "N/A",
            },
            {
              title: "Age",
              value: trainerBasicInfo?.age
                ? `${trainerBasicInfo.age} years`
                : "N/A",
            },
            {
              title: "Available Days",
              value:
                trainerBasicInfo?.availableDays?.length > 0
                  ? trainerBasicInfo.availableDays.join(", ")
                  : "Not available",
            },
          ].map(({ title, value }) => (
            <div
              key={title}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-xl transition"
            >
              {/* Card title */}
              <h3 className="font-semibold text-xl text-gray-800">{title}</h3>

              {/* Card value text; smaller font for Available Days */}
              <p
                className={`mt-1 text-center italic text-black ${
                  title === "Available Days" ? "text-sm" : "text-lg"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define expected prop types for the component
PreviewBasicInformation.propTypes = {
  trainerBasicInfo: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    gender: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableDays: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default PreviewBasicInformation;
