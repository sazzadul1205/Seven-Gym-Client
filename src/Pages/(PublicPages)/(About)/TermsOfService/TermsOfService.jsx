// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Shared
import FetchingError from "../../../../Shared/Component/FetchingError";
import Loading from "../../../../Shared/Loading/Loading";

const TermsOfService = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch mission data
  const {
    data: TermsOfServices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["TermsOfServices"],
    queryFn: () => axiosPublic.get(`/Terms_Of_Service`).then((res) => res.data),
  });

  // Error and Loading
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${TermsOfServices?.background})` }}
    >
      <div className=" bg-white/80 text-gray-800">
        <div className="max-w-5xl mx-auto py-5">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-center">
            {TermsOfServices.title}
          </h1>
          {/* Lat Update */}
          <p className="text-sm text-gray-500 text-center mb-10">
            Last updated: {TermsOfServices.updatedDate}
          </p>

          {/* Terms Of Service */}
          {TermsOfServices.sections.map((section, index) => (
            <section key={index} className="mb-8">
              {/* Title */}
              <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>

              {/* Content */}
              {Array.isArray(section.content) ? (
                <ul className="list-disc pl-5 space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
