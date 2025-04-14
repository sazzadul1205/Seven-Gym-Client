import Swal from "sweetalert2";

const MySwal = Swal;

export const getRejectionReason = async () => {
  const { value: reason } = await MySwal.fire({
    title: "Reason for Rejection",
    html: `
      <div class="flex flex-col space-y-2">
        <label for="reasonInput" class="text-left text-sm font-medium text-gray-700">
          Select or type a reason
        </label>
        <input 
          id="reasonInput" 
          list="reasonOptions"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all w-full text-sm" 
          placeholder="e.g. Trainer not available or write your own"
        />
        <datalist id="reasonOptions">
          <option value="Trainer not available"></option>
          <option value="Invalid time slot"></option>
          <option value="Payment issue"></option>
          <option value="Violation of gym policy"></option>
          <option value="Scheduling conflict"></option>
          <option value="Session already booked by another client"></option>
          <option value="Insufficient information provided"></option>
          <option value="Client request to cancel"></option>
          <option value="Trainer unavailable due to emergency"></option>
          <option value="Session overlaps with another appointment"></option>
          <option value="Client is not eligible for this session"></option>
          <option value="Technical issue during booking"></option>
          <option value="Exceeded session limit for this trainer"></option>
          <option value="Unverified or suspicious booking details"></option>
          <option value="Other"></option>
        </datalist>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Submit Reason",
    focusConfirm: false,
    preConfirm: () => {
      const input = document.getElementById("reasonInput").value.trim();
      if (!input) {
        Swal.showValidationMessage("Please provide a reason.");
      }
      return input;
    },
  });

  return reason || null; // Return null if cancelled
};
