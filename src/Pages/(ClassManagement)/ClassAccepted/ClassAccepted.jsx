import { useMemo, useState } from "react";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { FaRegTrashAlt, FaRegClock, FaSearch, FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import CachedUserInfo from "../../(AdminPanel)/AllTrainerBookings/CachedUserInfo";
import ClassAcceptedDetailsModal from "./ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";
import PropTypes from "prop-types";
import ClassAcceptedSetTimeModal from "./ClassAcceptedSetTimeModal/ClassAcceptedSetTimeModal";
import { format, parse } from "date-fns";
import { IoMdDownload } from "react-icons/io";
import { getRejectionReason } from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestButton/getRejectionReasonPrompt";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

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

const ClassAccepted = ({ ClassBookingAcceptedData, Refetch }) => {
  const axiosPublic = useAxiosPublic();
  // State Management
  const [selectedClass, setSelectedClass] = useState("");
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedBookingAcceptedData, setSelectedBookingAcceptedData] =
    useState("");
  const [showOnlyStarted, setShowOnlyStarted] = useState(false);

  // Local Cache fo User Data
  const [userInfoCache, setUserInfoCache] = useState({});

  // Normalized search term
  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Filters
  const uniqueClasses = useMemo(() => {
    return [
      ...new Set(ClassBookingAcceptedData.map((d) => d.applicant?.classesName)),
    ];
  }, [ClassBookingAcceptedData]);

  const uniqueDurations = useMemo(() => {
    return [
      ...new Set(ClassBookingAcceptedData.map((d) => d.applicant?.duration)),
    ];
  }, [ClassBookingAcceptedData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingAcceptedData.map((d) => {
          const date = new Date(d.applicant?.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingAcceptedData]);

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    return ClassBookingAcceptedData.filter((item) => {
      const applicant = item.applicant || {};
      const applicantData = applicant.applicantData || {};

      const email =
        applicant.applicantEmail?.toLowerCase() ||
        applicantData.email?.toLowerCase() ||
        "";

      const phone =
        applicant.applicantPhone?.toLowerCase() ||
        applicantData.phone?.toLowerCase() ||
        "";

      const cachedUser = userInfoCache[email];
      const userFullName = cachedUser?.fullName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedUserSearch ||
        email.includes(normalizedUserSearch) ||
        phone.includes(normalizedUserSearch) ||
        userFullName.includes(normalizedUserSearch);

      const date = new Date(applicant?.submittedDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}`;

      const matchesFilters =
        (!selectedClass || applicant.classesName === selectedClass) &&
        (!selectedDuration || applicant.duration === selectedDuration) &&
        (!selectedMonthYear || monthYear === selectedMonthYear);

      const matchesPayment = !showOnlyPaid || item.paid === true;
      const matchesStarted = !showOnlyStarted || Boolean(item.startDate);

      return (
        matchesSearch && matchesFilters && matchesPayment && matchesStarted
      );
    });
  }, [
    ClassBookingAcceptedData,
    normalizedUserSearch,
    selectedMonthYear,
    selectedDuration,
    showOnlyStarted,
    selectedClass,
    userInfoCache,
    showOnlyPaid,
  ]);

  // Drawer Toggle
  const openDrawer = () => {
    const drawerCheckbox = document.getElementById("trainer-settings-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = true;
  };

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
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen text-black">
      {/* Header */}
      <div className="flex md:block items-center justify-between md:mx-auto md:text-center space-y-1 py-4 px-2">
        <div>
          <h3 className="text-xl md:text-2xl sm:text-3xl font-bold text-gray-800">
            Class Booking Accepted
          </h3>
        </div>

        {/* Drawer Icon */}
        <div
          className="flex md:hidden p-1 bg-white rounded-full"
          onClick={() => openDrawer()}
        >
          <div className="bg-blue-200 p-2 rounded-full">
            <RiArchiveDrawerLine className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="mx-auto bg-white w-1/3 p-[1px] mb-6" />

      {/* Filter Section */}
      <div className="flex md:flex-row flex-col md:flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by User Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search user..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Filter by Tier */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Search by Class</label>
          <select
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((cls, i) => (
              <option key={i} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Search by Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Durations</option>
            {uniqueDurations.map((dur, i) => (
              <option key={i} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>

        {/* Month-Year Filter */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Search by Date</label>
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            {uniqueMonthYears.map((my, i) => (
              <option key={i} value={my}>
                {my}
              </option>
            ))}
          </select>
        </div>

        {/* Paid Filter */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">All / Paid</label>
          <input
            type="checkbox"
            className="toggle toggle-xl toggle-secondary"
            checked={showOnlyPaid}
            onChange={(e) => setShowOnlyPaid(e.target.checked)}
          />
        </div>

        {/* Start Time Set Filter */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">Pending Only</label>
          <input
            type="checkbox"
            className="toggle toggle-xl toggle-primary"
            checked={showOnlyStarted}
            onChange={(e) => setShowOnlyStarted(e.target.checked)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="hidden md:flex overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100 text-left text-sm">
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
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length > 0 ? (
              filteredData?.map((item, index) => {
                const applicant =
                  item.applicant.applicantData || item.applicant;
                const altEmail = applicant.applicantEmail;
                const { email, phone } = applicant;
                const paid = item.paid;

                const isCompleted = isClassCompleted(item.endDate);
                return (
                  <tr
                    key={item._id}
                    className={`${
                      isCompleted
                        ? "bg-red-100 hover:bg-red-200"
                        : !paid
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* Serial Number */}
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

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

                    {/* Applicant Phone Number */}
                    <td className="py-3 px-4">
                      {phone || applicant.applicantPhone}
                    </td>

                    {/* Applicant Phone Number */}
                    <td className="py-3 px-4">{item.applicant.duration}</td>

                    {/* Class Price */}
                    <td className="py-3 px-4">
                      $ {parseFloat(item.applicant.totalPrice).toFixed(2)}
                    </td>

                    {/* Submitted At */}
                    <td className="py-3 px-4">
                      {item.applicant.submittedDate}
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
                              setSelectedBookingAcceptedData(item);
                              document
                                .getElementById("Class_Accepted_Details_Modal")
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
                                  setSelectedBookingAcceptedData(item);
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 bg-white text-black font-semibold italic"
                >
                  No Booking Accepted Data Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="Class_Accepted_Details_Modal" className="modal">
        <ClassAcceptedDetailsModal
          selectedBookingAcceptedData={selectedBookingAcceptedData}
        />
      </dialog>

      {/* Modal */}
      <dialog id="Class_Accepted_Set_Time_Modal" className="modal">
        <ClassAcceptedSetTimeModal
          setSelectedBookingAcceptedData={setSelectedBookingAcceptedData}
          selectedBookingAcceptedData={selectedBookingAcceptedData}
          Refetch={Refetch}
        />
      </dialog>
    </div>
  );
};

// prop Validation

ClassAccepted.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      applicant: PropTypes.shape({
        applicantData: PropTypes.shape({
          email: PropTypes.string,
          phone: PropTypes.string,
          name: PropTypes.string,
        }),
        applicantEmail: PropTypes.string,
        applicantPhone: PropTypes.string,
        applicantName: PropTypes.string,
        classesName: PropTypes.string,
        duration: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        submittedDate: PropTypes.string,
      }),
      paid: PropTypes.bool,
    })
  ),
  Refetch: PropTypes.func,
};

export default ClassAccepted;
