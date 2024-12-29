import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../../Shared/Loading/Loading";
import Background from "../../../assets/Background.jpeg";

// Function to fetch the images (with pagination)
const getImages = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `http://localhost:5000/Gallery?limit=20&offset=${pageParam}`
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
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["GalleryImages"],
    queryFn: getImages,
    getNextPageParam: (lastPage) => {
      // Ensure `lastPage` and `lastPage.images` exist before checking length
      if (lastPage.prevOffset + 20 > lastPage.images.length) {
        return false;
      }
      return lastPage.prevOffset + 20;
    },
  });

  // Loading and error states
  if (isLoading) {
    return <Loading />;
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
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      {/* Title */}
      <div className="py-5 text-center">
        <p className="text-3xl font-bold text-black">Our Gallery</p>
        <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
      </div>

      {/* Infinite Scroll Gallery */}
      <InfiniteScroll
        dataLength={images ? images?.length : 0}
        next={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={<Loading />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 md:p-6">
          {images &&
            images.map((item, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={item?.url}
                  alt={item?.alt}
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
