import TrainerAddModalWelcomeSection from "./TrainerAddModalWelcomeSection/TrainerAddModalWelcomeSection";

const TrainerAddModal = () => {
  return (
    <div className="modal-box max-w-5xl p-0 bg-gradient-to-b from-white to-gray-200 text-black rounded-lg shadow-xl">
      {/* Steps */}
      <div className="px-4 pt-4 border-b-2 border-gray-300">
        <ul className="steps steps-vertical md:steps-horizontal w-full justify-center">
          <li className="step step-primary">Welcome</li>
          <li className="step">Basic Info</li>
          <li className="step">Details</li>
          <li className="step">Sessions</li>
          <li className="step">Preview</li>
        </ul>
      </div>

      {/* Modal Header */}
      <TrainerAddModalWelcomeSection />
    </div>
  );
};

export default TrainerAddModal;
