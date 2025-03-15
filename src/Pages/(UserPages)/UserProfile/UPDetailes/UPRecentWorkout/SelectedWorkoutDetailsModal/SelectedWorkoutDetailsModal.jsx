import React from "react";
import PropTypes from "prop-types";

// Import Icons
import {
  FaClock,
  FaFire,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaStickyNote,
  FaWeight,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-4 py-2">
    {React.cloneElement(icon, { className: `text-xl ${iconColor}` })}
    <div className="flex-1">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="block text-gray-600">{String(value ?? "N/A")}</span>
    </div>
  </li>
);

// PropTypes for WorkoutDetailItem
WorkoutDetailItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string.isRequired,
};

const SelectedWorkoutDetailsModal = ({ selectedWorkout }) => {
  if (!selectedWorkout) {
    return (
      <div className="modal-box bg-white rounded-lg shadow-xl max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">No Workout Selected</h2>
        <p className="text-gray-600">
          Please select a workout to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="modal-box bg-gradient-to-br from-gray-300 to-white rounded-lg shadow-xl max-w-md mx-auto p-6">
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedWorkout.name}
        </h2>
        <button
          onClick={() =>
            document.getElementById("Selected_Workout_Details_Modal").close()
          }
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-hidden cursor-pointer"
        >
          <ImCross className="text-xl text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Workout Details */}
      <ul className="space-y-1">
        <WorkoutDetailItem
          icon={<FaClock />}
          label="Duration"
          value={selectedWorkout.duration}
          iconColor="text-blue-500"
        />
        <WorkoutDetailItem
          icon={<FaFire />}
          label="Calories Burned"
          value={selectedWorkout.calories}
          iconColor="text-red-500"
        />
        <WorkoutDetailItem
          icon={<FaMapMarkerAlt />}
          label="Location"
          value={selectedWorkout.location}
          iconColor="text-purple-500"
        />
        <WorkoutDetailItem
          icon={<FaHeartbeat />}
          label="Workout Type"
          value={selectedWorkout.type}
          iconColor="text-green-500"
        />
        <WorkoutDetailItem
          icon={<FaWeight />}
          label="Intensity"
          value={selectedWorkout.intensity}
          iconColor="text-orange-500"
        />
        <WorkoutDetailItem
          icon={<FaStickyNote />}
          label="Notes"
          value={selectedWorkout.notes}
          iconColor="text-yellow-500"
        />
      </ul>
    </div>
  );
};

// PropTypes for SelectedWorkoutDetailsModal
SelectedWorkoutDetailsModal.propTypes = {
  selectedWorkout: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    type: PropTypes.string,
    intensity: PropTypes.string,
    notes: PropTypes.string,
  }),
};

export default SelectedWorkoutDetailsModal;
