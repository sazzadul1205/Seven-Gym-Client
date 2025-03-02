import { useQuery } from "@tanstack/react-query";
import Background from "../../assets/Background.jpeg";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Title from "../../Shared/Componenet/Title";
import Loading from "../../Shared/Loading/Loading";



const Testimonials = () => {
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
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
      }}
      className="bg-fixed bg-cover bg-center min-h-screen"
    >
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      <div className="container mx-auto px-4 text-center pt-5">
        <Title titleContent={" Testimonials"} />
        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
          {TestimonialsData.map((testimonial) => (
            <div
              key={testimonial._id}
              className="card bg-white shadow-xl hover:scale-105 transition-all transform"
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
  );
};

export default Testimonials;
