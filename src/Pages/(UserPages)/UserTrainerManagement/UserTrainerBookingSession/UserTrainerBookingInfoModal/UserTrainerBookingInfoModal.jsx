/* eslint-disable react/prop-types */

// import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdFemale, IoMdMale } from "react-icons/io";

// Get Tier Badge
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };

  return tierStyles[tier] || "bg-gray-200 text-gray-700 ring-2 ring-gray-300";
};

//  Get Gender Icon
const getGenderIcon = (gender) => {
  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 text-3xl font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 text-3xl font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl font-bold" />,
      label: "Other",
    },
  };

  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl" />,
      label: "Not specified",
    }
  );
};

const UserTrainerBookingInfoModal = ({ selectedBooking }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Data
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerData", selectedBooking?.trainer],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers?name=${selectedBooking?.trainer}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.trainer,
  });

  // Unpack trainer data
  const SelectedTrainerData = TrainerData?.[0] || {};
  const { icon } = getGenderIcon(SelectedTrainerData?.gender);

  // Use selectedBooking.sessions directly
  const sessionQuery =
    selectedBooking?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: ["ScheduleByIDData", selectedBooking?.sessions],
    enabled: !!selectedBooking?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Load management
  if (TrainerDataIsLoading || ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (TrainerDataError || ScheduleByIDDataError) return <FetchingError />;

  return (
    <div className="modal-box min-w-5xl p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("User_Trainer_Booking_Info_Modal")?.close()
          }
        />
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center gap-5 px-6 py-4">
        {/* Profile Image */}
        <img
          src={SelectedTrainerData?.imageUrl || "/default-profile.png"}
          alt={SelectedTrainerData?.name || "Trainer"}
          className="w-32 h-32 rounded-full shadow-md object-cover"
          loading="lazy"
        />

        {/* Name, Specialization, Badge */}
        <div className="space-y-2">
          {/* Name and Gender */}
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-bold">
              {SelectedTrainerData?.name || "Unknown Trainer"}
            </p>
            {icon}
          </div>

          {/* Specialization */}
          <p className="text-lg font-medium italic">
            {SelectedTrainerData?.specialization ||
              "Specialization Not Available"}
          </p>

          {/* Tier Badge */}
          {SelectedTrainerData?.tier && (
            <span
              className={`inline-block px-6 py-1 rounded-full text-sm font-semibold ${getTierBadge(
                SelectedTrainerData?.tier
              )}`}
            >
              {SelectedTrainerData?.tier} Tier
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTrainerBookingInfoModal;
