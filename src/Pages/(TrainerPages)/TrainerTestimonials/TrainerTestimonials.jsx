// import Prop Validation
import PropTypes from "prop-types";

// Import Icons
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// TrainerTestimonials component receives TrainerData prop (array of trainers with testimonials)
const TrainerTestimonials = ({ TrainerData = [] }) => {
  // Extract testimonials or default to empty array
  const TrainerTestimonialsData = TrainerData?.[0]?.testimonials || [];

  // Boolean check to show fallback if no testimonials
  const hasTestimonials = TrainerTestimonialsData.length > 0;

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Section heading */}
      <div className="text-center py-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Testimonials
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Hear what your clients have to say
        </p>
      </div>

      {/* Decorative divider line */}
      <div className="mx-auto bg-white w-1/3 h-[1px] mb-10" />

      {/* Testimonials grid or fallback message */}
      {hasTestimonials ? (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {TrainerTestimonialsData.map((t, i) => (
            <div
              key={i}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              {/* Avatar and client info */}
              <div className="flex items-center mb-4">
                <img
                  src={
                    t.clientAvatar || // Use avatar if available, otherwise fallback to generated avatar
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      t.clientName
                    )}&background=0D8ABC&color=fff&rounded=true`
                  }
                  alt={t.clientName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-indigo-200 object-cover"
                />

                {/* clientName & email */}
                <div className="ml-3 sm:ml-4">
                  {/* clientName */}
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {t.clientName}
                  </p>
                  {/* email */}
                  <p className="text-xs sm:text-sm text-gray-500">{t.email}</p>
                </div>
              </div>

              {/* Star rating visual */}
              {renderStars(t.rating)}

              {/* Testimonial message */}
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 italic leading-relaxed">
                “{t.testimonial}”
              </p>
            </div>
          ))}
        </div>
      ) : (
        // Fallback UI when no testimonials are available
        <div className="text-center mt-20 text-gray-700">
          <p className="text-xl font-medium">
            No testimonials available at the moment.
          </p>
          <p className="text-sm mt-2 text-gray-600">
            Check back later for client feedback.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainerTestimonials;

// Utility function to render full, half, and empty stars based on rating value
const renderStars = (rating = 0) => {
  // Full stars
  const full = Math.floor(rating);
  // Half star if remainder >= 0.5
  const half = rating % 1 >= 0.5;
  // Remaining empty stars to make total 5
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-500 mt-2">
      {[...Array(full)].map((_, i) => (
        <FaStar key={`full-${i}`} /> // Render full stars
      ))}
      {half && <FaStarHalfAlt />}
      {[...Array(empty)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} /> // Render empty stars
      ))}
    </div>
  );
};

// PropTypes ensure valid prop structure is passed to component
TrainerTestimonials.propTypes = {
  TrainerData: PropTypes.arrayOf(
    PropTypes.shape({
      testimonials: PropTypes.arrayOf(
        PropTypes.shape({
          clientName: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          testimonial: PropTypes.string.isRequired,
          rating: PropTypes.number.isRequired,
          clientAvatar: PropTypes.string,
        })
      ),
    })
  ),
};
