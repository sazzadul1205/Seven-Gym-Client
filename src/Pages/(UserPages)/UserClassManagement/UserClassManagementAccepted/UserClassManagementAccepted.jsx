import { Link } from "react-router";
import { useState } from "react";

// import Packages
import PropTypes from "prop-types";

// import Icons
import { FaInfoCircle } from "react-icons/fa";

// import Common Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// import Accepted Card
import UserClassAcceptedCard from "./UserClassAcceptedCard/UserClassAcceptedCard";

// Import Modals
import PayedClassReceptModal from "./PayedClassReceptModal/PayedClassReceptModal";
import ClassAcceptedPaymentDetailsModal from "./ClassAcceptedPaymentDetailsModal/ClassAcceptedPaymentDetailsModal";
import ClassAcceptedDetailsModal from "../../../(ClassManagement)/ClassAccepted/ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";

const UserClassManagementAccepted = ({
  ClassBookingAcceptedData,
  refetchAll,
}) => {
  const [selectedAcceptedData, setSelectedAcceptedData] = useState("");
  const [PaymentSuccessData, setPaymentSuccessData] = useState("");

  return (
    <div className="p-1 pt-10 md:p-10 space-y-2">
      {/* Tittle */}
      <h2 className="text-xl md:text-3xl font-bold text-center text-white">
        Your Class Booking Accepted
      </h2>

      <div className="bg-white mx-auto p-[2px] w-1/3 mb-8 mb:mb-10" />

      {/* Cards and fallback */}
      {ClassBookingAcceptedData.length === 0 ? (
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
        // Request Cards
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ClassBookingAcceptedData.map((item) => (
            <UserClassAcceptedCard
              key={item._id}
              item={item}
              id="Class_Accepted_Details_Modal"
              setSelectedAcceptedData={setSelectedAcceptedData}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <dialog id="Class_Accepted_Details_Modal" className="modal">
        <ClassAcceptedDetailsModal
          selectedBookingAcceptedData={selectedAcceptedData}
          setSelectedBookingAcceptedData={setSelectedAcceptedData}
        />
      </dialog>

      <dialog id="Class_Accepted_Payment_Details_Modal" className="modal">
        <ClassAcceptedPaymentDetailsModal
          selectedBookingAcceptedData={selectedAcceptedData}
          setPaymentSuccessData={setPaymentSuccessData}
          refetchAll={refetchAll}
        />
      </dialog>

      <dialog id="Payed_Class_Recept_Modal" className="modal">
        <PayedClassReceptModal paymentSuccessData={PaymentSuccessData} />
      </dialog>
    </div>
  );
};

// prop Validation
UserClassManagementAccepted.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      paid: PropTypes.bool.isRequired,
      applicant: PropTypes.shape({
        classesName: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
        submittedDate: PropTypes.string.isRequired,
        applicantData: PropTypes.object,
      }).isRequired,
    })
  ).isRequired,
  refetchAll: PropTypes.func.isRequired,
};

export default UserClassManagementAccepted;
