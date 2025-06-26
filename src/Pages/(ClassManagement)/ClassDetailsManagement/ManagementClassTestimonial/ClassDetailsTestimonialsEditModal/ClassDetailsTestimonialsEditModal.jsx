import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const ClassDetailsTestimonialsEditModal = ({ selectedClass }) => {
  const comments = selectedClass?.comments || [];

  const handleClose = () => {
    document.getElementById("Class_Testimonials_Edit_Modal")?.close();
  };

  return (
    <div
      id="Class_Testimonials_Edit_Modal"
      className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-300 text-black"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          {selectedClass?.module} Class Testimonials
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Body */}
      <div className="px-5 py-4 max-h-[65vh] overflow-y-auto space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 p-4 rounded-md shadow-sm"
            >
              <h4 className="font-semibold text-gray-800 text-md">
                {comment.commenterName || "Anonymous"}
              </h4>
              <div className="py-1">
                <StarRating rating={comment.rating} />
              </div>
              <p className="text-sm text-gray-700 pt-2">{comment.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No testimonials found.</p>
        )}
      </div>
    </div>
  );
};

// Star rating renderer
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(full)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-500" />
      ))}
      {half && <FaStarHalfAlt className="text-yellow-500" />}
      {[...Array(empty)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

ClassDetailsTestimonialsEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    module: PropTypes.string,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commenterName: PropTypes.string,
        comment: PropTypes.string,
        rating: PropTypes.number,
      })
    ),
  }),
};

export default ClassDetailsTestimonialsEditModal;
