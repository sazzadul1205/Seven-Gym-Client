import { FaCheck, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { useMemo, useState } from "react";

import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import CachedUserInfo from "../../(AdminPanel)/AllTrainerBookings/CachedUserInfo";
import { getRejectionReason } from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestButton/getRejectionReasonPrompt";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const ClassRequest = ({ ClassBookingRequestData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [userInfoCache, setUserInfoCache] = useState({});

  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Filters
  const uniqueClasses = useMemo(() => {
    return [...new Set(ClassBookingRequestData.map((d) => d.classesName))];
  }, [ClassBookingRequestData]);

  const uniqueDurations = useMemo(() => {
    return [...new Set(ClassBookingRequestData.map((d) => d.duration))];
  }, [ClassBookingRequestData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingRequestData.map((d) => {
          const date = new Date(d.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingRequestData]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return ClassBookingRequestData.filter((item) => {
      const applicant = item.applicantData || item;
      const email = applicant?.applicantEmail?.toLowerCase() || "";
      const phone = applicant?.applicantPhone?.toLowerCase() || "";

      const cachedUser = userInfoCache[email];
      const userFullName = cachedUser?.fullName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedUserSearch ||
        email.includes(normalizedUserSearch) ||
        phone.includes(normalizedUserSearch) ||
        userFullName.includes(normalizedUserSearch);

      const date = new Date(item.submittedDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}`;

      const matchesFilters =
        (!selectedClass || item.classesName === selectedClass) &&
        (!selectedDuration || item.duration === selectedDuration) &&
        (!selectedMonthYear || monthYear === selectedMonthYear);

      return matchesSearch && matchesFilters;
    });
  }, [
    ClassBookingRequestData,
    normalizedUserSearch,
    selectedClass,
    selectedDuration,
    selectedMonthYear,
    userInfoCache,
  ]);

  // Function: Reject Class Booking with reason input
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

    // Exit if cancelled or no reason provided
    if (!reason) return;

    // Step 3: Create payload and send to server
    const payload = {
      applicant,
      status: "Rejected",
      rejectedAt: new Date().toISOString(),
      reason: reason.trim(),
    };

    // Step 3: Update backend applicant status to "Rejected"
    try {
      // await axiosPublic.patch(
      //   `/Trainer_Booking_Request/${applicant._id}`,
      //   payload
      // );
      console.log(payload);

      // Step 4: Show success message and refresh UI
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
        text: "Something went wrong while rejecting the Booking.",
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen text-black">
      {/* Header Section */}
      <div className="text-center space-y-1 py-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Class Booking Requests
        </h3>
        <p className="text-black text-sm sm:text-base mt-1">
          Manage and respond to client class bookings
        </p>
      </div>

      <div className="mx-auto bg-white w-1/3 p-[1px] mb-3" />

      {/* Filter Section */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
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
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              {[
                "#",
                "Applicant Info",
                "Class Name",
                "Duration",
                "Price",
                "Submitted",
                "Phone",
                "Action",
              ].map((label, i) => (
                <th key={i} className="px-4 py-4 border">
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.map((item, index) => {
              const applicant = item.applicantData || item;
              const email = applicant?.applicantEmail;
              return (
                <tr key={item._id} className="bg-white hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="py-3 px-4 font-medium">{index + 1}</td>

                  {/* User Info */}
                  <td className="px-4 py-3 font-medium">
                    <TrainerBookingRequestUserBasicInfo
                      email={email}
                      renderUserInfo={(user) => (
                        <CachedUserInfo
                          user={user}
                          email={email}
                          setUserInfoCache={setUserInfoCache}
                          userInfoCache={userInfoCache}
                        />
                      )}
                    />
                  </td>
                  <td className="py-3 px-4">{item.classesName}</td>
                  <td className="py-3 px-4 capitalize">{item.duration}</td>
                  <td className="py-3 px-4 font-semibold">
                    ${parseFloat(item.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(item.submittedDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {applicant?.applicantPhone || applicant?.phone}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-3">
                      <button
                        id={`accept-applicant-btn-${item._id}`}
                        className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      >
                        <FaCheck className="text-green-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#accept-applicant-btn-${item._id}`}
                        content="Accept Applicant"
                      />
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRequest;
