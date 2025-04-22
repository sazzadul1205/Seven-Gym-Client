// Import custom Axios hook
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import React Query
import { useQuery } from "@tanstack/react-query";

// Import PropTypes for prop validation
import PropTypes from "prop-types";

const UserProfileTrainerBasicInfo = ({ Id }) => {
  // Initialize Axios instance
  const axiosPublic = useAxiosPublic();

  // Fetch user basic info using Id
  const { data, isLoading, error } = useQuery({
    queryKey: ["Trainers", Id],
    queryFn: () =>
      axiosPublic.get(`/Trainers?id=${Id}`).then((res) => res.data),
    enabled: !!Id,
  });

  // Show loading state
  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;

  // Handle error or missing data
  if (error || !data) return <span className="text-xs">{Id}</span>;

  return (
    <div className="flex items-center gap-2">
      {/* Avatar section */}
      <div className="border-r-2 pr-2 border-black">
        <img
          src={data?.imageUrl}
          alt={data?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

// Define expected prop types
UserProfileTrainerBasicInfo.propTypes = {
  Id: PropTypes.string.isRequired,
};

export default UserProfileTrainerBasicInfo;
