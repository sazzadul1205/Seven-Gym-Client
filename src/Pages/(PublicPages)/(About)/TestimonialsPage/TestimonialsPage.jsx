import { useQuery } from "@tanstack/react-query";

import Title from "../../../../Shared/Component/Title";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";
import Background from "../../../../assets/Home-Background/Home-Background.jpeg";

const TestimonialsPage = () => {
  const axiosPublic = useAxiosPublic();
  // Fetching Testimonials Data
  const {
    data: TestimonialsData,
    isLoading: TestimonialsDataIsLoading,
    error: TestimonialsDataError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });
  // Loading and error states (render below hooks)
  if (TestimonialsDataIsLoading) {
    return <Loading />;
  }

  if (TestimonialsDataError) {
    return <FetchingError />;
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-linear-to-b from-black/50 to-black/20">
        {/* Header */}

        <div className="mx-auto max-w-7xl  pt-5">
          <Title titleContent={" Testimonials"} />
          {/* Testimonials Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-10">
            {TestimonialsData.map((testimonial) => (
              <div
                key={testimonial._id}
                className="card bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-400 shadow-xl hover:scale-105 transition-all transform"
              >
                <figure>
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto mt-4"
                  />
                </figure>
                <div className="card-body text-center p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-md text-gray-600">{testimonial.role}</p>
                  <p className="text-lg italic text-gray-700 mt-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
