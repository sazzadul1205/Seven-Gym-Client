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
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
          error.response?.data?.error ||
          "Something went wrong while deleting testimonial.",
      });
    }
  };

  return (
    <>
      {/* Section: Leave a Testimonial */}
      <div className="py-1">
        {/* Testimonials Header */}
        <div className="bg-[#A1662F] py-4 border border-white rounded-t-lg">
          {/* Title */}
          <h4 className="text-xl sm:text-2xl font-bold text-center text-white">
            Leave a Testimonial
          </h4>
          {/* Sub-Title */}
          <p className="text-white text-sm sm:text-base text-center">
            Share your experience with your trainer to help others.
          </p>
        </div>

        {/* Check if the user has submitted testimonials for all trainers */}
        {trainersWithoutUserTestimonial.length === 0 ? (
          // If no trainers are left to review, show this message
          <p className="text-center text-gray-800 py-5 bg-white">
            You’ve already submitted testimonials for all your trainers.
          </p>
        ) : (
          // Otherwise, iterate over each trainer who hasn't received a testimonial
          trainersWithoutUserTestimonial.map((trainer, index) => (
            // Outer container for each trainer card
            <div
              key={trainer._id}
              className="bg-white border-b border-gray-300"
            >
              {/* Inner container for layout and spacing */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4">
                {/* Left side: Trainer index and name */}
                <div className="flex gap-2 items-center">
                  {/* Display trainer's position in the list */}
                  <p className="font-bold">{index + 1}.</p>

                  {/* Display trainer's name with responsive font size */}
                  <h4 className="text-base sm:text-lg font-semibold">
                    {trainer.name}
                  </h4>
                </div>

                {/* Right side: Button to open the testimonial modal for this trainer */}
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
        <div className="bg-[#A1662F] py-4 border border-white rounded-t-lg">
          {/* Title */}
          <h4 className="text-xl sm:text-2xl font-bold text-center text-white">
            My Testimonials
          </h4>
        </div>

        {/* Check if the user has submitted any testimonials at all */}
        {enrichedTestimonials.length === 0 ? (
          // If no testimonials submitted, show this fallback message
          <p className="text-center text-gray-800 py-5 bg-white">
            You haven’t submitted any testimonials yet.
          </p>
        ) : (
          // Otherwise, map over each testimonial submitted by the user
          enrichedTestimonials.map((item, index) => {
            // Destructure to get gender icon component (♂️, ♀️, etc.)
            const { icon } = getGenderIcon(item.trainerGender);

            return (
              // Wrapper for each testimonial card
              <div
                key={`${item.trainerId}-${index}`}
                className="bg-white border border-gray-300 rounded-lg shadow p-4 mb-4"
              >
                {/* Header section of testimonial: image, name, tier, rating, and delete */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 mb-3 gap-3">
                  {/* Left Side: Trainer Image + Name + Tier */}
                  <div className="flex items-center gap-3">
                    {/* Trainer's Profile Picture if available */}
                    {item.trainerImage && (
                      <img
                        src={item.trainerImage}
                        alt={item.trainerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}

                    {/* Trainer Info Block */}
                    <div>
                      {/* Trainer Name with gender icon */}
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-semibold">
                          {item.trainerName}
                        </h4>
                        {/* Gender icon displayed beside name */}
                        {icon}
                      </div>

                      {/* Tier badge, styled based on the tier */}
                      {item?.trainerTier && (
                        <span
                          className={`inline-block mt-1 sm:mt-0 px-2 py-[2px] rounded-full text-xs sm:text-sm font-semibold ${fetchTierBadge(
                            item?.trainerTier
                          )}`}
                        >
                          {item?.trainerTier} Tier
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Star Rating + Delete Button */}
                  <div className="flex items-center gap-3">
                    {/* Show rating stars based on numeric rating */}
                    <div className="text-sm text-yellow-600 font-semibold flex items-center gap-1">
                      {[...Array(Math.floor(item.rating))].map((_, i) => (
                        <span key={i}>⭐</span> // One star per rating point
                      ))}
                      <span className="text-gray-600">({item.rating}/5)</span>{" "}
                      {/* Numeric rating */}
                    </div>

                    {/* Delete testimonial button with icon and tooltip */}
                    <div className="relative">
                      <button
                        id={`view-details-btn-${item._id}`} // Unique ID for tooltip anchor
                        className="border-2 border-red-500 bg-red-100 rounded-full p-2 hover:scale-105 transition-transform"
                        onClick={() => handleDeleteTestimonials(item)} // Delete handler
                      >
                        <FaRegTrashAlt className="text-red-500" />
                      </button>

                      {/* Tooltip for the delete button */}
                      <Tooltip
                        anchorSelect={`#view-details-btn-${item._id}`}
                        content="Delete Testimonial"
                      />
                    </div>
                  </div>
                </div>

                {/* Body section of testimonial: actual review text */}
                <div>
                  <p className="text-sm sm:text-base text-gray-800">
                    {item.testimonial}
                  </p>
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
    </>
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
