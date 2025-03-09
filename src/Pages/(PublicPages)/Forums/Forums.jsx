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

const Forums = () => {
  const axiosPublic = useAxiosPublic();

  // State management for search, category filter, and visible thread count
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleThreadsCount, setVisibleThreadsCount] = useState(7);

  // Fetch forum threads
  const {
    data: forumsData,
    isLoading: forumsLoading,
    error: forumsError,
  } = useQuery({
    queryKey: ["ForumsData"],
    queryFn: () => axiosPublic.get(`/Forums`).then((res) => res.data),
  });

  // Fetch forum categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["ForumsCategories"],
    queryFn: () =>
      axiosPublic.get(`/Forums/categories`).then((res) => res.data),
  });

  // Show loading component while fetching data
  if (forumsLoading || categoriesLoading) return <Loading />;

  // Show error component if fetching fails
  if (forumsError || categoriesError) return <FetchingError />;

  // Sort forum threads by most recent
  const sortedForumsData = forumsData
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter threads based on search query and selected category
  const filteredThreads = sortedForumsData?.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || thread.category === selectedCategory)
  );

  // Get top 5 threads based on engagement (comments & likes)
  const topThreads = forumsData
    ?.slice()
    .sort((a, b) => b.comments.length - a.comments.length || b.likes - a.likes)
    .slice(0, 5);

  // Limit the number of displayed threads
  const threadsToDisplay = filteredThreads?.slice(0, visibleThreadsCount);

  return (
    <div>
      {/* Forum Banner with search functionality */}
      <ForumBanner
        Wall={Wall}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main forum content */}
      <div
        className="bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${Forums_Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-gradient-to-b from-gray-500/50 to-gray-500/20">
          {/* Forum Categories Section */}
          <ForumCategory
            Categories={categories}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* Forum Threads Section */}
          <ForumThreads
            threadsToDisplay={threadsToDisplay}
            filteredThreads={filteredThreads}
            visibleThreadsCount={visibleThreadsCount}
            setVisibleThreadsCount={setVisibleThreadsCount}
            topThreads={topThreads}
          />
        </div>
      </div>
    </div>
  );
};

export default Forums;
