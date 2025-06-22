import React from "react";

const UserClassCompletedCard = ({ item, setSelectedAcceptedData }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: ClassData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ClassData", item?.applicant?.classesName],
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${item?.applicant?.classesName}`)
        .then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  const className = item?.applicant?.classesName;
  const duration = item?.applicant?.duration;
  const price = item?.applicant?.totalPrice;
  const submittedDate = item?.applicant?.submittedDate;
  const isPaid = item?.paid;
  const endDate = item?.endDate;

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-5">
      {/* Final Badge: Shows Ended / End At if endDate exists, otherwise PAID/UNPAID */}
      <div
        className={`absolute -top-4 -right-4 px-6 py-2 rounded-full shadow text-white text-xs font-bold select-none ${
          endDate
            ? parseCustomDate(endDate) < new Date()
              ? "bg-gradient-to-bl from-gray-400 to-gray-700"
              : "bg-gradient-to-bl from-indigo-300 to-indigo-600"
            : isPaid
            ? "bg-gradient-to-bl from-green-300 to-green-600"
            : "bg-gradient-to-bl from-red-300 to-red-600"
        }`}
      >
        {endDate
          ? parseCustomDate(endDate) < new Date()
            ? "Ended"
            : `End At ${parseCustomDate(endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`
          : isPaid
          ? "PAID"
          : "UNPAID"}
      </div>

      <div className="flex gap-4 items-center">
        {/* Class Icon */}
        <div className="w-20 h-20 rounded-xl overflow-hidden border shadow-inner">
          <img
            src={ClassData?.icon}
            alt={className}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Class Info */}
        <div className="flex-1 space-y-1">
          {/* Class Name */}
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
            <FaDumbbell />
            <span>{className}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaClock className="text-blue-500" />
            <span className="capitalize">{duration}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaDollarSign className="text-green-600" />
            <span>${parseFloat(price).toFixed(2)}</span>
          </div>

          {/* Submitted date */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaCalendarAlt className="text-purple-500" />
            <span>{formatDateTimeTooltip(submittedDate)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-between gap-2">
          {/* Card Button */}
          {!item.paid && (
            <>
              <button
                id={`payment-applicant-btn-${item._id}`}
                className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                onClick={() => {
                  setSelectedAcceptedData(item);
                  document
                    .getElementById("Class_Accepted_Payment_Details_Modal")
                    .showModal();
                }}
              >
                <IoCardSharp className="text-blue-500" />
              </button>
              <Tooltip
                anchorSelect={`#payment-applicant-btn-${item._id}`}
                className="!z-[9999]"
                content="Payment Applicant"
              />
            </>
          )}

          {/* Details icon */}
          <>
            <button
              id={`details-applicant-btn-${item._id}`}
              className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => {
                document
                  .getElementById("Class_Accepted_Details_Modal")
                  .showModal();
                setSelectedAcceptedData(item);
              }}
            >
              <FaInfo className="text-yellow-500" />
            </button>
            <Tooltip
              anchorSelect={`#details-applicant-btn-${item._id}`}
              className="!z-[9999]"
              content="Details Accepted Data"
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default UserClassCompletedCard;
