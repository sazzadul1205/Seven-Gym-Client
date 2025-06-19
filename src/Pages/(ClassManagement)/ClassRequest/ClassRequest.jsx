import { FaEye } from "react-icons/fa";
import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const ClassRequest = ({ ClassBookingRequestData }) => {
  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-1 py-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Class Booking Requests
        </h3>
        <p className="text-black text-sm sm:text-base mt-1">
          Manage and respond to client class bookings
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px] mb-6" />

      {/* Class Request Management Table */}
      <div className="py-4 px-1">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
          <table className="min-w-full bg-white">
            {/* Table Header */}
            <thead className="bg-gray-800 text-white text-sm uppercase">
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
                  <th
                    key={i}
                    className="px-4 py-3 border-b border-gray-600 text-left"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-700 text-sm">
              {ClassBookingRequestData.map((item, index) => {
                const applicant = item.applicantData || item;
                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-300 hover:bg-gray-100 transition"
                  >
                    {/* Request Number */}
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

                    {/* Booker Info */}
                    <td className="px-4 py-3 font-medium">
                      <TrainerBookingRequestUserBasicInfo
                        email={applicant?.applicantEmail}
                      />
                    </td>

                    {/* Class Name */}
                    <td className="py-3 px-4">{item.classesName}</td>

                    {/* Class Duration */}
                    <td className="py-3 px-4 capitalize">{item.duration}</td>

                    {/* Class Price */}
                    <td className="py-3 px-4 font-semibold">
                      ${parseFloat(item.totalPrice).toFixed(2)}
                    </td>

                    {/* Class Requested Date */}
                    <td className="py-3 px-4">{item.submittedDate}</td>

                    {/* Class Applicant Number */}
                    <td className="py-3 px-4">
                      {applicant?.applicantPhone || applicant?.phone}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow transition-transform hover:scale-105"
                        title="View Details"
                        onClick={() => console.log("View clicked", item)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassRequest;
