import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Classes_Background from "../../../../assets/Classes-Background/Classes_Background.jpg";

import AllClasses from "./AllClasses/AllClasses";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

const Classes = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: Our_ClassesData,
    isLoading: Our_ClassesDataIsLoading,
    error: Our_ClassesDataError,
  } = useQuery({
    queryKey: ["Our_ClassesData"],
    queryFn: () =>
      axiosPublic.get("/Our_Classes_Schedule").then((res) => res.data),
  });

  const {
    data: Our_Classes_ModuleData,
    isLoading: Our_Classes_ModuleDataIsLoading,
    error: Our_Classes_ModuleDataError,
  } = useQuery({
    queryKey: ["Our_Classes_ModuleData"],
    queryFn: () =>
      axiosPublic.get("/Our_Classes_Schedule/modules").then((res) => res.data),
  });

  const {
    data: Class_DetailsData,
    isLoading: Class_DetailsDataIsLoading,
    error: Class_DetailsDataError,
  } = useQuery({
    queryKey: ["Class_DetailsData"],
    queryFn: () => axiosPublic.get("/Class_Details").then((res) => res.data),
  });

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
      className="bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Classes_Background})`,
      }}
    >
      <div className="bg-gradient-to-b from-gray-700/80 to-black/90 py-10 px-1 md:px-4">
        <section className="max-w-7xl mx-auto">
          {/* Title */}
          <h2 className="text-white text-3xl font-bold mb-2 text-center">
            Explore Our Classes
          </h2>

          {/* Class Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Our_Classes_ModuleData.map((module, index) => {
              const classDetail = Class_DetailsData.find(
                (item) => item.module === module
              );

              return (
                <Link to={`/Classes/${module}`} key={index}>
                  <div className="relative border border-blue-400 bg-white hover:bg-blue-100 shadow-md rounded-lg p-4 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 group">
                    {classDetail?.icon && (
                      <img
                        src={classDetail.icon}
                        alt={module}
                        className="w-14 h-14 mb-2 object-contain"
                      />
                    )}
                    <span className="font-medium text-sm text-gray-700">
                      {module}
                    </span>

                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-semibold text-base">
                        Join Now
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Classes Section */}
        <section className="mt-12">
          <AllClasses
            OurClasses={Our_ClassesData}
            ClassDetails={Class_DetailsData}
          />
        </section>
      </div>
    </div>
  );
};

export default Classes;
