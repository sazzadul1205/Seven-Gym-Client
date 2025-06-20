import { useMemo, useState } from "react";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { FaRegTrashAlt, FaRegClock, FaSearch, FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import CachedUserInfo from "../../(AdminPanel)/AllTrainerBookings/CachedUserInfo";
import ClassAcceptedDetailsModal from "./ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";
import PropTypes from "prop-types";

const ClassAccepted = ({ ClassBookingAcceptedData }) => {
  // State Management
  const [selectedClass, setSelectedClass] = useState("");
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedBookingAcceptedData, setSelectedBookingAcceptedData] =
    useState("");

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

      return matchesSearch && matchesFilters && matchesPayment;
    });
  }, [
    ClassBookingAcceptedData,
    normalizedUserSearch,
    selectedClass,
    selectedDuration,
    selectedMonthYear,
    userInfoCache,
    showOnlyPaid,
  ]);

  // Drawer Toggle
  const openDrawer = () => {
    const drawerCheckbox = document.getElementById("trainer-settings-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = true;
  };

  // Handle Delete Action
  const handleReject = (item) => {
    console.log("Deleting applicant:", item._id);
    // Your delete logic goes here
  };

  // Handle Start Class Action
  const handleStart = (item) => {
    console.log("Start class for:", item._id);
    // Your start logic here
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
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">All / Paid</label>
          <input
            type="checkbox"
            className="toggle toggle-xl toggle-secondary"
            checked={showOnlyPaid}
            onChange={(e) => setShowOnlyPaid(e.target.checked)}
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
              <th className="py-3 px-4 border">Class Name</th>
              <th className="py-3 px-4 border">Applicant</th>
              <th className="py-3 px-4 border">Phone</th>
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
                const { name, email, phone } = applicant;
                const paid = item.paid;

                return (
                  <tr key={item._id} className="bg-white hover:bg-gray-50">
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

                    {/* Applicant Name */}
                    <td className="py-3 px-4">
                      {name || applicant.applicantName}
                    </td>

                    {/* Applicant Phone Number */}
                    <td className="py-3 px-4">
                      {phone || applicant.applicantPhone}
                    </td>

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
                        <span className="text-green-600 font-medium">
                          Set on start
                        </span>
                      ) : (
                        <span className="italic text-gray-500">
                          Waiting for payment...
                        </span>
                      )}
                    </td>

                    {/* End At */}
                    <td className="py-3 px-4">
                      {paid ? (
                        <span className="text-green-600 font-medium">
                          Set on end
                        </span>
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
                          {paid && (
                            <>
                              <button
                                id={`start-class-btn-${item._id}`}
                                className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                onClick={() => handleStart(item)}
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

      {/* Mobile View */}
      <div className="md:hidden px-2 space-y-4">
        {filteredData.map((item, index) => {
          const applicant = item.applicant.applicantData || item.applicant;
          const altEmail = applicant.applicantEmail;
          const { name, email, phone } = applicant;
          const paid = item.paid;

          return (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="mb-2 font-semibold text-blue-700">
                #{index + 1} - {item.applicant.classesName}
              </div>

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

              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {name || applicant.applicantName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {phone || applicant.applicantPhone}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> $
                  {parseFloat(item.applicant.totalPrice).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Submitted:</span>{" "}
                  {item.applicant.submittedDate}
                </p>
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {paid ? (
                    <span className="text-green-600 font-medium">
                      Set on start
                    </span>
                  ) : (
                    <span className="italic text-gray-500">
                      Waiting for payment...
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {paid ? (
                    <span className="text-green-600 font-medium">
                      Set on end
                    </span>
                  ) : (
                    <span className="italic text-gray-500">
                      Waiting for payment...
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                {/* Delete */}
                <button
                  id={`mobile-delete-${item._id}`}
                  className="p-2 rounded-full bg-red-100 border-2 border-red-500 hover:scale-105"
                  onClick={() => handleReject(item)}
                >
                  <FaRegTrashAlt className="text-red-500" />
                </button>
                <Tooltip
                  anchorSelect={`#mobile-delete-${item._id}`}
                  content="Delete Applicant"
                />

                {/* Details */}
                <button
                  id={`mobile-details-${item._id}`}
                  className="p-2 rounded-full bg-yellow-100 border-2 border-yellow-500 hover:scale-105"
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
                  anchorSelect={`#mobile-details-${item._id}`}
                  content="Details"
                />

                {/* Start Class */}
                {paid && (
                  <>
                    <button
                      id={`mobile-start-${item._id}`}
                      className="p-2 rounded-full bg-blue-100 border-2 border-blue-500 hover:scale-105"
                      onClick={() => handleStart(item)}
                    >
                      <FaRegClock className="text-blue-600" />
                    </button>
                    <Tooltip
                      anchorSelect={`#mobile-start-${item._id}`}
                      content="Start Class"
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <dialog id="Class_Accepted_Details_Modal" className="modal">
        <ClassAcceptedDetailsModal
          selectedBookingAcceptedData={selectedBookingAcceptedData}
        />
      </dialog>
    </div>
  );
};

// prop Validation

ClassAccepted.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
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
  ).isRequired,
  Refetch: PropTypes.func,
};

export default ClassAccepted;
