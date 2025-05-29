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

  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${email}`)
        .then((res) => res.data),
    enabled: !!email,
  });

  if (isLoading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <span className="text-xs text-gray-500">Loading...</span>
    );
  }

  if (error || !data) {
    return renderError ? (
      renderError(error)
    ) : (
      <span className="text-xs">{email}</span>
    );
  }

  if (renderUserInfo) return renderUserInfo(data);

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

TrainerBookingRequestUserBasicInfo.propTypes = {
  email: PropTypes.string.isRequired,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func,
  renderUserInfo: PropTypes.func,
};

export default TrainerBookingRequestUserBasicInfo;
