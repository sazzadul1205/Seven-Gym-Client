import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../Shared/Loading/Loading";
import Background from "../../assets/Background.jpeg";

// Function to fetch the images (with pagination)
const getImages = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `http://localhost:5000/Gallery?limit=12&offset=${pageParam}`
  );
  if (!res.ok) {
    throw new Error(`Error fetching images: ${res.statusText}`);
  }
  const data = await res.json();
  return {
    images: data,
    prevOffset: pageParam,
  };
};

const Gallery = () => {
  // Infinite Query to fetch paginated images
  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["GalleryData"],
      queryFn: getImages,
      getNextPageParam: (lastPage) => {
        // If there are more images, fetch the next set of data
        if (lastPage.prevOffset + 20 < lastPage.images.length) {
          return lastPage.prevOffset + 20;
        }
        return false;
      },
    });

  // Loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Flatten the images data from paginated results
  const images = data?.pages.flatMap((page) => page.images);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Title */}
      <div className="pt-28 text-center">
        <p className="text-3xl font-bold text-black">Our Gallery</p>
        <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
      </div>

      {/* Infinite Scroll Gallery */}
      <InfiniteScroll
        dataLength={images ? images.length : 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Loading />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 md:p-6">
          {images &&
            images.map((item, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Gallery;
