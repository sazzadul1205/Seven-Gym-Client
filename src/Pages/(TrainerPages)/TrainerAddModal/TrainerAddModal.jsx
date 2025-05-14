// React hook for managing component state
import { useState } from "react";

// Icon Imports from various icon libraries
import {
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaBiking,
  FaUserAlt,
} from "react-icons/fa";
import {
  GiWeightLiftingUp,
  GiBoxingGlove,
  GiGymBag,
  GiMuscleUp,
  GiTrophy,
} from "react-icons/gi";
import { MdStar } from "react-icons/md";

// Importing child components for specific steps in the modal
import TrainerAddModalWelcomeSection from "./TrainerAddModalWelcomeSection/TrainerAddModalWelcomeSection";
import TrainerAddModalInputBasicInformation from "./TrainerAddModalInputBasicInformation/TrainerAddModalInputBasicInformation";
import TrainerAddModalInputPersonalInformation from "./TrainerAddModalInputPersonalInformation/TrainerAddModalInputPersonalInformation";
import TrainerAddModalInputTrainingDetails from "./TrainerAddModalInputTrainingDetails/TrainerAddModalInputTrainingDetails";
import TrainerAddModalInputAwards from "./TrainerAddModalInputAwards/TrainerAddModalInputAwards";
import TrainerAddModalInputPartnerships from "./TrainerAddModalInputPartnerships/TrainerAddModalInputPartnerships";
import TrainerAddModalScheduleSelector from "./TrainerAddModalScheduleSelector/TrainerAddModalScheduleSelector";
import TrainerAddModalScheduleClassSelector from "./TrainerAddModalScheduleClassSelector/TrainerAddModalScheduleClassSelector";
import TrainerAddModalPreview from "./TrainerAddModalPreview/TrainerAddModalPreview";

// Utility function to randomly shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// Predefined icon set and randomized positions for floating decorative icons
const icons = [
  {
    icon: FaDumbbell,
    positions: shuffleArray([
      "top-6 left-10",
      "top-24 left-1/3",
      "bottom-16 right-10",
      "top-[65%] left-[10%]",
      "top-[80%] right-[15%]",
      "top-[5%] right-[25%]",
    ]),
  },
  {
    icon: FaRunning,
    positions: shuffleArray([
      "bottom-10 right-20",
      "top-32 right-10",
      "bottom-[30%] left-[40%]",
      "top-[35%] left-[5%]",
      "top-[20%] right-[10%]",
    ]),
  },
  {
    icon: GiWeightLiftingUp,
    positions: shuffleArray([
      "top-24 right-8",
      "top-1/2 right-1/4",
      "top-[70%] left-[45%]",
      "bottom-[5%] left-[15%]",
    ]),
  },
  {
    icon: GiBoxingGlove,
    positions: shuffleArray([
      "bottom-20 left-16",
      "top-[45%] left-[20%]",
      "bottom-[10%] right-[30%]",
      "top-[30%] right-[5%]",
    ]),
  },
  {
    icon: GiGymBag,
    positions: shuffleArray([
      "top-1/2 left-2",
      "top-[80%] left-[25%]",
      "bottom-[20%] right-[10%]",
    ]),
  },
  {
    icon: GiMuscleUp,
    positions: shuffleArray([
      "bottom-1/4 right-10",
      "top-[60%] right-[35%]",
      "top-[25%] left-[5%]",
      "bottom-[35%] left-[15%]",
    ]),
  },
  {
    icon: FaHeartbeat,
    positions: shuffleArray([
      "bottom-5 left-5",
      "top-[15%] right-[50%]",
      "bottom-[45%] left-[50%]",
      "top-[5%] left-[30%]",
    ]),
  },
  {
    icon: FaUserAlt,
    positions: shuffleArray([
      "top-10 right-1/3",
      "top-[40%] left-[60%]",
      "bottom-[15%] right-[15%]",
      "bottom-[25%] left-[70%]",
    ]),
  },
  {
    icon: FaBiking,
    positions: shuffleArray([
      "bottom-1/2 left-1/4",
      "top-[70%] left-[5%]",
      "top-[10%] right-[5%]",
      "bottom-[10%] left-[60%]",
    ]),
  },
  {
    icon: GiTrophy,
    positions: shuffleArray([
      "top-20 left-10",
      "bottom-[20%] right-[30%]",
      "top-[50%] left-[60%]",
      "bottom-[40%] left-[50%]",
    ]),
  },
  {
    icon: MdStar,
    positions: shuffleArray([
      "top-1/4 left-1/3",
      "bottom-1/4 right-[20%]",
      "top-[60%] left-[15%]",
      "bottom-[30%] left-[40%]",
    ]),
  },
];

// Main component definition
const TrainerAddModal = () => {
  // Track current step in modal process
  const [currentStep, setCurrentStep] = useState(0);

  // Shared classes for floating background icons
  const iconClasses = "text-3xl text-red-500 absolute opacity-20 z-0";

  return (
    <div className="modal-box max-w-5xl p-0 bg-gradient-to-b from-white to-gray-200 text-black rounded-lg shadow-xl">
      {/* Step Navigation Bar */}
      <div className="px-4 py-4 border-b-2 border-gray-300">
        <ul className="steps steps-vertical md:steps-horizontal w-full justify-center">
          {[
            "Welcome",
            "Basic Info",
            "Personal & Contact Info",
            "Trainer Details",
            "Achievements",
            "Partnerships",
            "Schedule Selector",
            "Class Selector",
            "Preview",
          ].map((label, index) => (
            <li
              key={label}
              className={`step text-sm ${
                currentStep >= index ? "step-primary" : ""
              }`}
              onClick={() => setCurrentStep(index)}
              style={{ cursor: "pointer" }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Step Content Area with subtle background radial gradient */}
      <div
        className="min-h-[500px] relative z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0) 40%, rgba(239,68,68,0.15) 75%, rgba(239,68,68,0.3) 100%)",
        }}
      >
        {/* Conditional rendering of step components based on current step */}
        <div>
          {/* Welcome Step Component */}
          {currentStep === 0 && (
            <TrainerAddModalWelcomeSection
              onNextStep={() => setCurrentStep(1)}
            />
          )}

          {/* Basic Info Step Component */}
          {currentStep === 1 && (
            <TrainerAddModalInputBasicInformation
              onNextStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <TrainerAddModalInputPersonalInformation
              onNextStep={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <TrainerAddModalInputTrainingDetails
              onNextStep={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <TrainerAddModalInputAwards onNextStep={() => setCurrentStep(5)} />
          )}

          {currentStep === 5 && (
            <TrainerAddModalInputPartnerships
              onNextStep={() => setCurrentStep(6)}
            />
          )}

          {currentStep === 6 && (
            <TrainerAddModalScheduleSelector
              onNextStep={() => setCurrentStep(7)}
            />
          )}

          {currentStep === 7 && (
            <TrainerAddModalScheduleClassSelector
              onNextStep={() => setCurrentStep(8)}
            />
          )}

          {currentStep === 8 && (
            <TrainerAddModalPreview
              onNextStep={() => setCurrentStep(9)}
            />
          )}
        </div>
      </div>

      {/* Render decorative floating icons in randomized positions */}
      {icons.map((iconSet, index) =>
        iconSet.positions.map((position, posIndex) => {
          const IconComponent = iconSet.icon;
          return (
            <IconComponent
              key={`${index}-${posIndex}`}
              className={`${iconClasses} ${position} w-6 h-6`}
            />
          );
        })
      )}
    </div>
  );
};

export default TrainerAddModal;
