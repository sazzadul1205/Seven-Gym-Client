import { useState, useMemo } from "react"; 

// Import Icons
import { FaSearch } from "react-icons/fa"; 

// Import Packages
import Swal from "sweetalert2"; 
import PropTypes from "prop-types"; 

// import Shared & Hooks
import CommonButton from "../../../Shared/Buttons/CommonButton"; 
import useAxiosPublic from "../../../Hooks/useAxiosPublic"; 

const FeedbackManagement = ({ FeedbackData, Refetch }) => {
  const axiosPublic = useAxiosPublic(); // Get Axios instance with public API config

  // State to track which feedback IDs are selected (for bulk actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // State to filter feedback list by author email
  const [emailFilter, setEmailFilter] = useState("");

  // Toggle selection of a single feedback item by its id
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select or deselect all currently filtered feedback items
  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      // If all are selected, deselect all
      setSelectedIds([]);
    } else {
      // Otherwise, select all filtered feedback IDs
      setSelectedIds(filteredData.map((item) => item._id));
    }
  };

  // Filter FeedbackData based on the emailFilter input, memoized for performance
  const filteredData = useMemo(() => {
    return FeedbackData.filter((item) => {
      // Check if item's email contains the filter text (case-insensitive)
      const emailMatch = item.email
        ?.toLowerCase()
        .includes(emailFilter.toLowerCase());
      return emailMatch;
    });
  }, [FeedbackData, emailFilter]);

  // Delete a single feedback by id after user confirmation
  const handleDelete = async (id) => {
    // Show confirmation modal
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this feedback?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        // Call API to delete feedback
        await axiosPublic.delete(`/Feedback/${id}`);

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Feedback deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        // Remove the deleted id from selected list
        setSelectedIds((prev) => prev.filter((x) => x !== id));

        // Trigger refetch to update feedback list
        Refetch();
      } catch (error) {
        console.log(error);

        // Show error message on failure
        Swal.fire({
          icon: "error",
          title: "Failed to delete feedback",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  // Bulk delete selected feedback items after confirmation
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return; // No selected items, do nothing

    // Confirm bulk deletion with user
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete selected feedbacks?",
      text: `You're about to delete ${selectedIds.length} item(s).`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
    });

    if (result.isConfirmed) {
      try {
        // Call API to delete multiple feedbacks by IDs
        await axiosPublic.delete(`/Feedback`, { data: { ids: selectedIds } });

        // Show success notification
        Swal.fire({
          icon: "success",
          title: `${selectedIds.length} feedback(s) deleted.`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        // Clear selection and refresh list
        setSelectedIds([]);
        Refetch();
      } catch (error) {
        console.log(error);

        // Show error notification on failure
        Swal.fire({
          icon: "error",
          title: "Failed to delete feedbacks",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="text-black pb-5">
      {/* Header showing total feedback count */}
      <div className="bg-gray-400 py-2 flex items-center">
        <div className="flex-shrink-0 w-10" /> {/* spacer */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Feedback (Admin) [ Total Feedback&apos;s: {FeedbackData.length} ]
        </h3>
        <div className="flex-shrink-0 w-10" /> {/* spacer */}
      </div>

      {/* Filter section */}
      <div className="flex items-center justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Email filter input */}
        <div className="flex flex-col w-full sm:w-[240px]">
          <label className="text-xs sm:text-sm font-semibold text-white mb-1">
            Search by Author
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="email"
              placeholder="email..."
              className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk delete button shown only if items are selected */}
        {selectedIds.length > 0 && (
          <CommonButton
            clickEvent={handleBulkDelete}
            text={`Delete Selected (${selectedIds.length})`}
            bgColor="DarkRed"
            px="px-6"
            py="py-3"
            borderRadius="rounded-full"
            textColor="text-white"
            className="shadow-sm hover:shadow-md transition duration-300"
          />
        )}
      </div>

      {/* Feedback table or no data message */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                {/* Checkbox for select all */}
                <th className="px-4 py-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === filteredData.length
                      }
                      onChange={handleSelectAll}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border-[2.5px] border-gray-700 peer-checked:border-red-600 peer-checked:bg-red-600 flex items-center justify-center transition">
                      {/* Checkmark icon shown when checked */}
                      <svg
                        className="w-2.5 h-2.5 text-white hidden peer-checked:block"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </label>
                </th>
                {/* Table columns */}
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Submitted At</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Map over filtered feedback data */}
              {filteredData.map((feedback) => {
                const isSelected = selectedIds.includes(feedback._id); 
                return (
                  <tr
                    key={feedback._id}
                    className={`border-b transition duration-150 ${
                      isSelected ? "bg-red-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Checkbox to select this feedback */}
                    <td className="px-4 py-2 border">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelect(feedback._id)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-full border-[2.5px] border-gray-700 peer-checked:border-red-600 peer-checked:bg-red-600 flex items-center justify-center transition">
                          <svg
                            className="w-2.5 h-2.5 text-white hidden peer-checked:block"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </label>
                    </td>

                    {/* Name, fallback to "N/A" if missing */}
                    <td className="px-4 py-2 border">
                      {feedback.name || "N/A"}
                    </td>

                    {/* Email, fallback to "N/A" */}
                    <td className="px-4 py-2 border">
                      {feedback.email || "N/A"}
                    </td>

                    {/* Feedback message or alternative fields */}
                    <td className="px-4 py-2 border">
                      {feedback.feedback || feedback.message || "No content"}
                    </td>

                    {/* Rating or "N/A" */}
                    <td className="px-4 py-2 border">
                      {feedback.rating || "N/A"}
                    </td>

                    {/* Submitted date formatted or "N/A" */}
                    <td className="px-4 py-2 border w-[200px]">
                      {feedback.submittedAt
                        ? new Date(feedback.submittedAt)
                            .toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace(",", "")
                        : "N/A"}
                    </td>

                    {/* Delete button triggers single delete */}
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="text-red-600 hover:underline cursor-pointer"
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Show this if no feedback found after filtering
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No feedbacks found.
          </p>
        </div>
      )}
    </div>
  );
};

// PropTypes validate input props for this component
FeedbackManagement.propTypes = {
  FeedbackData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      feedback: PropTypes.string,
      message: PropTypes.string,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      submittedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default FeedbackManagement;
