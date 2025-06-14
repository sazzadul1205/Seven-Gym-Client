// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const TestimonialsManagement = ({ Refetch, TestimonialsData }) => {
  const axiosPublic = useAxiosPublic();

  // Handle Delete Testimonials Handler
  const handleDeleteTestimonial = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublic.delete(`/Testimonials/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Testimonial removed successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        Refetch();
      } catch (err) {
        console.log(err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete testimonial.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <div className="text-black pb-5">
      {/* Header */}
      <div className="bg-gray-400 py-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 w-10" />

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Testimonials (Admin) [ Total: {TestimonialsData?.length || 0} ]
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Quote</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {TestimonialsData.map((testimonial, index) => (
              <tr key={testimonial._id} className="hover:bg-gray-100">
                {/* Serial Number */}
                <td className="border px-4 py-2">{index + 1}</td>

                {/* Author Image */}
                <td className="border px-4 py-2">
                  <img
                    src={testimonial.imageUrl || "/default-profile.png"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mx-auto object-cover"
                  />
                </td>

                {/* Author Name */}
                <td className="border px-4 py-2 font-medium">
                  {testimonial.name}
                </td>

                {/* Author Role */}
                <td className="border px-4 py-2 italic text-gray-600">
                  {testimonial.role}
                </td>

                {/* Author Content */}
                <td className="border px-4 py-2 text-left">
                  {testimonial.quote}
                </td>

                {/* Action */}
                <td className="border px-4 py-2 text-left">
                  <button
                    id={`Delete-testimonial-btn-${testimonial._id}`}
                    className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      handleDeleteTestimonial(testimonial?._id);
                    }}
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#Delete-testimonial-btn-${testimonial._id}`}
                    content="Delete Testimonials"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PropTypes Validation
TestimonialsManagement.propTypes = {
  Refetch: PropTypes.func.isRequired,
  TestimonialsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      quote: PropTypes.string,
      imageUrl: PropTypes.string,
    })
  ),
};

export default TestimonialsManagement;
