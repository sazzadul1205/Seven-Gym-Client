// import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoInformation } from "react-icons/io5";

// import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Shared
import CommonButton from "../../../Shared/Buttons/CommonButton";
import { useState } from "react";
import ApplicationsModal from "./ApplicationsModal/ApplicationsModal";

const AdminUserForm = ({ UserFormData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [selectedApplication, setSelectedApplication] = useState(false);

  const handleAccept = async (user) => {
    try {
      const confirm = await Swal.fire({
        title: "Confirm Role Update",
        text: `Are you sure you want to assign this user as a ${user?.position}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Yes, Accept",
      });

      if (confirm.isConfirmed) {
        const response = await axiosPublic.put("/Users/UpdateRole", {
          id: user?.userId, // ✅ Use the actual User ID, not form ID
          role: user?.position,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Accepted",
            text: "User role updated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          Refetch();
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while updating the role.",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This application will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        const res = await axiosPublic.delete(`/User_Form/${id}`);

        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The application has been successfully removed.",
            timer: 1500,
            showConfirmButton: false,
          });

          Refetch();
        }
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="text-black">
      {/* Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          User Applications (Admin)
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
          <thead className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">DOB</th>
              <th className="px-4 py-2 border">Gender</th>
              <th className="px-4 py-2 border">Position</th>
              <th className="px-4 py-2 border">Submitted At</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {UserFormData?.length > 0 ? (
              UserFormData.map((user, index) => (
                <tr key={user._id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.fullName}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.phone}</td>
                  <td className="px-4 py-2 border">{user.dob}</td>
                  <td className="px-4 py-2 border">{user.gender}</td>
                  <td className="px-4 py-2 border">{user.position}</td>
                  <td className="px-4 py-2 border">{user.submittedAt}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <div className="flex gap-2 justify-center">
                      {/* Details Button */}
                      <CommonButton
                        text="Details"
                        icon={<IoInformation />}
                        iconPosition="before"
                        textColor="text-white"
                        bgColor="yellow"
                        px="px-3"
                        py="py-2"
                        borderRadius="rounded"
                        cursorStyle="cursor-pointer"
                        clickEvent={() => {
                          setSelectedApplication(user);
                          document
                            .getElementById("Applications_Modal")
                            .showModal();
                        }}
                      />

                      {/* Accept Button */}
                      <CommonButton
                        text="Accept"
                        icon={<FaCheck />}
                        iconPosition="before"
                        textColor="text-white"
                        bgColor="green"
                        px="px-3"
                        py="py-2"
                        borderRadius="rounded"
                        cursorStyle="cursor-pointer"
                        clickEvent={() => handleAccept(user)}
                      />

                      {/* Reject Button */}
                      <CommonButton
                        text="Reject"
                        icon={<FaTimes />}
                        iconPosition="before"
                        textColor="text-white"
                        bgColor="DarkRed"
                        px="px-3"
                        py="py-2"
                        borderRadius="rounded"
                        cursorStyle="cursor-pointer"
                        clickEvent={() => handleReject(user._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <dialog id="Applications_Modal" className="modal">
        <ApplicationsModal selectedApplication={selectedApplication} />
      </dialog>
    </div>
  );
};

// Prop Validation
AdminUserForm.propTypes = {
  UserFormData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      dob: PropTypes.string,
      gender: PropTypes.string,
      position: PropTypes.string,
      submittedAt: PropTypes.string,
    })
  ),
  Refetch: PropTypes.func.isRequired,
};

export default AdminUserForm;
