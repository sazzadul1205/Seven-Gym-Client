import { useState, useMemo } from "react";

// External Libraries
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";

// Custom Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

// Shared Components
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Modal Component
import UserTrainerTestimonialsAddModal from "./UserTrainerTestimonialsAddModal/UserTrainerTestimonialsAddModal";

// Utility Functions
import { getGenderIcon } from "../../../../Utility/getGenderIcon";
import { fetchTierBadge } from "../../../../Utility/fetchTierBadge";

// Shared Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Icons
import { FaRegTrashAlt } from "react-icons/fa";

const UserTrainerTestimonials = ({
  refetch,
  UserEmail,
  UserBasicData,
  TrainerStudentHistoryData,
}) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Track selected trainer for modal
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);

  // Extract trainer names from student history to fetch full trainer profiles
  const trainerNames = TrainerStudentHistoryData.map((item) => item.name);

  // Fetch full details of all trainers user interacted with
  const {
    data: TrainersData,
    isLoading: TrainerIsLoading,
    error: TrainerError,
    refetch: TrainersRefetch,
  } = useQuery({
    queryKey: ["TrainersData", trainerNames],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainers/SearchTrainersByNames?names=${trainerNames.join(",")}`
      );
      return res.data;
    },
    enabled: trainerNames.length > 0, // Only fetch if names exist
  });

  // Fetch all testimonials user has submitted
  const {
    data: TrainersTestimonialsData,
    isLoading: TrainersTestimonialsIsLoading,
    error: TrainersTestimonialsError,
    refetch: TrainersTestimonialsRefetch,
  } = useQuery({
    queryKey: ["TestimonialsByEmail"],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainers/TestimonialsByEmail?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Extract unique trainer IDs from testimonial data
  const trainerIdsFromTestimonials = useMemo(() => {
    if (!TrainersTestimonialsData) return [];
    const ids = TrainersTestimonialsData.map((item) => item.trainerId);
    return [...new Set(ids)];
  }, [TrainersTestimonialsData]);

  // Fetch full trainer details based on testimonial references
  const {
    data: TrainerDetailsFromTestimonials,
    isLoading: TrainerDetailsLoading,
    error: TrainerDetailsError,
    refetch: TrainerDetailsRefetch,
  } = useQuery({
    queryKey: ["TrainerDetailsForTestimonials", trainerIdsFromTestimonials],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainers?ids=${trainerIdsFromTestimonials.join(",")}`
      );
      return res.data;
    },
    enabled: trainerIdsFromTestimonials.length > 0,
  });

  // Merge testimonials with their corresponding trainer data
  const enrichedTestimonials = useMemo(() => {
    if (!TrainersTestimonialsData || !TrainerDetailsFromTestimonials) return [];
    return TrainersTestimonialsData.map((testimonial) => {
      const trainer = TrainerDetailsFromTestimonials.find(
        (t) => t._id === testimonial.trainerId
      );
      return {
        ...testimonial,
        trainerName: trainer?.name,
        trainerGender: trainer?.gender,
        trainerImage: trainer?.imageUrl,
        trainerTier: trainer?.tier,
      };
    });
  }, [TrainersTestimonialsData, TrainerDetailsFromTestimonials]);

  // Show loading/error state if needed
  if (
    TrainerIsLoading ||
    TrainersTestimonialsIsLoading ||
    TrainerDetailsLoading
  )
    return <Loading />;
  if (TrainerError || TrainersTestimonialsError || TrainerDetailsError)
    return <FetchingError />;

  // Filter out trainers already reviewed
  const trainersWithoutUserTestimonial = TrainersData.filter(
    (trainer) =>
      !trainer.testimonials?.some(
        (testimonial) => testimonial.email === UserEmail
      )
  );

  // Show modal to submit testimonial
  const handleTestimonialModal = (trainerId) => {
    setSelectedTrainerId(trainerId);
    const modal = document.getElementById("Add_Trainer_Testimonials");
    if (modal) modal.showModal();
  };

  // Refetch all testimonial-related queries
  const refetchAll = async () => {
    await refetch();
    await TrainersRefetch();
    await TrainerDetailsRefetch();
    await TrainersTestimonialsRefetch();
  };

  // Function to handle testimonial deletion
  const handleDeleteTestimonials = async (item) => {
    // Step 1: Validation check
    // Ensure the item exists and has the required fields
    if (!item || !item.trainerId || !item.email) {
      Swal.fire({
        icon: "error",
        title: "Invalid Testimonials",
        text: "Testimonials information is missing or incorrect.",
      });
      return;
    }

    // Step 2: Ask user for confirmation before deletion
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete the testimonial from ${item.email}.`,
      icon: "warning",
      showCancelButton: true, // Give user a cancel option
      confirmButtonColor: "#d33", // Red for delete
      cancelButtonColor: "#3085d6", // Blue for cancel
      confirmButtonText: "Yes, delete it!",
    });

    // Step 3: If the user cancels the confirmation, exit the function
    if (!confirmResult.isConfirmed) return;

    // Step 4: Proceed to delete the testimonial
    try {
      const response = await axiosPublic.delete("/trainers/DeleteTestimonial", {
        params: {
          trainerId: item.trainerId,
          userEmail: item.email,
        },
      });

      // Step 5: If the server responds with a success message
      if (response.data?.message) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message,
        });

        // Step 6: Refetch all related data to update the UI
        refetchAll();
      } else {
        // If server responds but without a message, treat it as an error
        throw new Error("Unexpected server response.");
      }
    } catch (error) {
      // Step 7: Catch and display any errors from the API
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text:
          error.response?.data?.error || // Prefer server error message
          "Something went wrong while deleting testimonial.", // Fallback error
      });
    }
  };

  return (
    <div>
      {/* Section: Leave a Testimonial */}
      <div>
        {/* Testimonials Header */}
        <div className="bg-[#A1662F] py-3 border border-white">
          <h4 className="text-2xl font-bold text-center text-white">
            Leave a Testimonial
          </h4>
          <p className="text-white text-sm text-center">
            Share your experience with your trainer to help others.
          </p>
        </div>

        {/* Show a message if all testimonials are already submitted */}
        {trainersWithoutUserTestimonial.length === 0 ? (
          <p className="text-center text-gray-800 py-5 bg-white">
            You’ve already submitted testimonials for all your trainers.
          </p>
        ) : (
          // Otherwise, loop through each trainer without a testimonial
          trainersWithoutUserTestimonial.map((trainer, index) => (
            <div key={trainer._id}>
              <div className="flex items-center justify-between bg-white border-b-2 border-gray-800 px-5 py-3">
                <div className="flex gap-2 items-center">
                  <p className="font-bold">{index + 1}.</p>
                  <h4 className="text-lg font-semibold">{trainer.name}</h4>
                </div>

                {/* Button to open modal and submit a testimonial */}
                <CommonButton
                  text="Leave a Testimonial"
                  py="py-2"
                  bgColor="TestimonialColor"
                  clickEvent={() => handleTestimonialModal(trainer._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Section: My Testimonials */}
      <div className="pt-10">
        
        {/* Testimonials Header */}
        <div className="bg-[#A1662F] py-3 border border-white">
          <h4 className="text-2xl font-bold text-center text-white">
            My Testimonials
          </h4>
        </div>

        {/* If the user hasn't submitted any testimonials yet */}
        {enrichedTestimonials.length === 0 ? (
          <p className="text-center text-gray-800 py-5 bg-white">
            You haven’t submitted any testimonials yet.
          </p>
        ) : (
          // Otherwise, loop through and show each testimonial
          enrichedTestimonials.map((item, index) => {
            const { icon } = getGenderIcon(item.trainerGender);

            return (
              <div
                key={`${item.trainerId}-${index}`}
                className="bg-white border border-gray-300 rounded-lg shadow p-4"
              >
                {/* Testimonial Header */}
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <div className="flex items-center gap-3">
                    {/* Trainer Image */}
                    {item.trainerImage && (
                      <img
                        src={item.trainerImage}
                        alt={item.trainerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}

                    {/* Trainer Name & Tier Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold">
                          {item.trainerName}
                        </h4>
                        {icon} {/* Gender Icon */}
                      </div>

                      {/* Show Tier badge if available */}
                      {item?.trainerTier && (
                        <span
                          className={`inline-block px-2 py-[2px] rounded-full text-xs sm:text-sm font-semibold ${fetchTierBadge(
                            item?.trainerTier
                          )}`}
                        >
                          {item?.trainerTier} Tier
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="text-sm text-yellow-600 font-semibold flex items-center gap-1">
                    {/* Show filled stars based on rating */}
                    {[...Array(Math.floor(item.rating))].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                    <span className="text-gray-600">({item.rating}/5)</span>
                  </div>

                  {/* Delete Testimonial Button */}
                  <button
                    id={`view-details-btn-${item._id}`}
                    className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                    onClick={() => handleDeleteTestimonials(item)}
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>

                  {/* Tooltip for Delete Button */}
                  <Tooltip
                    anchorSelect={`#view-details-btn-${item._id}`}
                    content="Delete Testimonials"
                  />
                </div>

                {/* Testimonial Body */}
                <div>
                  <p className="mt-2 text-gray-800">{item.testimonial}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Trainer Testimonial */}
      <dialog id="Add_Trainer_Testimonials" className="modal">
        <UserTrainerTestimonialsAddModal
          refetch={refetchAll}
          UserBasicData={UserBasicData}
          selectedTrainerId={selectedTrainerId}
          setSelectedTrainerId={setSelectedTrainerId}
        />
      </dialog>
    </div>
  );
};

// PropTypes validation
UserTrainerTestimonials.propTypes = {
  refetch: PropTypes.func.isRequired,
  UserEmail: PropTypes.string.isRequired,
  UserBasicData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.string,
    image: PropTypes.string,
    age: PropTypes.number,
    // Add more fields based on your actual UserBasicData structure
  }).isRequired,
  TrainerStudentHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UserTrainerTestimonials;
