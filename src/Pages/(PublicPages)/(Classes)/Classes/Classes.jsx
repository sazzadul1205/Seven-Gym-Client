import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Background from "../../../../assets/Background.jpeg";
import Banner from "../../../../assets/ClassesWall.jpg";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";
import Title from "../../../../Shared/Component/Title";
import AllClasses from "./AllClasses/AllClasses";

const Classes = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching data for Our_Classes
  const {
    data: Our_ClassesData,
    isLoading: Our_ClassesDataIsLoading,
    error: Our_ClassesDataError,
  } = useQuery({
    queryKey: ["Our_ClassesData"],
    queryFn: () => axiosPublic.get(`/Our_Classes`).then((res) => res.data),
  });

  // Fetching data for Our_Classes_Module
  const {
    data: Our_Classes_ModuleData,
    isLoading: Our_Classes_ModuleDataIsLoading,
    error: Our_Classes_ModuleDataError,
  } = useQuery({
    queryKey: ["Our_Classes_ModuleData"],
    queryFn: () =>
      axiosPublic.get(`/Our_Classes/modules`).then((res) => res.data),
  });

  // Fetching data for Class_Details
  const {
    data: Class_DetailsData,
    isLoading: Class_DetailsDataIsLoading,
    error: Class_DetailsDataError,
  } = useQuery({
    queryKey: ["Class_DetailsData"],
    queryFn: () => axiosPublic.get(`/Class_Details`).then((res) => res.data),
  });

  // Handle loading and error states
  if (
    Our_ClassesDataIsLoading ||
    Class_DetailsDataIsLoading ||
    Our_Classes_ModuleDataIsLoading
  ) {
    return <Loading />;
  }

  if (
    Our_ClassesDataError ||
    Class_DetailsDataError ||
    Our_Classes_ModuleDataError
  ) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
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

  return (
    <div
      className="pb-16"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#F72C5B] py-11"></div>

      {/* Banner */}
      <div className="relative">
        {/* Banner Image */}
        <img
          src={Banner}
          alt={Banner}
          className="w-full h-[250px] md:h-[300px] lg:h-[450px] object-cover"
        />

        {/* Classes at the bottom */}
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-white">
          <h3 className="text-lg sm:text-2xl font-bold text-center bg-[#F72C5B] px-10 sm:px-24 rounded-full">
            Classes
          </h3>
        </div>
      </div>

      {/* Module Section */}
      <div className="pt-10">
        <div className="mb-6 px-6">
          <Title titleContent={"Our Class Modules"} />
        </div>
        <div className="justify-center gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 px-5 max-w-[1200px] mx-auto">
          {Our_Classes_ModuleData.map((module, index) => {
            const classDetail = Class_DetailsData.find(
              (classItem) => classItem.module === module
            ); // Find the matching class detail for the module

            return (
              <div
                key={index}
                className="relative border-2 border-blue-500 bg-white hover:bg-gray-300 text-black px-6 py-3 rounded-lg group"
              >
                {/* Image */}
                <Link to={`/Classes/${module}`}>
                  {classDetail?.icon && (
                    <img
                      src={classDetail.icon}
                      alt={module}
                      className="w-16 h-16 mx-auto mb-2"
                    />
                  )}

                  {/* Module Name */}
                  <div className="text-center text-sm">{module}</div>

                  {/* Join Now Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold text-lg">
                      Join Now
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pass the other data to the AllClasses component */}
      <AllClasses
        OurClasses={Our_ClassesData}
        ClassDetails={Class_DetailsData}
      ></AllClasses>
    </div>
  );
};

export default Classes;
