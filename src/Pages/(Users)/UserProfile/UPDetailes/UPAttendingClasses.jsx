/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { Link } from "react-router"; // Correcting the import for Link
import groupClass from "../../../../assets/group-class.png";

const UPAttendingClasses = ({ usersData }) => {
  const axiosPublic = useAxiosPublic();

  // Extract class names from usersData.attendingClasses
  const classesName =
    usersData?.attendingClasses?.map((classItem) => classItem.className) || [];

  // Fetch detailed data for classes by their names
  const {
    data: ClassesData,
    isLoading: ClassesDataIsLoading,
    error: ClassesDataError,
  } = useQuery({
    queryKey: ["ClassesData", classesName],
    queryFn: () =>
      axiosPublic
        .get(`/Class_Details/multi?modules=${classesName.join(",")}`)
        .then((res) => res.data),
    enabled: classesName.length > 0, // Prevent fetching if classesName are empty
  });

  // Handle loading state
  if (ClassesDataIsLoading) {
    return <Loading />;
  }

  // Handle error state
  if (ClassesDataError) {
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

  // Check if ClassesData is available and map it correctly
  if (!ClassesData || ClassesData.length === 0) {
    return (
      <>
        <div className="flex items-center space-x-2 border-b pb-2">
          <img src={groupClass} alt="groupClass Icon" className="w-5 h-5" />
          <h2 className="text-xl font-semibold text-black ">
            Current Attending Classes
          </h2>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">No classes available at the moment.</p>
          <Link
            to="/Classes" // Assuming you have a join class page
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Join a Class
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4 mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={groupClass} alt="groupClass Icon" className="w-5 h-5" />
        <h2 className="text-xl font-semibold text-black ">
          Current Attending Classes
        </h2>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ClassesData.map((classDetail, index) => (
          <div
            key={index}
            className="relative border-2 border-blue-500 bg-white hover:bg-gray-300 text-black px-6 py-3 rounded-lg group"
          >
            {/* Image */}
            <Link to={`/Classes/${classDetail.module}`}>
              {classDetail?.icon && (
                <img
                  src={classDetail.icon}
                  alt={classDetail.module}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}

              {/* Module Name */}
              <div className="text-center text-sm">{classDetail.module}</div>

              {/* Join Now Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-lg">Join Now</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UPAttendingClasses;
