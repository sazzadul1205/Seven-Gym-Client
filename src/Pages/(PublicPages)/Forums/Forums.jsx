import { useState, useMemo } from "react";
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
    refetch: forumRefetch,
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

  // Memoize sorted forum threads
  const sortedForumsData = useMemo(() => {
    return forumsData
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [forumsData]);

  // Memoize filtered threads
  const filteredThreads = useMemo(() => {
    return sortedForumsData?.filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "All" || thread.category === selectedCategory)
    );
  }, [sortedForumsData, searchQuery, selectedCategory]);

  // Memoize top threads
  const topThreads = useMemo(() => {
    return forumsData
      ?.slice()
      .sort(
        (a, b) => b.comments.length - a.comments.length || b.likes - a.likes
      )
      .slice(0, 5);
  }, [forumsData]);

  // Get threads to display
  const threadsToDisplay = filteredThreads?.slice(0, visibleThreadsCount);

  // Early return for loading/error states
  if (forumsLoading || categoriesLoading) return <Loading />;
  if (forumsError || categoriesError) return <FetchingError />;

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
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Forum Threads Section */}
          <ForumThreads
            topThreads={topThreads}
            forumRefetch={forumRefetch}
            filteredThreads={filteredThreads}
            threadsToDisplay={threadsToDisplay}
            visibleThreadsCount={visibleThreadsCount}
            setVisibleThreadsCount={setVisibleThreadsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Forums;
