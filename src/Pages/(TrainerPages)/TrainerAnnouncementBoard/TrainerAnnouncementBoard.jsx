import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import TiptapEditor from "./TiptapEditor/TiptapEditor";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// ---------------- Announcement Form Component ----------------
const AnnouncementForm = ({
  TrainerData,
  initialData = {},
  refetchAll,
  onCancel,
  onSave,
}) => {
  const axiosPublic = useAxiosPublic();

  // State for managing the announcement title.
  const [title, setTitle] = useState(initialData.title || "");

  // State for managing the announcement content.
  const [content, setContent] = useState(initialData.content || "");

  // Check if we are editing an existing announcement.
  const isEdit = Boolean(initialData._id);

  // Submit handler
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior.
    e.preventDefault();

    // Get current date and time.
    const now = new Date();

    // Prepare the payload for the API request.
    const payload = {
      title,
      content,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      trainerName: TrainerData?.name,
      trainerEmail: TrainerData?.email,
      trainerID: TrainerData?._id,
    };

    try {
      let responseData;

      if (isEdit) {
        // If editing an existing announcement, make a PUT request.
        const res = await axiosPublic.put(
          `/Trainer_Announcement/${initialData._id}`,
          payload
        );

        // Store the response data.
        responseData = res.data;

        // Display success message with SweetAlert.
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Announcement successfully updated!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // If adding a new announcement, make a POST request.
        const res = await axiosPublic.post("/Trainer_Announcement", payload);

        // Store the response data.
        responseData = res.data;

        // Display success message with SweetAlert.
        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Announcement successfully added!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // Call refetchAll to reload the announcements list.
      refetchAll();

      // Pass the response data to the onSave function (update local list).
      onSave(responseData);

      // Call onCancel to close the form.
      onCancel();
    } catch (error) {
      console.error("Error saving announcement:", error);
      Swal.fire({
        // Display error message with SweetAlert.
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the announcement.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="bg-white border-4 border-gray-600 rounded-2xl shadow-md p-4 sm:p-6 text-black">
      <form onSubmit={handleSubmit}>
        {/* Title input section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-gray-400 rounded-t-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm bg-white mb-4">
          <label className="font-semibold text-gray-700 whitespace-nowrap">
            Announcement:
          </label>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter announcement title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* TipTap Rich Text Editor */}
        <TiptapEditor content={content} setContent={setContent} />

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-5">
          <CommonButton
            clickEvent={onCancel}
            text="Cancel"
            bgColor="gray"
            width="w-full sm:w-[100px]"
            py="py-2"
            borderRadius="rounded"
          />
          <CommonButton
            type="submit"
            text={isEdit ? "Update" : "Add"}
            bgColor="blue"
            width="w-full sm:w-[100px]"
            py="py-2"
            borderRadius="rounded"
          />
        </div>
      </form>
    </div>
  );
};

// ---------------- Single Announcement Card ----------------
const AnnouncementCard = ({ announcement, onEdit, onDelete }) => (
  <div
    className="bg-white border-4 border-gray-600 rounded-2xl shadow-md p-5 text-black mb-6"
    key={announcement._id}
  >
    {/* Announcement Title */}
    <h4 className="text-xl font-semibold mb-2">
      Announcement Title: {announcement.title}
    </h4>

    {/* Horizontal line for separation */}
    <hr className="bg-gray-800 my-5 p-[1px]" />

    {/* Display rich HTML content */}
    <div
      className="prose max-w-full mb-4"
      dangerouslySetInnerHTML={{ __html: announcement.content }}
    />

    {/* Another horizontal line for separation */}
    <hr className="bg-gray-800 my-5 p-[1px]" />

    {/* Date/Time footer */}
    <div className="flex justify-between text-black mt-4">
      {/* Display the announcement's date */}
      <p>Date: {announcement.date}</p>

      {/* Display the announcement's time */}
      <p>Time: {announcement.time}</p>
    </div>

    {/* Another horizontal line for separation */}
    <hr className="bg-gray-800 my-5 p-[1px]" />

    {/* Action buttons for Edit and Delete */}
    <div className="flex justify-end gap-5 mt-4">
      <CommonButton
        clickEvent={() => onEdit(announcement)}
        text="Edit"
        bgColor="yellow"
        width="[100px]"
        py="py-2"
        borderRadius="rounded"
      />
      <CommonButton
        clickEvent={() => onDelete(announcement._id)}
        text="Delete"
        bgColor="red"
        width="[100px]"
        py="py-2"
        borderRadius="rounded"
      />
    </div>
  </div>
);

// ---------------- Main Trainer Announcement Board ----------------
const TrainerAnnouncementBoard = ({
  refetchAll,
  TrainerData,
  TrainerAnnouncement,
}) => {
  const axiosPublic = useAxiosPublic();

  // State to store list of announcements
  const [announcements, setAnnouncements] = useState([]);

  // State to track currently editing announcement
  const [editing, setEditing] = useState(null);

  // State to toggle form visibility
  const [showForm, setShowForm] = useState(false);

  // Sync announcements from props (triggered when TrainerAnnouncement prop changes)
  useEffect(() => {
    if (TrainerAnnouncement) {
      const list = Array.isArray(TrainerAnnouncement)
        ? // If already an array, use it
          TrainerAnnouncement
        : // Otherwise, make it an array
          [TrainerAnnouncement];
      // Set the state with the list of announcements
      setAnnouncements(list);
    }
  }, [TrainerAnnouncement]);

  // Save or update an announcement in the state
  const handleSave = (newItem) => {
    setAnnouncements((prev) => {
      // Check if the announcement already exists in state
      const exists = prev.find((a) => a._id === newItem._id);
      if (exists) {
        // If it exists, update it in the state
        return prev.map((a) => (a._id === newItem._id ? newItem : a));
      } else {
        // If it's new, add it to the list
        return [newItem, ...prev];
      }
    });
  };

  // Delete an announcement with confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Perform the delete operation via Axios
          await axiosPublic.delete(`/Trainer_Announcement/${id}`);

          // Refetch the list of announcements after deletion
          refetchAll();

          // Remove the deleted announcement from state
          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
          Swal.fire(
            "Deleted!",
            "The announcement has been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Delete failed", error);
          Swal.fire("Error!", "Failed to delete announcement.", "error");
        }
      }
    });
  };

  // Handle cancellation of editing or form showing
  const handleCancel = () => {
    // Reset editing state
    setEditing(null);

    // Hide the form
    setShowForm(false);
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen p-0 md:p-1">
      {/* Header */}
      <div className="text-center py-3">
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Announcement Board
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Create and manage public announcements for trainers{" "}
        </p>
      </div>

      {/* Divider */}
      <hr className="mx-auto bg-white w-1/3 h-[1px] mb-3" />

      {/* Horizontal line separator */}
      <div className="mx-auto px-2">
        {/* Form for adding/editing */}
        {(showForm || editing) && (
          <AnnouncementForm
            key={editing?._id || "new"}
            TrainerData={TrainerData}
            onCancel={handleCancel}
            refetchAll={refetchAll}
            initialData={editing || {}}
            onSave={handleSave}
          />
        )}

        {/* Empty state when no announcements and form isn't showing */}
        {!showForm && !editing && announcements.length === 0 && (
          <div className="bg-white border-4 border-gray-600 rounded-2xl shadow-md min-h-[500px] flex flex-col justify-center items-center px-4 space-y-6">
            <p className="text-center text-gray-600 text-lg font-medium">
              No announcements yet. Click{" "}
              <span className="font-semibold">
                &quot;Add Announcement&quot;
              </span>{" "}
              to create one.
            </p>
            <CommonButton
              clickEvent={() => setShowForm(true)}
              text="Add Announcement"
              bgColor="green"
              px="px-6"
              py="py-2.5"
              borderRadius="rounded-lg"
              textColor="text-white"
            />
          </div>
        )}

        {/* List of announcements */}
        {!editing &&
          !showForm &&
          announcements.map((ann) => (
            <AnnouncementCard
              key={ann._id}
              announcement={ann}
              onEdit={(a) => setEditing(a)}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
};

// ---------------- PropTypes Definitions ----------------
// PropTypes for AnnouncementForm
AnnouncementForm.propTypes = {
  TrainerData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
  }),
  refetchAll: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

// PropTypes for AnnouncementCard
AnnouncementCard.propTypes = {
  announcement: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// PropTypes for TrainerAnnouncementBoard
TrainerAnnouncementBoard.propTypes = {
  refetchAll: PropTypes.func.isRequired,
  TrainerData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  TrainerAnnouncement: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      })
    ),
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }),
  ]),
};

export default TrainerAnnouncementBoard;
