import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const CommunityAuthorAvatar = ({ post }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey:
      post?.authorRole === "Trainer"
        ? ["TrainerBasicInfo", post?.authorId]
        : post?.authorRole === "Member"
        ? ["UserBasicProfile", post?.authorEmail]
        : ["InvalidAuthor", post?._id],
    queryFn: async () => {
      if (post?.authorRole === "Trainer" && post?.authorId) {
        const res = await axiosPublic.get(
          `/Trainers/BasicInfo?id=${post?.authorId}`
        );
        return res.data;
      } else if (post?.authorRole === "Member" && post?.authorEmail) {
        const res = await axiosPublic.get(
          `/Users/BasicProfile?email=${post?.authorEmail}`
        );
        return res.data;
      } else {
        return null;
      }
    },
    enabled:
      (post?.authorRole === "Trainer" && !!post?.authorId) ||
      (post?.authorRole === "Member" && !!post?.authorEmail),
  });

  const authorImg =
    profileData?.imageUrl ||
    profileData?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      post?.authorName
    )}&background=random&size=64`;

  if (isLoading) {
    return <p className="text-gray-600">Loading ...</p>;
  }

  if (isError) {
    return <p>{post?.authorName}</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={authorImg}
        alt={post?.authorName}
        className="w-12 h-12 rounded-full"
      />
      {/* Poster Name & Role */}
      <div>
        {/* Name */}
        <h4 className=" font-semibold text-gray-800">
          {post?.authorName}
        </h4>
        {/* Role */}
        <p className="text-sm text-gray-500">{post?.authorRole}</p>
      </div>
    </div>
  );
};

CommunityAuthorAvatar.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    authorId: PropTypes.string,
    authorEmail: PropTypes.string,
    authorName: PropTypes.string.isRequired,
    authorRole: PropTypes.oneOf(["Trainer", "Member"]).isRequired,
  }).isRequired,
};

export default CommunityAuthorAvatar;
