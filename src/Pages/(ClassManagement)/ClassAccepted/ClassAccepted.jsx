import React from "react";
import { RiArchiveDrawerLine } from "react-icons/ri";

const ClassAccepted = ({ ClassBookingAcceptedData, Refetch }) => {
  console.log(ClassBookingAcceptedData);

  // Function for Opening Dowers
  const openDrawer = () => {
    const drawerCheckbox = document.getElementById("trainer-settings-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = true;
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen text-black">
      {/* Header Section */}
      <div className="flex md:block items-center md:mx-auto md:text-center space-y-1 py-4 px-2">
        {/* Title Cars */}
        <div>
          {/* Title */}
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

      <div className="mx-auto bg-white w-1/3 p-[1px] mb-3" />
    </div>
  );
};

export default ClassAccepted;
