// Import custom Axios hook
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import React Query
import { useQuery } from "@tanstack/react-query";

// Import PropTypes for prop validation
import PropTypes from "prop-types";

const TrainerBookingRequestUserBasicInfo = ({ email }) => {
  // Initialize Axios instance
  const axiosPublic = useAxiosPublic();

  // Fetch user basic info using email
  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${email}`) 
        .then((res) => res.data),
    enabled: !!email, 
  });

  // Show loading state
  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;

  // Handle error or missing data
  if (error || !data) return <span className="text-xs">{email}</span>;

  // Render user profile image and name
  return (
    <div className="flex items-center gap-2">
      {/* Avatar section */}
      <div className="border-r-2 pr-2 border-black">
        <img
          src={data.profileImage}
          alt={data.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>

      {/* User full name */}
      <span className="font-medium">{data.fullName}</span>
    </div>
  );
};

// Define expected prop types
TrainerBookingRequestUserBasicInfo.propTypes = {
  email: PropTypes.string.isRequired,
};

export default TrainerBookingRequestUserBasicInfo;
