import {
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaBiking,
  FaUserAlt,
  FaArrowRight,
} from "react-icons/fa";
import {
  GiWeightLiftingUp,
  GiBoxingGlove,
  GiGymBag,
  GiMuscleUp,
  GiTrophy,
} from "react-icons/gi";
import { MdStar } from "react-icons/md"; // Additional icon (Star)
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

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
    icon: GiTrophy, // New icon (Trophy)
    positions: shuffleArray([
      "top-20 left-10",
      "bottom-[20%] right-[30%]",
      "top-[50%] left-[60%]",
      "bottom-[40%] left-[50%]",
    ]),
  },
  {
    icon: MdStar, // New icon (Star)
    positions: shuffleArray([
      "top-1/4 left-1/3",
      "bottom-1/4 right-[20%]",
      "top-[60%] left-[15%]",
      "bottom-[30%] left-[40%]",
    ]),
  },
];

const TrainerWelcomeSection = () => {
  const iconClasses = "text-3xl text-red-500 absolute opacity-20 z-0";

  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="text-center relative overflow-hidden">
      {/* Radial red glow background */}
      <div
        className="h-[500px] flex justify-center items-center relative z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0) 40%, rgba(239,68,68,0.15) 75%, rgba(239,68,68,0.3) 100%)",
        }}
      >
        <div className="max-w-xl px-4 space-y-3 z-20">
          <h3
            className="text-5xl font-extrabold text-gray-800"
            style={{
              background:
                "linear-gradient(to right, red, orange, green, blue, indigo, violet)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "2px 2px 6px rgba(255, 255, 255, 0.2)", // Lighter shadow for a more subtle border effect
            }}
          >
            Welcome, Future Trainer!
          </h3>

          <p className="mt-2 text-md font-semibold text-gray-700">
            We’re excited to have you join our fitness team.
          </p>
          <p className="mt-1 text-md text-gray-600">
            Let’s set up your professional profile so members can discover and
            book sessions with you. This process is quick and straightforward.
          </p>

          <div className="flex justify-center items-center w-full">
            <CommonButton
              clickEvent={handleClick}
              text="Next Step"
              icon={<FaArrowRight />}
              iconSize="text-lg"
              bgColor="blue"
              px="px-10"
              py="py-3"
              borderRadius="rounded-lg"
              width="auto"
              isLoading={false}
              disabled={false}
              textColor="text-white"
              className="hover:transform hover:translate-x-2 transition-transform duration-300" // Hover animation
              iconPosition="after"
            />
          </div>
        </div>
      </div>

      {/* Loop through icons and their shuffled positions */}
      {icons.map((iconSet, index) =>
        iconSet.positions.map((position, posIndex) => (
          <iconSet.icon
            key={`${index}-${posIndex}`}
            className={`${iconClasses} ${position} w-6 h-6`}
          />
        ))
      )}
    </div>
  );
};

export default TrainerWelcomeSection;
