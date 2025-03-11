import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Background images
import Wall from "../../../assets/ForumWall.jpg";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";

// Shared components
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Custom hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Forum components
import ForumBanner from "./ForumBanner/ForumBanner";
import ForumThreads from "./ForumThreads/ForumThreads";
import ForumCategory from "./ForumCategory/ForumCategory";
import useAuth from "../../../Hooks/useAuth";

const Forums = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleThreadsCount, setVisibleThreadsCount] = useState(7);

  const {
    data: forumsData,
    isLoading: forumsLoading,
    error: forumsError,
    refetch,
  } = useQuery({
    queryKey: ["ForumsData"],
    queryFn: () => axiosPublic.get(`/Forums`).then((res) => res.data),
  });

  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["ForumsCategories"],
    queryFn: () =>
      axiosPublic.get(`/Forums/categories`).then((res) => res.data),
  });

  if (forumsLoading || categoriesLoading || UsersLoading) return <Loading />;
  if (forumsError || categoriesError || UsersError) return <FetchingError />;

  return (
    <div>
      <ForumBanner
        Wall={Wall}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div
        className="bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${Forums_Background})` }}
      >
        <div className="bg-gradient-to-b from-gray-500/50 to-gray-500/20">
          <ForumCategory
            Categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <ForumThreads
            refetch={refetch}
            UsersData={UsersData}
            forumsData={forumsData} // Pass raw forumsData
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            visibleThreadsCount={visibleThreadsCount}
            setVisibleThreadsCount={setVisibleThreadsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Forums;
