import Swal from "sweetalert2";

export const getSelectedRefundPercentage = async ({
  reason,
  totalPrice,
  refundPercentages = [100, 75, 50, 25, 0],
}) => {
  const { value: selectedRefund } = await Swal.fire({
    title: "Select Refund Percentage",
    html: `
      <div class="space-y-4 text-left text-sm font-medium text-gray-700">
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Drop Reason:</label>
          <p class="bg-gray-100 p-2 rounded text-gray-900">${reason}</p>
        </div>
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Total Price:</label>
          <p class="bg-gray-100 p-2 rounded text-gray-900">$${Number(
            totalPrice
          ).toFixed(2)}</p>
        </div>
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Select Refund Percentage:</label>
          <div id="refundButtons" class="flex flex-wrap gap-2">
            ${refundPercentages
              .map(
                (percent) => `
                <button type="button"
                  class="refund-btn px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-percent="${percent}">
                  ${percent}%
                </button>`
              )
              .join("")}
          </div>
        </div>
        <input type="hidden" id="selectedRefundInput" />
        <div id="refundPreview" class="mt-2 p-2 rounded bg-green-100 text-green-800 font-semibold">
          Select a percentage to preview refund
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    focusConfirm: false,
    preConfirm: () => {
      const value = document.getElementById("selectedRefundInput").value;
      if (!value) {
        Swal.showValidationMessage("Please select a refund percentage.");
        return false;
      }
      return Number(value);
    },
    didOpen: () => {
      const buttonsContainer = document.getElementById("refundButtons");
      const refundInput = document.getElementById("selectedRefundInput");
      const preview = document.getElementById("refundPreview");

      buttonsContainer.addEventListener("click", (e) => {
        if (e.target && e.target.matches(".refund-btn")) {
          const percent = Number(e.target.getAttribute("data-percent"));
          const refundAmount = ((percent / 100) * totalPrice).toFixed(2);

          // Update preview
          preview.textContent = `${percent}% refund = $${refundAmount}`;
          refundInput.value = percent;

          // Highlight selected
          document
            .querySelectorAll(".refund-btn")
            .forEach((btn) =>
              btn.classList.remove("bg-blue-100", "ring-2", "ring-blue-400")
            );
          e.target.classList.add("bg-blue-100", "ring-2", "ring-blue-400");
        }
      });
    },
  });

  return selectedRefund;
};
