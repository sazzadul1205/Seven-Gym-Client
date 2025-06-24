import { Link } from "react-router";

import PropTypes from "prop-types";

import groupClass from "../../../../assets/UserProfile/GroupClass.png";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import UserClassCompletedCard from "../../UserClassManagement/UserClassManagementCompleted/UserClassCompletedCard/UserClassCompletedCard";
import { useState } from "react";
import ClassCompletedDetailsModal from "../../UserClassManagement/UserClassManagementCompleted/ClassCompletedDetailsModal/ClassCompletedDetailsModal";

const UserProfileAttendingClasses = ({ ClassBookingAcceptedData }) => {
  const [selectedCompletedData, setSelectedCompletedData] = useState("");
  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl*">
      {/* Header Section */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={groupClass} alt="Group Class Icon" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-black">
          Current Attending Classes
        </h2>
      </div>
      <div className="bg-black p-[1px]"></div>

      {/* If No Classes Are Available */}
      {(!ClassBookingAcceptedData || ClassBookingAcceptedData.length === 0) && (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-gray-500">No classes available at the moment.</p>

          <Link to="/Classes">
            <CommonButton
              text="Book Classes"
              bgColor="blue"
              px="px-10"
              isLoading={false}
              width="auto"
            />
          </Link>
        </div>
      )}

      {/* If Classes Exist, Display List */}
      <div className="pt-5">
        {ClassBookingAcceptedData?.length > 0 && (
          <div className="grid gap-6 grid-cols-1 ">
            {ClassBookingAcceptedData.map((item) => (
              <UserClassCompletedCard
                key={item._id}
                item={item}
                setSelectedCompletedData={setSelectedCompletedData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <dialog id="Class_Completed_Details_Modal" className="modal">
        <ClassCompletedDetailsModal
          selectedCompletedData={selectedCompletedData}
        />
      </dialog>
    </div>
  );
};

// PropTypes validation
UserProfileAttendingClasses.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      className: PropTypes.string,
      classType: PropTypes.string,
      trainerName: PropTypes.string,
      classDate: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

export default UserProfileAttendingClasses;
