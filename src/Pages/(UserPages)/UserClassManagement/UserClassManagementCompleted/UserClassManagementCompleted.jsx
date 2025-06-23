import { Link } from "react-router";
import { useState } from "react";

// import Packages
import PropTypes from "prop-types";

// import Icons
import { FaInfoCircle } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// import Common Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// import Completed Card
import UserClassCompletedCard from "./UserClassCompletedCard/UserClassCompletedCard";

// Import Modals
import ClassCompletedDetailsModal from "./ClassCompletedDetailsModal/ClassCompletedDetailsModal";

const UserClassManagementCompleted = ({ ClassBookingCompletedData }) => {
  const [selectedCompletedData, setSelectedCompletedData] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(ClassBookingCompletedData.length / itemsPerPage);

  const currentData = ClassBookingCompletedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-1 pt-10 md:p-4 space-y-2">
      {/* Tittle */}
      <h2 className="text-xl md:text-3xl font-bold text-center text-white">
        Your Class Booking Completed
      </h2>

      <div className="bg-white mx-auto p-[2px] w-1/3 mb-10" />

      {/* Cards and fallback */}
      {currentData.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-300 rounded-xl p-6 shadow-sm text-center text-blue-800">
          {/* Icons */}
          <FaInfoCircle className="text-4xl mb-3 text-blue-500" />

          {/* Title */}
          <h3 className="text-xl font-semibold mb-1">
            No Class Booking Requests Found
          </h3>

          {/* Subtitle */}
          <p className="text-sm mb-3">
            It looks like you haven’t requested any classes yet.
          </p>

          {/* Button */}
          <Link to={"/Classes"}>
            <CommonButton
              text="Browse Classes & Request Now"
              bgColor="blue"
              px="px-4"
              py="py-2"
              borderRadius="rounded-full"
              textColor="text-white"
              className=" font-medium"
            />
          </Link>
        </div>
      ) : (
        <>
          {/* Request Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentData.map((item) => (
              <UserClassCompletedCard
                key={item._id}
                item={item}
                setSelectedCompletedData={setSelectedCompletedData}
              />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous Page Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>

              {/* Page Info */}
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              {/* Next Page Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <dialog id="Class_Completed_Details_Modal" className="modal">
        <ClassCompletedDetailsModal
          selectedCompletedData={selectedCompletedData}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
UserClassManagementCompleted.propTypes = {
  ClassBookingCompletedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      paid: PropTypes.bool,
      endDate: PropTypes.string,
      startDate: PropTypes.string,
      acceptedAt: PropTypes.string,
      paidAt: PropTypes.string,
      status: PropTypes.string,
      stripePaymentID: PropTypes.string,
      applicant: PropTypes.shape({
        _id: PropTypes.string,
        classesName: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        submittedDate: PropTypes.string.isRequired,
        applicantData: PropTypes.shape({
          Userid: PropTypes.string,
          email: PropTypes.string,
          name: PropTypes.string,
          phone: PropTypes.string,
        }),
      }).isRequired,
    })
  ).isRequired,
};

export default UserClassManagementCompleted;
