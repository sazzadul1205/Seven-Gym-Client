import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

// Background import
import Wall from "../../../assets/ForumWall.jpg";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";

import ViewDetails from "./ViewDetails/ViewDetails";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";


import ForumBanner from "./ForumBanner/ForumBanner";
import ForumThreads from "./ForumThreads/ForumThreads";
import ForumCategory from "./ForumCategory/ForumCategory";

const Forums = () => {
  const axiosPublic = useAxiosPublic();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleThreadsCount, setVisibleThreadsCount] = useState(7);

  // Fetch data
  const {
    data: ForumsData,
    isLoading: ForumsLoading,
    error: ForumsError,
  } = useQuery({
    queryKey: ["ForumsData"],
    queryFn: () => axiosPublic.get(`/Forums`).then((res) => res.data),
  });

  const {
    data: Categories,
    isLoading: CategoriesLoading,
    error: CategoriesError,
  } = useQuery({
    queryKey: ["ForumsCategories"],
    queryFn: () =>
      axiosPublic.get(`/Forums/categories`).then((res) => res.data),
  });

  if (ForumsLoading || CategoriesLoading) return <Loading />;
  if (ForumsError || CategoriesError) {
    return <FetchingError />;
  }

  // Sort by most recent
  const sortedForumsData = ForumsData?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter threads
  const filteredThreads = sortedForumsData?.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || thread.category === selectedCategory)
  );

  const topThreads = ForumsData?.sort(
    (a, b) => b.comments.length - a.comments.length || b.likes - a.likes
  ).slice(0, 5);

  const threadsToDisplay = filteredThreads?.slice(0, visibleThreadsCount);

  return (
    <div>
      {/* Banner */}
      <ForumBanner
        Wall={Wall}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Content */}
      <div
        className="bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${Forums_Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-gradient-to-b from-gray-500/50 to-gray-500/20">
          {/* Category View */}
          <ForumCategory
            Categories={Categories}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* My Threads */}
          <ForumThreads
            threadsToDisplay={threadsToDisplay}
            setSelectedThread={setSelectedThread}
            filteredThreads={filteredThreads}
            visibleThreadsCount={visibleThreadsCount}
            setVisibleThreadsCount={setVisibleThreadsCount}
            topThreads={topThreads}
          />
        </div>
      </div>

      <dialog id="Modal_View_Details" className="modal">
        <ViewDetails thread={selectedThread} />
      </dialog>
    </div>
  );
};

export default Forums;
