// usePostAuthorImage.js
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const usePostAuthorImage = (selectedPost) => {
  const axiosPublic = useAxiosPublic();

  const { data: profileData } = useQuery({
    queryKey: [
      "PostAuthor",
      selectedPost?.authorId || selectedPost?.authorEmail,
    ],
    queryFn: async () => {
      if (selectedPost?.authorRole === "Trainer") {
        const res = await axiosPublic.get(
          `/Trainers/BasicInfo?id=${selectedPost.authorId}`
        );
        return res.data;
      } else if (selectedPost?.authorRole === "Member") {
        const res = await axiosPublic.get(
          `/Users/BasicProfile?email=${selectedPost.authorEmail}`
        );
        return res.data;
      }
      return null;
    },
    enabled: !!selectedPost?.authorRole, // More precise
  });

  const authorImage =
    profileData?.profileImage ||
    profileData?.imageUrl ||
    "https://via.placeholder.com/64";

  return authorImage;
};

export default usePostAuthorImage;
