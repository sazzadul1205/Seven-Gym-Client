import { Link } from "react-router";

import { useQuery } from "@tanstack/react-query";

import Classes_Background from "../../../../assets/Classes-Background/Classes_Background.jpg";

import AllClasses from "./AllClasses/AllClasses";
import Title from "../../../../Shared/Component/Title";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

const Classes = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching data for Our_Classes
  const {
    data: Our_ClassesData,
    isLoading: Our_ClassesDataIsLoading,
    error: Our_ClassesDataError,
  } = useQuery({
    queryKey: ["Our_ClassesData"],
    queryFn: () =>
      axiosPublic.get(`/Our_Classes_Schedule`).then((res) => res.data),
  });

  // Fetching data for Our_Classes_Module
  const {
    data: Our_Classes_ModuleData,
    isLoading: Our_Classes_ModuleDataIsLoading,
    error: Our_Classes_ModuleDataError,
  } = useQuery({
    queryKey: ["Our_Classes_ModuleData"],
    queryFn: () =>
      axiosPublic.get(`/Our_Classes_Schedule/modules`).then((res) => res.data),
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
    return <FetchingError />;
  }

  return (
    <div
      className=" bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Classes_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-500/20">
        {/* Class Modules Section */}
        <section className="max-w-7xl mx-auto pt-0 md:pt-10">
          {/* Section Title */}
          <div className="mb-6 px-6">
            <Title titleContent="Our Class Modules" />
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 lg:gap-2 px-0 md:px-5">
            {Our_Classes_ModuleData.map((module, index) => {
              // Find matching class details
              const classDetail = Class_DetailsData.find(
                (classItem) => classItem.module === module
              );

              return (
                <div
                  key={index}
                  className="relative border-2 border-blue-500 bg-white hover:bg-gray-300 text-black px-6 py-3 rounded-lg group transition-all duration-300"
                >
                  <Link to={`/Classes/${module}`}>
                    {/* Display Module Icon (if available) */}
                    {classDetail?.icon && (
                      <img
                        src={classDetail.icon}
                        alt={module}
                        className="w-16 h-16 mx-auto mb-2"
                      />
                    )}

                    {/* Module Name */}
                    <div className="text-center text-sm font-semibold">
                      {module}
                    </div>

                    {/* "Join Now" Hover Effect */}
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-bold text-lg">
                        Join Now
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pass the other data to the AllClasses component */}
        <AllClasses
          OurClasses={Our_ClassesData}
          ClassDetails={Class_DetailsData}
        ></AllClasses>
      </div>
    </div>
  );
};

export default Classes;
