import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import Background from "../../../assets/Background.jpeg";
import Wall from "../../../assets/ForumWall.jpg";
import ViewDetails from "./ViewDetails/ViewDetails";

import "swiper/swiper-bundle.css";

// Utility function to calculate time ago
const timeAgo = (timestamp) => {
  const now = new Date();
  const timeDiff = now - new Date(timestamp); // Difference in milliseconds
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};

const Forums = () => {
  const axiosPublic = useAxiosPublic();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleThreadsCount, setVisibleThreadsCount] = useState(7);
  const [selectedThread, setSelectedThread] = useState(null);

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
    console.error("Error fetching data:", ForumsError || CategoriesError);
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          {ForumsError
            ? "Failed to load forum threads."
            : "Failed to load categories."}
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
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
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      {/* Banner */}
      <div className="relative">
        <img
          src={Wall}
          alt="Forum Banner"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-3xl font-bold text-white">Search Thread</p>
          <div className="flex md:w-2/3 max-w-xl">
            <input
              type="text"
              placeholder="Search threads by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 border bg-white shadow-lg rounded-l-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-green-500 hover:bg-green-400 p-4 rounded-r-lg">
              <FaSearch className="text-xl text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
        }}
        className="bg-fixed bg-cover bg-center pb-5 min-h-screen"
      >
        {/* Category View */}
        <div className="pt-8 px-4 pb-5">
          {/* Mobile view */}
          <div className="flex md:hidden lg:hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView="2"
              className="flex" // Hide on larger screens
            >
              {["All", ...Categories]?.map((category, index) => (
                <SwiperSlide key={index}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`py-3  w-[150px] border-2 font-bold rounded-lg transition duration-300 text-sm ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Tablet view */}
          <div className="hidden md:flex lg:hidden">
            <Swiper
              spaceBetween={40}
              slidesPerView="5"
              className="flex" // Hide on larger screens
            >
              {["All", ...Categories]?.map((category, index) => (
                <SwiperSlide key={index}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`py-3  w-[150px] border-2 font-bold rounded-lg transition duration-300 text-sm ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop View */}
          <div className="hidden md:hidden lg:flex lg:flex-wrap lg:gap-4">
            {["All", ...Categories]?.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`py-3 px-4 w-[200px] border-2 font-bold rounded-lg transition duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:px-20">
          {/* Threads */}
          <div className="pt-8 pb-4 px-6 lg:w-4/5 bg-white">
            <h2 className="text-2xl font-bold pb-2 text-center lg:text-left italic">
              All Threads
            </h2>
            <div className="grid gap-4 pt-2">
              {threadsToDisplay?.length > 0 ? (
                threadsToDisplay.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThread(thread);
                      document.getElementById("Modal_View_Details").showModal();
                    }}
                    className="border p-4 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                  >
                    <h3 className="text-lg font-semibold">{thread.title}</h3>
                    <p className="text-gray-600">{thread.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Comments: {thread.comments?.length || 0} | Likes:{" "}
                      {thread.likes} | {timeAgo(thread.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No threads found.</p>
              )}
            </div>

            {/* Show More Button */}
            {filteredThreads?.length > visibleThreadsCount && (
              <div className="text-center pt-4 ">
                <button
                  onClick={() =>
                    setVisibleThreadsCount(visibleThreadsCount + 8)
                  }
                  className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
                >
                  Show More
                </button>
              </div>
            )}
          </div>

          {/* Top Threads */}
          <div className="pt-8 pb-4 px-6 lg:w-1/5 bg-white">
            <h2 className="text-2xl font-bold pb-2 text-center lg:text-left italic">
              Top Threads
            </h2>
            <div className="grid gap-4 pt-2">
              {topThreads?.length > 0 ? (
                topThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThread(thread);
                      document.getElementById("Modal_View_Details").showModal();
                    }}
                    className="border-2 border-green-300 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                  >
                    <h3 className="text-lg font-semibold">{thread.title}</h3>
                    <p className="text-gray-600">
                      {thread.description.split(" ").slice(0, 20).join(" ")}...
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                      Comments: {thread.comments?.length || 0} | Likes:{" "}
                      {thread.likes} | {timeAgo(thread.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No top threads found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <dialog id="Modal_View_Details" className="modal">
        <ViewDetails thread={selectedThread} />
      </dialog>
    </div>
  );
};

export default Forums;
