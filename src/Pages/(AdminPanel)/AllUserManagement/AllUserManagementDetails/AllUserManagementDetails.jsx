// Import Icons
import { ImCross } from "react-icons/im";

// Import Packages
import PropTypes from "prop-types";

// Import Utility
import { fetchTierBadge } from "../../../../Utility/fetchTierBadge.js";

// Import Component
import UserProfileSocial from "../../../(UserPages)/UserProfile/UserProfileSocial/UserProfileSocial.jsx";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

// Add Prop Validation
InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Section = ({ title, children }) => (
  <div className="px-5 py-4 border-t border-gray-300">
    <h3 className="text-center font-semibold text-sm mb-2 text-gray-800 uppercase tracking-wide">
      {title}
    </h3>
    {children}
  </div>
);

// Add Prop Validation
Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const AllUserManagementDetails = ({ user }) => {
  const closeModal = () =>
    document.getElementById(`User_Details_${user?._id}`).close();

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-200 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-300 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg text-gray-900">
          {user?.fullName}&apos;s Details
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Profile Image & Tier */}
      <div className="py-5 text-center">
        {/* Images */}
        <img
          src={user?.profileImage}
          alt={user?.fullName}
          className="rounded-full w-32 h-32 mx-auto border-2 border-black object-cover"
        />

        {/* Tier & Duration */}
        <div className="mt-3">
          <span className={fetchTierBadge(user?.tier)}>{user?.tier}</span>
          <p className="text-xs mt-1 italic text-gray-600">
            {user?.tierDuration?.duration} Tier
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="space-y-1">
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={user?.phone} />
          <InfoRow label="DOB" value={user?.dob} />
          <InfoRow label="Gender" value={user?.gender} />
          <InfoRow label="Joined" value={user?.creationTime} />
          <InfoRow label="Role" value={user?.role} />
          <InfoRow label="Tier Start" value={user?.tierDuration?.start} />
          <InfoRow label="Tier End" value={user?.tierDuration?.end} />
        </div>
      </Section>

      {/* Bio / Description */}
      {user?.description && (
        <Section title="Bio / Description">
          <p className="text-sm text-justify whitespace-pre-wrap text-gray-700">
            {user.description}
          </p>
        </Section>
      )}

      {/* Selected Goals */}
      {user?.selectedGoals?.length > 0 && (
        <Section title="Selected Goals">
          <ul className="list-disc list-inside text-sm grid grid-cols-2 gap-x-4 text-gray-800">
            {user.selectedGoals.map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Attending Trainers */}
      {user?.attendingTrainer?.length > 0 && (
        <Section title="Attending Trainers">
          <ul className="grid grid-cols-2 gap-x-4 text-sm text-gray-800">
            {user.attendingTrainer.map((t, idx) => (
              <li key={idx}>{t.name}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Attending Classes */}
      {user?.attendingClasses?.length > 0 && (
        <Section title="Attending Classes">
          <ul className="grid grid-cols-2 gap-x-4 text-sm text-gray-800">
            {user.attendingClasses.map((c, idx) => (
              <li key={idx}>{c.className}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Awards */}
      {user?.awards?.length > 0 && (
        <Section title="Awards">
          <div className="grid gap-4">
            {user.awards.map((award, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start p-3 border border-gray-200 rounded-md bg-white shadow-sm"
              >
                <img
                  src={award.awardIcon}
                  alt={award.awardName}
                  className="w-12 h-12 object-contain"
                />
                <div className="text-sm text-gray-800">
                  <p className="font-semibold">{award.awardName}</p>
                  <p className="text-xs italic text-gray-600">
                    {award.awardRanking}
                  </p>
                  <p className="text-xs">{award.description}</p>
                  <p className="text-xs text-gray-500">
                    {award.dateAwarded} by {award.awardedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Social Links */}
      <Section title="Social Links">
        <UserProfileSocial usersData={user} />
      </Section>
    </div>
  );
};

// Add Prop Validation
AllUserManagementDetails.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    fullName: PropTypes.string,
    profileImage: PropTypes.string,
    tier: PropTypes.string,
    tierDuration: PropTypes.shape({
      duration: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
    }),
    email: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
    creationTime: PropTypes.string,
    role: PropTypes.string,
    description: PropTypes.string,
    selectedGoals: PropTypes.arrayOf(PropTypes.string),
    attendingTrainer: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    attendingClasses: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string,
      })
    ),
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        awardIcon: PropTypes.string,
        awardName: PropTypes.string,
        awardRanking: PropTypes.string,
        description: PropTypes.string,
        dateAwarded: PropTypes.string,
        awardedBy: PropTypes.string,
      })
    ),
    // Add any other props if necessary
  }),
};

export default AllUserManagementDetails;
