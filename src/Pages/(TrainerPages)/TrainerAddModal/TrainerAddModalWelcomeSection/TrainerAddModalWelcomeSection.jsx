// Import Prop Validation
import PropTypes from "prop-types";

// Import Icon
import { FaArrowRight } from "react-icons/fa";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Welcome section shown on step 0 of the Trainer Add Modal
const TrainerAddModalWelcomeSection = ({ onNextStep }) => {
  return (
    <div className="flex items-center justify-center min-h-[500px] px-4 py-6 sm:px-6 md:px-10">
      <div className="text-center max-w-2xl space-y-4 z-20 flex flex-col justify-center">
        {/* Heading with gradient text */}
        <h3
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
          style={{
            background:
              "linear-gradient(90deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6, #EC4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          Welcome, Future Trainer!
        </h3>

        {/* Subheading */}
        <p className="text-base sm:text-lg font-semibold text-gray-700">
          We’re excited to have you join our fitness team.
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600">
          Let’s set up your professional profile so members can discover and
          book sessions with you. This process is quick and straightforward.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mt-4">
          <CommonButton
            clickEvent={onNextStep}
            text="Next Step"
            icon={<FaArrowRight />}
            iconSize="text-lg"
            bgColor="blue"
            px="px-8 sm:px-10"
            py="py-2 sm:py-3"
            borderRadius="rounded-lg"
            width="auto"
            isLoading={false}
            disabled={false}
            textColor="text-white"
            className="hover:translate-x-1 hover:shadow-md transition-transform duration-300 ease-in-out"
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
