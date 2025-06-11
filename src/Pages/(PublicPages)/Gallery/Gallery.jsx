import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";
import GalleryBackground from "../../../assets/Gallery-Background/Gallery-Background.jpg";
import { useState } from "react";

// Function to fetch images with pagination
const getImages = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `http://localhost:5000/Gallery?limit=20&offset=${pageParam}`
  );

  if (!res.ok) {
    // Handle error gracefully by throwing an error with a descriptive message
    throw new Error(`Error fetching images: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    images: data,
    prevOffset: pageParam,
  };
};

const Gallery = () => {
  // State to track the selected Image for the modal
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to open the modal and set the selected promotion
  const handleOpenModal = (item) => {
    setSelectedImage(item);
    document.getElementById("Image_Modal").showModal();
  };

  // Infinite Query to fetch paginated images
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["GalleryImages"],
      queryFn: getImages,
      getNextPageParam: (lastPage) => {
        // Ensure `lastPage` and `lastPage.images` exist before checking length
        if (lastPage.prevOffset + 20 >= lastPage.images.length) {
          return false; // No more pages to load
        }
        return lastPage.prevOffset + 20; // Return next offset for pagination
      },
    });

  // Loading and error states
  if (isLoading) {
    return <Loading />;
  }

  // Display an error message if there's an issue fetching the data
  if (isError) {
    return <FetchingError />;
  }

  // Flatten the images data from paginated results
  const images = data?.pages.flatMap((page) => page.images);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${GalleryBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/10">
        {/* Title */}
        <div className="py-5 text-center bg-gray-500/20 text-gray-700">
          <p className="text-4xl font-bold  ">Our Gallery</p>
          <div className="bg-gray-900 p-[2px] md:w-3/12 mx-auto mt-2"></div>
        </div>

        {/* Infinite Scroll Gallery */}
        <InfiniteScroll
          dataLength={images?.length || 0} // Ensure dataLength is defined
          next={fetchNextPage} // Use fetchNextPage directly
          hasMore={hasNextPage} // Check if more data is available
          loader={<Loading />} // Loader while fetching
          endMessage={<p>No more images to show.</p>} // Display a message when there are no more images
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-1 md:px-5 ">
            {images?.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => handleOpenModal(item)}
                className="relative group hover:border hover:border-white"
              >
                <img
                  src={item?.url}
                  alt={item?.alt || "Gallery Image"}
                  className="w-full h-full object-cover rounded-lg shadow-lg  hover:scale-105 transition-transform duration-300 "
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Modal */}
      <dialog id="Image_Modal" className="modal">
        <div className="modal-box md:w-[600px] md:h-[400px] p-0 border-2 border-white">
          <img
            src={selectedImage?.url}
            alt={selectedImage?.alt || "Gallery Image"}
            className="w-full h-full object-cover"
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Gallery;
