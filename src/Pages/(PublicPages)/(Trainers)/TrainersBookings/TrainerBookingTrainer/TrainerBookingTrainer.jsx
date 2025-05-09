// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { IoLanguage } from "react-icons/io5";
import { RiFocus2Fill } from "react-icons/ri";
import { FaRegCircleDot } from "react-icons/fa6";

// Import Utility
import { getGenderIcon } from "../../../../../Utility/getGenderIcon";
import { fetchTierBadge } from "../../../../../Utility/fetchTierBadge";


const TrainerBookingTrainer = ({ trainer }) => {
  // Get gender details (icon + label)
  const { icon } = getGenderIcon(trainer?.gender);

  return (
    <div className="bg-gradient-to-t from-gray-500/80 to-gray-500/50 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-10 px-4 bg-black/20 rounded-4xl">
        {/* Left Section : Trainer image and basic info */}
        <div className="w-full md:w-1/4 items-center space-x-4 mx-auto my-auto border-r border-white">
          {/* Trainer Profile Picture */}
          <img
            src={trainer?.imageUrl}
            alt="Trainer Profile"
            className="w-52 h-52 rounded-full border border-gray-300 mx-auto"
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
                className={`inline-block px-6 py-1 mt-2 rounded-full text-sm font-semibold cursor-pointer ${fetchTierBadge(
                  trainer?.tier
                )}`}
              >
                {trainer?.tier} Tier
              </span>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-3/4 space-y-4 px-5">
          {/* About Part */}
          <div className="items-center gap-2 text-gray-200">
            <p className="text-gray-200 font-semibold text-xl py-2">
              About {trainer?.name}:
            </p>
            {trainer?.bio || "N/A"}
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 text-gray-200">
            <p className="text-gray-200">Experience:</p>
            {trainer?.experience ? `${trainer.experience} years` : "N/A"}
          </div>

          {/* Certifications & Focus Areas */}
          <div className="flex gap-1">
            {/* Certifications */}
            <div className="items-center gap-2 text-gray-200">
              <p className="text-gray-200 font-semibold text-lg py-1">
                Certifications:
              </p>
              <p className="flex flex-wrap leading-6">
                {trainer?.certifications?.length > 0
                  ? trainer.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="mr-2 flex items-center gap-2"
                      >
                        <FaRegCircleDot />
                        {cert}
                        {index < trainer.certifications.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "N/A"}
              </p>
            </div>

            {/* Divider */}
            <div className="p-[1px] h-auto bg-white" />

            {/* Focus Areas */}
            <div className="items-center gap-2 text-gray-200">
              <p className="text-gray-200 font-semibold text-lg py-1">
                Focus Areas:
              </p>

              <p className="flex flex-wrap leading-6">
                {trainer?.preferences?.focusAreas?.length > 0
                  ? trainer.preferences.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="mr-2 flex items-center gap-2"
                      >
                        <RiFocus2Fill />
                        {area}
                        {index < trainer.preferences.focusAreas.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="items-center gap-2 text-gray-200">
            <p className="text-gray-200 font-semibold text-lg py-1">
              Languages Spoken:
            </p>
            <p className="flex flex-wrap leading-6">
              {trainer?.languagesSpoken?.length > 0
                ? trainer.languagesSpoken.map((lang, index) => (
                    <span key={index} className="mr-2 flex items-center gap-2">
                      <IoLanguage />
                      {lang}
                      {index < trainer.languagesSpoken.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "N/A"}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col md:flex-row items-center gap-2 text-gray-200">
            <p className="text-gray-200 font-semibold text-lg py-1">Contact:</p>

            {/* Email */}
            {trainer?.contact?.email ? (
              <a
              
                href={`mailto:${trainer.contact.email}`}
                className="text-white hover:underline break-all md:mr-4"
              >
                {trainer.contact.email}
              </a>
            ) : (
              "N/A"
            )}

            {/* Phone */}
            {trainer?.contact?.phone && (
              <span className="text-gray-200 break-all">{`| ${trainer.contact.phone}`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Types Validation
TrainerBookingTrainer.propTypes = {
  trainer: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    gender: PropTypes.oneOf(["Male", "Female", "Other"]),
    specialization: PropTypes.string,
    tier: PropTypes.oneOf(["Bronze", "Silver", "Gold", "Diamond", "Platinum"]),
    bio: PropTypes.string,
    experience: PropTypes.number,
    certifications: PropTypes.arrayOf(PropTypes.string),
    preferences: PropTypes.shape({
      focusAreas: PropTypes.arrayOf(PropTypes.string),
    }),
    languagesSpoken: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
  }),
};

export default TrainerBookingTrainer;
