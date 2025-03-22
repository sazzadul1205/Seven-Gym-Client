const GenerateUserScheduleModal = () => {
  return (
    <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
      <h3 className="font-bold text-xl text-blue-500">No Schedule Found</h3>
      <p className="py-4 text-gray-700">
        You currently have no schedule. Would you like to generate a new
        schedule?
      </p>
      {/* Modal Actions */}
      <div className="flex justify-center gap-4 mt-4">
        <button className="bg-linear-to-bl hover:bg-linear-to-tr from-green-400 to-green-600 text-white font-semibold rounded-lg cursor-pointer px-8 py-3">
          Generate Schedule
        </button>
        <button className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-400 to-gray-600 text-white font-semibold rounded-lg cursor-pointer px-8 py-3">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GenerateUserScheduleModal;
