/* eslint-disable react/prop-types */
import { useState } from "react";
import Select from "react-select";

const FitnessGoalsSelector = ({ selectedGoals, setSelectedGoals }) => {
  // Initialize the list of all available fitness goals
  const [availableGoals, setAvailableGoals] = useState([
    { value: "Weight Loss", label: "Weight Loss" },
    { value: "Muscle Gain", label: "Muscle Gain" },
    { value: "Endurance", label: "Endurance" },
    { value: "General Fitness", label: "General Fitness" },
    { value: "Flexibility", label: "Flexibility" },
    { value: "Cardio Improvement", label: "Cardio Improvement" },
    { value: "Balance Improvement", label: "Balance Improvement" },
    { value: "Stress Reduction", label: "Stress Reduction" },
    { value: "Strength Training", label: "Strength Training" },
    { value: "HIIT", label: "HIIT" },
    { value: "Yoga", label: "Yoga" },
    { value: "Pilates", label: "Pilates" },
    { value: "Rehabilitation", label: "Rehabilitation" },
    { value: "Sports Performance", label: "Sports Performance" },
    { value: "Posture Correction", label: "Posture Correction" },
  ]);

  // Handle drop event to add a goal from the dragged item
  const handleDrop = (event) => {
    event.preventDefault();
    const goal = event.dataTransfer.getData("goal");

    if (!selectedGoals.includes(goal)) {
      setSelectedGoals((prev) => [...prev, goal]);
      setAvailableGoals((prev) => prev.filter((g) => g.value !== goal));
    }
  };

  // Handle selecting a goal from the dropdown
  const handleSelect = (option) => {
    if (!selectedGoals.includes(option.value)) {
      setSelectedGoals((prev) => [...prev, option.value]);
      setAvailableGoals((prev) => prev.filter((g) => g.value !== option.value));
    }
  };

  // Remove a goal from selectedGoals and add it back to availableGoals
  const removeGoal = (goal) => {
    setSelectedGoals((prev) => prev.filter((g) => g !== goal));
    const removedGoal = { value: goal, label: goal };
    setAvailableGoals((prev) =>
      [...prev, removedGoal].sort((a, b) => a.label.localeCompare(b.label))
    );
  };

  return (
    <div className="space-y-4">
      {/* My Goals Section */}
      <div
        className="w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h5 className="text-lg font-semibold py-2">My Goals</h5>
        <div className="flex flex-wrap gap-2 bg-white py-4 px-2">
          {selectedGoals.map((goal) => (
            <span
              key={goal}
              className="px-3 py-1 bg-[#F72C5B] text-white rounded-full cursor-pointer"
              onClick={() => removeGoal(goal)}
            >
              {goal} ✕
            </span>
          ))}
        </div>
      </div>

      {/* Selector Dropdown */}
      <div className="mb-4 pt-2">
        <Select
          options={availableGoals}
          onChange={handleSelect}
          placeholder="Search and select goals..."
          isSearchable
          className="basic-multi-select"
        />
      </div>
    </div>
  );
};

export default FitnessGoalsSelector;
