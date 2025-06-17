// src/data/termsData.js

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

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

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${TermsOfServices?.background})` }}
    >
      <div className=" bg-white/80 text-gray-800">
        <div className="max-w-5xl mx-auto py-5">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {TermsOfServices.title}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-10">
            Last updated: {TermsOfServices.updatedDate}
          </p>

          {TermsOfServices.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>

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
