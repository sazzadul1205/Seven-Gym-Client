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
      <div className="py-6 px-6 text-center">
        <div>
          <h3 className="text-3xl font-extrabold text-gray-800">
            Welcome, Future Trainer!
          </h3>
          <p className="mt-2 text-md text-gray-700">
            We&lsquo;re excited to have you join our fitness team.
          </p>
          <p className="mt-1 text-md text-gray-600">
            Let’s set up your professional profile so members can discover and
            book sessions with you. This process is quick and straightforward.
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-300 w-11/12 mx-auto" />

      {/* Continue Button */}
      <div className="text-center py-4">
        <button className="btn btn-primary px-6 text-white tracking-wide">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default TrainerAddModal;
