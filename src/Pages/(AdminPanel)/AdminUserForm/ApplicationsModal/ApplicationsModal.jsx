import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const ApplicationsModal = ({ selectedApplication }) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    position,
    address,
    experience,
    skills,
    submittedAt,
  } = selectedApplication || {};

  return (
    <div className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-4 bg-gray-200 rounded-t">
        <h3 className="font-bold text-lg">User Application</h3>
        <ImCross
          className="text-xl hover:text-red-500 cursor-pointer"
          onClick={() => document.getElementById("Applications_Modal")?.close()}
        />
      </div>

      {/* Application Details */}
      <div className="px-6 py-6 space-y-5">
        {/* Row 1: Full Name, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {fullName}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {email}
            </div>
          </div>
        </div>

        {/* Row 2: Phone, DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Phone</label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {phone}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Date of Birth</label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {dob}
            </div>
          </div>
        </div>

        {/* Row 3: Gender, Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Gender</label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {gender}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">
              Position Applied For
            </label>
            <div className="border border-gray-300 p-2 rounded bg-white">
              {position}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-semibold">Address</label>
          <div className="border border-gray-300 p-2 rounded bg-white min-h-[70px]">
            {address}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-semibold">Experience</label>
          <div className="border border-gray-300 p-2 rounded bg-white min-h-[70px]">
            {experience}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-semibold">Skills</label>
          <div className="border border-gray-300 p-2 rounded bg-white">
            {skills}
          </div>
        </div>

        {/* Submission Date */}
        <div>
          <label className="text-sm font-semibold">Submitted At</label>
          <div className="border border-gray-300 p-2 rounded bg-white">
            {formatDate(submittedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
ApplicationsModal.propTypes = {
  selectedApplication: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
    position: PropTypes.string,
    address: PropTypes.string,
    experience: PropTypes.string,
    skills: PropTypes.string,
    submittedAt: PropTypes.string,
  }),
};

export default ApplicationsModal;
