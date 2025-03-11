import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Background images for styling
import Wall from "../../../assets/ForumWall.jpg";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";

// Shared components for loading and error states
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Custom hooks for API calls and authentication
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Forum components for banner, threads list, and category filter
import ForumBanner from "./ForumBanner/ForumBanner";
import ForumThreads from "./ForumThreads/ForumThreads";
import ForumCategory from "./ForumCategory/ForumCategory";

const Forums = () => {
  // Get axios instance for public API requests and authenticated user info.
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Local state to manage search input, selected category, and the count of visible threads.
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleThreadsCount, setVisibleThreadsCount] = useState(7);

  // Fetch forums data 
  const {
    data: forumsData,
    isLoading: forumsLoading,
    error: forumsError,
    refetch,
  } = useQuery({
    queryKey: ["ForumsData"],
    queryFn: () => axiosPublic.get(`/Forums`).then((res) => res.data),
  });

  // Fetch current user's data based on email.
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  // Fetch available forum categories.
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["ForumsCategories"],
    queryFn: () =>
      axiosPublic.get(`/Forums/categories`).then((res) => res.data),
  });

  // If any query is still loading, show the Loading component.
  if (forumsLoading || categoriesLoading || UsersLoading) return <Loading />;
  // If any error occurs during the queries, show the error component.
  if (forumsError || categoriesError || UsersError) return <FetchingError />;

  return (
    <div>
      {/* Forum Banner displays a background image and search bar */}
      <ForumBanner
        Wall={Wall}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Forum section with fixed background image styling */}
      <div
        className="bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${Forums_Background})` }}
      >
        {/* Overlay gradient to enhance text readability */}
        <div className="bg-gradient-to-b from-gray-500/50 to-gray-500/20">
          {/* ForumCategory component allows filtering by category */}
          <ForumCategory
            Categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* ForumThreads displays the list of threads with filtering and pagination */}
          <ForumThreads
            refetch={refetch}
            UsersData={UsersData}
            forumsData={forumsData} 
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
