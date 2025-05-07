// Import Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Import Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

const BookedTrainerBasicInfo = ({ trainerID, showName = true, py = 0 }) => {
  const axiosPublic = useAxiosPublic();

  const { data, isLoading, error } = useQuery({
    queryKey: ["TrainerBasicData", trainerID],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?id=${trainerID}`)
        .then((res) => res.data),
    enabled: !!trainerID,
  });

  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;

  if (error || !data) return <span className="text-xs">{trainerID}</span>;

  return (
    <td>
      <div className={`flex items-center gap-2 py-${py}`}>
        <div className="border-r-2 pr-2 mr-5 border-black">
          <img
            src={data.imageUrl}
            alt={data.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        {showName && <span className="font-medium">{data.name}</span>}
      </div>
    </td>
  );
};

// ✅ Prop validation
BookedTrainerBasicInfo.propTypes = {
  trainerID: PropTypes.string.isRequired,
  showName: PropTypes.bool,
  py: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
};

export default BookedTrainerBasicInfo;
