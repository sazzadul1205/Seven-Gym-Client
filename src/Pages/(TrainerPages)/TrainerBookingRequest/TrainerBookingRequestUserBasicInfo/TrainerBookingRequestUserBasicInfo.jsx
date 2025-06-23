import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const TrainerBookingRequestUserBasicInfo = ({
  email,
  renderLoading,
  renderError,
  renderUserInfo,
}) => {
  const axiosPublic = useAxiosPublic();

  // Validate the email: must be a non-empty, valid string, not "undefined" or "N/A"
  const isValidEmail =
    typeof email === "string" &&
    email.trim() !== "" &&
    email !== "undefined" &&
    email !== "N/A";

  // Fetch user basic info with React Query; only run if email is valid
  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${email}`)
        .then((res) => res.data),
    enabled: isValidEmail, // skip query if email invalid
  });

  // Show loading state; use custom loader if provided
  if (isLoading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <span className="text-xs text-gray-500">Loading...</span>
    );
  }

  // Show error state or fallback if data not found; use custom error renderer if provided
  if (error || !data) {
    return renderError ? (
      renderError(error)
    ) : (
      <span className="text-xs">{email}</span>
    );
  }

  // If custom render function for user info is provided, use it
  if (renderUserInfo) return renderUserInfo(data);

  // Default UI: display user avatar and name with email
  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div className="border-r-2 pr-2 border-black">
        <img
          src={data.profileImage}
          alt={data.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>

      {/* Name + Email */}
      <div>
        <span className="font-medium block leading-tight">{data.fullName}</span>
        <span className="text-xs ">{email}</span>
      </div>
    </div>
  );
};

// Prop validation for component props
TrainerBookingRequestUserBasicInfo.propTypes = {
  email: PropTypes.string,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func,
  renderUserInfo: PropTypes.func,
};

export default TrainerBookingRequestUserBasicInfo;
