import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { ImCross } from "react-icons/im";

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
    { value: "Bodybuilding", label: "Bodybuilding" },
    { value: "CrossFit", label: "CrossFit" },
    { value: "Functional Training", label: "Functional Training" },
    { value: "Core Strength", label: "Core Strength" },
    { value: "Speed Training", label: "Speed Training" },
    { value: "Agility", label: "Agility" },
    { value: "Weight Training", label: "Weight Training" },
    { value: "Running", label: "Running" },
    { value: "Swimming", label: "Swimming" },
    { value: "Cycling", label: "Cycling" },
    { value: "Rock Climbing", label: "Rock Climbing" },
    { value: "Team Sports", label: "Team Sports" },
    { value: "Martial Arts", label: "Martial Arts" },
    { value: "Boxing", label: "Boxing" },
    { value: "Jiu-Jitsu", label: "Jiu-Jitsu" },
    { value: "Kickboxing", label: "Kickboxing" },
    { value: "Parkour", label: "Parkour" },
    { value: "Dance", label: "Dance" },
    { value: "Zumba", label: "Zumba" },
    { value: "Tennis", label: "Tennis" },
    { value: "Golf", label: "Golf" },
    { value: "Rowing", label: "Rowing" },
    { value: "Pilates Reformer", label: "Pilates Reformer" },
    { value: "Pre-natal Fitness", label: "Pre-natal Fitness" },
    { value: "Post-natal Fitness", label: "Post-natal Fitness" },
    { value: "Senior Fitness", label: "Senior Fitness" },
    { value: "Aquatic Exercise", label: "Aquatic Exercise" },
    { value: "Mindfulness", label: "Mindfulness" },
    { value: "Breathing Exercises", label: "Breathing Exercises" },
    { value: "Mental Clarity", label: "Mental Clarity" },
    { value: "Mood Boost", label: "Mood Boost" },
  ]);

  // Color map for unique background colors for each goal
  const goalColors = {
    "Weight Loss": "#FF5733",
    "Muscle Gain": "#33FF57",
    Endurance: "#3357FF",
    "General Fitness": "#FF33A1",
    Flexibility: "#FF8C00",
    "Cardio Improvement": "#8A2BE2",
    "Balance Improvement": "#00CED1",
    "Stress Reduction": "#FFD700",
    "Strength Training": "#C71585",
    HIIT: "#8B0000",
    Yoga: "#ADFF2F",
    Pilates: "#D2691E",
    Rehabilitation: "#32CD32",
    "Sports Performance": "#FF1493",
    "Posture Correction": "#B22222",
    Bodybuilding: "#2E8B57",
    CrossFit: "#DC143C",
    "Functional Training": "#800080",
    "Core Strength": "#F08080",
    "Speed Training": "#6495ED",
    Agility: "#FF6347",
    "Weight Training": "#A52A2A",
    Running: "#7FFF00",
    Swimming: "#00BFFF",
    Cycling: "#FFD700",
    "Rock Climbing": "#FF4500",
    "Team Sports": "#20B2AA",
    "Martial Arts": "#A9A9A9",
    Boxing: "#FF6347",
    "Jiu-Jitsu": "#8B008B",
    Kickboxing: "#B0E0E6",
    Parkour: "#FFD700",
    Dance: "#C71585",
    Zumba: "#FF1493",
    Tennis: "#32CD32",
    Golf: "#98FB98",
    Rowing: "#FF6347",
    "Pilates Reformer": "#FF8C00",
    "Pre-natal Fitness": "#FFB6C1",
    "Post-natal Fitness": "#FFE4B5",
    "Senior Fitness": "#D3D3D3",
    "Aquatic Exercise": "#ADD8E6",
    Mindfulness: "#90EE90",
    "Breathing Exercises": "#F0E68C",
    "Mental Clarity": "#E6E6FA",
    "Mood Boost": "#FFB6C1",
  };

  const getTextColor = (bgColor) => {
    if (!bgColor) return "#FFFFFF"; // Default to white text

    // Convert hex color to RGB
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#FFFFFF"; // Dark text for bright colors, white text for dark colors
  };

  // Use useCallback to memoize this function and avoid unnecessary re-renders
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const goal = event.dataTransfer.getData("goal");

      // Check if goal is not already selected before updating state
      if (!selectedGoals.includes(goal)) {
        setSelectedGoals((prev) => [...prev, goal]);
        setAvailableGoals((prev) => prev.filter((g) => g.value !== goal));
      }
    },
    [selectedGoals, setSelectedGoals]
  );

  // Handle selecting a goal from the dropdown and add it to selectedGoals
  const handleSelect = (option) => {
    // Prevent adding duplicate goals
    if (!selectedGoals.includes(option.value)) {
      setSelectedGoals((prev) => [...prev, option.value]);
      setAvailableGoals((prev) => prev.filter((g) => g.value !== option.value));
    }
  };

  // Remove a selected goal and add it back to availableGoals
  const removeGoal = (goal) => {
    setSelectedGoals((prev) => prev.filter((g) => g !== goal));
    const removedGoal = { value: goal, label: goal };
    setAvailableGoals((prev) =>
      [...prev, removedGoal].sort((a, b) => a.label.localeCompare(b.label))
    );
  };

  return (
    <div className="space-y-4">
      <div
        className="w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label className="block text-gray-700 font-semibold text-xl pb-2">
          My Goals
        </label>
        <div className="flex flex-wrap bg-white gap-2 py-4 px-2">
          {selectedGoals.map((goal) => {
            const bgColor = goalColors[goal] || "#F72C5B";
            const textColor = getTextColor(bgColor);

            return (
              <div
                key={goal}
                className="flex cursor-pointer font-semibold items-center rounded-full px-5 py-2 gap-5 hover:opacity-90"
                style={{
                  backgroundColor: bgColor,
                  
                  color: textColor, // Set text color dynamically
                }}
                onClick={() => removeGoal(goal)}
              >
                <span>{goal}</span> <ImCross />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selector Dropdown */}
      <div className="mb-4 pt-2">
        <Select
          options={availableGoals}
          onChange={handleSelect}
          placeholder="Search and select goals..."
          isSearchable
          className="basic-multi-select text-black"
        />
      </div>
    </div>
  );
};

FitnessGoalsSelector.propTypes = {
  selectedGoals: PropTypes.array.isRequired,
  setSelectedGoals: PropTypes.func.isRequired,
};

export default FitnessGoalsSelector;
