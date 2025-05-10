// Import Prop Validation
import PropTypes from "prop-types";

// Import Icon
import { FaArrowRight } from "react-icons/fa";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Welcome section shown on step 0 of the Trainer Add Modal
const TrainerAddModalWelcomeSection = ({ onNextStep }) => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center relative overflow-hidden max-w-xl px-4 space-y-3 z-20 flex flex-col justify-center">
        {/* Heading with gradient text */}
        <h3
          className="text-5xl font-extrabold text-gray-800"
          style={{
            background:
              "linear-gradient(to right, red, orange, green, blue, indigo, violet)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "2px 2px 6px rgba(255, 255, 255, 0.2)",
          }}
        >
          Welcome, Future Trainer!
        </h3>

        {/* Subheading text */}
        <p className="mt-2 text-md font-semibold text-gray-700">
          We’re excited to have you join our fitness team.
        </p>

        {/* Description */}
        <p className="mt-1 text-md text-gray-600">
          Let’s set up your professional profile so members can discover and
          book sessions with you. This process is quick and straightforward.
        </p>

        {/* Next step button */}
        <div className="flex justify-center items-center w-full">
          <CommonButton
            clickEvent={onNextStep}
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
            className="hover:transform hover:translate-x-2 transition-transform duration-300"
            iconPosition="after"
          />
        </div>
      </div>
    </div>
  );
};

// Prop validation
TrainerAddModalWelcomeSection.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalWelcomeSection;
