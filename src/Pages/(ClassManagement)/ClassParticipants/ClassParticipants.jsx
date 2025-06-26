import { useMemo, useState } from "react";

// Import Package
import { format, parse } from "date-fns";
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { FaInfo, FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

// import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// import Components 
import CachedUserInfo from "../../(AdminPanel)/AllTrainerBookings/CachedUserInfo";
import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Reason
import { getRejectionReason } from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestButton/getRejectionReasonPrompt";

// Import Modal
import ClassAcceptedSetTimeModal from "../ClassAccepted/ClassAcceptedSetTimeModal/ClassAcceptedSetTimeModal";
import ClassAcceptedDetailsModal from "../ClassAccepted/ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";

const ClassParticipants = ({
  ClassBookingAcceptedData,
  ClassDetailsData,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  const [selectedParticipantData, setSelectedParticipantData] = useState("");

  const [selectedClassId, setSelectedClassId] = useState(
    ClassDetailsData?.[0]?._id || null
  );
  const [selectedClass, setSelectedClass] = useState(
    ClassDetailsData?.[0] || null
  );

  // Local Cache fo User Data
  const [userInfoCache, setUserInfoCache] = useState({});

  const participants = useMemo(() => {
    if (!selectedClass?.module) return [];
    return ClassBookingAcceptedData.filter(
      (item) =>
        item?.applicant?.classesName === selectedClass.module &&
        item?.status === "Accepted" &&
        item?.paid === true
    );
  }, [selectedClass, ClassBookingAcceptedData]);

  // Function: Reject Class Booking with reason input and delete request by ID
  const handleReject = async (applicant) => {
    // Step 1: Confirm rejection action
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this Class Applicant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it",
      cancelButtonText: "No, Keep it",
    });
    if (!confirmReject.isConfirmed) return;

    // Step 2: Prompt user for rejection reason
    const reason = await getRejectionReason();
    if (!reason) return;

    // Step 3: Prepare payload to log the rejection
    const payload = {
      applicant,
      status: "Rejected",
      rejectedAt: new Date().toISOString(),
      reason: reason.trim(),
    };

    try {
      // Step 4: Log the rejection
      await axiosPublic.post(`/Class_Booking_Rejected`, payload);

      // Step 5: Delete original booking request by ID
      await axiosPublic.delete(`/Class_Booking_Accepted/${applicant._id}`);

      // Step 6: Notify and refresh UI
      await Swal.fire({
        title: "Class Application Rejected",
        text: `Reason: ${reason}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      Refetch();
    } catch (error) {
      console.error("Error rejecting Class Booking:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong while rejecting the booking.",
        icon: "error",
      });
    }
  };

  // Handle Delete Action
  const handleDrop = async (item) => {
    try {
      // Step 1: Prompt for rejection reason
      const reason = await getRejectionReason();
      if (!reason) return;

      const { startDate, endDate, applicant, _id } = item;
      const totalPrice = parseFloat(applicant?.totalPrice || 0);

      const parseDate = (str) => {
        const parts = str.match(/(\d{2})-(\d{2})-(\d{4})/);
        if (!parts) return null;
        // eslint-disable-next-line no-unused-vars
        const [_, dd, mm, yyyy] = parts;
        return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
      };

      const start = parseDate(startDate);
      const end = parseDate(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!start || !end || isNaN(start) || isNaN(end)) {
        console.error("Invalid date format.");
        Swal.fire("Error", "Invalid date format", "error");
        return;
      }

      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const usedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
      const remainingDays = Math.max(0, totalDays - usedDays);
      const refundAmount =
        remainingDays > 0
          ? ((remainingDays / totalDays) * totalPrice).toFixed(2)
          : 0;

      // Step 2: Refund via Stripe
      await axiosPublic.post("/Stripe_Refund_Intent", {
        stripePaymentID: item?.stripePaymentID || "",
        refundAmount: parseFloat(refundAmount),
      });

      // Step 3.1: Move to Class_Booking_Refund
      await axiosPublic.post("/Class_Booking_Refund", {
        ...item,
        status: "Dropped",
        droppedAt: new Date().toISOString(),
        refundAmount: parseFloat(refundAmount),
        reason,
      });

      // Step 3.2: Move to Class_Booking_Rejected
      await axiosPublic.post("/Class_Booking_Rejected", {
        ...item,
        status: "Dropped",
        droppedAt: new Date().toISOString(),
        refundAmount: parseFloat(refundAmount),
        reason,
      });

      // Step 4: Delete from Class_Booking_Accepted
      await axiosPublic.delete(`/Class_Booking_Accepted/${_id}`);

      // ✅ Notify user of success
      await Swal.fire({
        icon: "success",
        title: "Booking Dropped",
        text: `Booking was dropped and refund of $${refundAmount} has been processed.`,
      });

      // ✅ Trigger refetch if provided
      Refetch();
    } catch (error) {
      console.error(
        "Error during drop process:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Vertical Tabs */}
        <div className="bg-gray-400 py-2 px-4">
          <div className="flex md:flex-col gap-3">
            {ClassDetailsData.map((cls) => {
              const isActive = selectedClassId === cls._id;
              return (
                <button
                  key={cls._id}
                  onClick={() => {
                    setSelectedClassId(cls._id);
                    setSelectedClass(cls);
                  }}
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 w-full cursor-pointer ${
                    isActive
                      ? "bg-blue-100 border-blue-500 text-blue-700 font-bold shadow"
                      : "bg-white border-gray-300 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <img
                    src={cls.icon}
                    alt={cls.module}
                    className="w-10 h-10 object-contain mb-1"
                  />
                  <span className="text-xs text-center">{cls.module}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Participants Table */}
        <div className="min-h-screen bg-fixed bg-cover bg-center w-full text-black">
          {/* Participant Count */}
          <h2 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-1 p-2">
            {selectedClass?.module} Participants ({participants.length})
          </h2>

          {/* Table */}
          <div className="p-1">
            {participants.length > 0 ? (
              participants?.map((item, index) => {
                const applicant =
                  item.applicant.applicantData || item.applicant;
                const altEmail = applicant.applicantEmail;
                const { email } = applicant;
                const paid = item.paid;
                const isCompleted = isClassCompleted(item.endDate);
                return (
                  <div key={index} className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      {/* Table - Head */}
                      <thead className="bg-gray-400 border border-black">
                        <tr>
                          <th className="py-3 px-4 border">#</th>
                          <th className="py-3 px-4 border">Applicant</th>
                          <th className="py-3 px-4 border">Class Name</th>
                          <th className="py-3 px-4 border">Phone</th>
                          <th className="py-3 px-4 border">Duration</th>
                          <th className="py-3 px-4 border">Price</th>
                          <th className="py-3 px-4 border">Submitted</th>
                          <th className="py-3 px-4 border">Start At</th>
                          <th className="py-3 px-4 border">End At</th>
                          <th className="py-3 px-4 border">Paid</th>
                          <th className="py-3 px-4 border">Actions</th>
                        </tr>
                      </thead>

                      {/* Table - Body */}
                      <tbody className="border border-black">
                        {participants.map((item) => (
                          <tr
                            key={item._id}
                            className={`${
                              isCompleted
                                ? "bg-red-100 hover:bg-red-200 border "
                                : !paid
                                ? "bg-yellow-100 hover:bg-yellow-200 border "
                                : "bg-white hover:bg-gray-50 border "
                            }`}
                          >
                            {/* Serial Number */}
                            <td className="py-3 px-4 font-medium">
                              {index + 1}
                            </td>

                            {/* User Info */}
                            <td className="py-3 px-4">
                              <TrainerBookingRequestUserBasicInfo
                                email={email || altEmail}
                                renderUserInfo={(user) => (
                                  <CachedUserInfo
                                    user={user}
                                    email={email || altEmail}
                                    setUserInfoCache={setUserInfoCache}
                                    userInfoCache={userInfoCache}
                                  />
                                )}
                              />
                            </td>

                            {/* Class Name */}
                            <td className="py-3 px-4 font-semibold">
                              {isCompleted ? (
                                <span className="text-red-600">Completed</span>
                              ) : (
                                item.applicant.classesName
                              )}
                            </td>

                            {/* Applicant Number */}
                            <td className="p-3">
                              {(() => {
                                const rawPhone =
                                  item.applicant?.applicantData?.phone ||
                                  item.applicant?.applicantPhone ||
                                  "";

                                // Ensure it starts with a '+' and add a space after the first 3 digits
                                const formattedPhone = rawPhone
                                  ? `${
                                      rawPhone.startsWith("+") ? "" : "+"
                                    }${rawPhone}`.replace(
                                      /^(\+\d{3})(\d+)/,
                                      (_, code, rest) => `${code} ${rest}`
                                    )
                                  : "N/A";

                                return formattedPhone;
                              })()}
                            </td>

                            {/* Applicant Phone Number */}
                            <td className="py-3 px-4">
                              {item.applicant.duration}
                            </td>

                            {/* Class Price */}
                            <td className="py-3 px-4">
                              ${" "}
                              {parseFloat(item.applicant.totalPrice).toFixed(2)}
                            </td>

                            {/* Submitted At */}
                            <td className="py-3 px-4">
                              {new Date(
                                item?.applicant?.submittedDate
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>

                            {/* Start At */}
                            <td className="py-3 px-4">
                              {paid ? (
                                item.startDate ? (
                                  <span className="text-black font-medium">
                                    {formatDate(item.startDate)}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">
                                    Set Start Time ...
                                  </span>
                                )
                              ) : (
                                <span className="italic text-gray-500">
                                  Waiting for payment...
                                </span>
                              )}
                            </td>

                            {/* End At */}
                            <td className="py-3 px-4">
                              {paid ? (
                                item.endDate ? (
                                  <span className="text-black font-medium">
                                    {formatDate(item.endDate)}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">
                                    Set End Time ...
                                  </span>
                                )
                              ) : (
                                <span className="italic text-gray-500">
                                  Waiting for payment...
                                </span>
                              )}
                            </td>

                            {/* End At */}
                            <td className="p-3 font-bold">
                              {paid ? (
                                <span className="text-green-600">Paid</span>
                              ) : (
                                <span className="text-red-500">Unpaid</span>
                              )}
                            </td>

                            {/* Action */}
                            <td className="py-3 px-4 text-center">
                              <div className="flex gap-3">
                                <>
                                  {paid ? (
                                    <>
                                      <button
                                        id={`drop-applicant-btn-${item._id}`}
                                        className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                        onClick={() => handleDrop(item)}
                                      >
                                        <IoMdDownload className="text-red-600" />
                                      </button>
                                      <Tooltip
                                        anchorSelect={`#drop-applicant-btn-${item._id}`}
                                        content="Drop Applicant"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        id={`delete-applicant-btn-${item._id}`}
                                        className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                        onClick={() => handleReject(item)}
                                      >
                                        <FaRegTrashAlt className="text-red-500" />
                                      </button>
                                      <Tooltip
                                        anchorSelect={`#delete-applicant-btn-${item._id}`}
                                        content="Delete Applicant"
                                      />
                                    </>
                                  )}
                                </>

                                <>
                                  <button
                                    id={`details-applicant-btn-${item._id}`}
                                    className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                    onClick={() => {
                                      setSelectedParticipantData(item);
                                      document
                                        .getElementById(
                                          "Class_Accepted_Details_Modal"
                                        )
                                        .showModal();
                                    }}
                                  >
                                    <FaInfo className="text-yellow-500" />
                                  </button>
                                  <Tooltip
                                    anchorSelect={`#details-applicant-btn-${item._id}`}
                                    content="details Applicant"
                                  />
                                </>

                                {/* Start Button (Only if Paid) */}
                                <>
                                  {paid && !item.startDate && (
                                    <>
                                      <button
                                        id={`start-class-btn-${item._id}`}
                                        className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                        onClick={() => {
                                          setSelectedParticipantData(item);
                                          document
                                            .getElementById(
                                              "Class_Accepted_Set_Time_Modal"
                                            )
                                            .showModal();
                                        }}
                                      >
                                        <FaRegClock className="text-blue-600" />
                                      </button>
                                      <Tooltip
                                        anchorSelect={`#start-class-btn-${item._id}`}
                                        content="Start Class"
                                      />
                                    </>
                                  )}
                                </>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <p className="w-full bg-white py-10 text-center font-bold text-black">
                No Participants for this class.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="Class_Accepted_Details_Modal" className="modal">
        <ClassAcceptedDetailsModal
          selectedBookingAcceptedData={selectedParticipantData}
        />
      </dialog>

      {/* Modal */}
      <dialog id="Class_Accepted_Set_Time_Modal" className="modal">
        <ClassAcceptedSetTimeModal
          setSelectedBookingAcceptedData={setSelectedParticipantData}
          selectedBookingAcceptedData={selectedParticipantData}
          Refetch={Refetch}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
ClassParticipants.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(PropTypes.object).isRequired,
  ClassDetailsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default ClassParticipants;

const isClassCompleted = (endDateStr) => {
  if (!endDateStr) return false;

  const [day, month, year] = endDateStr.split("-").map(Number);
  const endDate = new Date(year, month - 1, day);
  const today = new Date();

  // Set both to midnight for date-only comparison
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return endDate < today; // strictly before today
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  // Parse date from "dd-MM-yyyy" format
  const parsedDate = parse(dateStr, "dd-MM-yyyy", new Date());

  // If invalid date, fallback
  if (isNaN(parsedDate)) return dateStr;

  // Format to "MMM, d, yyyy" → e.g. Mar, 20, 2025
  return format(parsedDate, "MMM, d  yyyy");
};
