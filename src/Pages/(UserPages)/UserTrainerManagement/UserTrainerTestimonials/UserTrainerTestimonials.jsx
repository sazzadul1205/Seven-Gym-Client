import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Import Modal
import UserTrainerTestimonialsAddModal from "./UserTrainerTestimonialsAddModal/UserTrainerTestimonialsAddModal";

const UserTrainerTestimonials = ({
  refetch,
  UserEmail,
  TrainerStudentHistoryData,
}) => {
  const axiosPublic = useAxiosPublic();

  // State to track which trainer is selected for testimonial
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);

  // Extract trainer names from history
  const trainerNames = TrainerStudentHistoryData.map((item) => item.name);

  // Query to fetch user's basic data (name, image, etc.)
  const {
    data: UserBasicData,
    isLoading: UserBasicIsLoading,
    error: UserBasicError,
  } = useQuery({
    queryKey: ["UserBasicData", UserEmail],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Users/BasicProfile?email=${UserEmail}`
      );
      return res.data;
    },
    enabled: trainerNames.length > 0,
  });

  // Query to fetch trainers based on student's training history
  const {
    data: TrainersData,
    isLoading: TrainerIsLoading,
    error: TrainerError,
  } = useQuery({
    queryKey: ["TrainersData", trainerNames],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainers/SearchTrainersByNames?names=${trainerNames.join(",")}`
      );
      return res.data;
    },
    enabled: trainerNames.length > 0,
  });

  // Handle loading and error states
  if (TrainerIsLoading || UserBasicIsLoading) return <Loading />;
  if (TrainerError || UserBasicError) return <FetchingError />;

  // Filter out trainers who already received a testimonial from the user
  const trainersWithoutUserTestimonial = TrainersData.filter(
    (trainer) =>
      !trainer.testimonials?.some(
        (testimonial) => testimonial.email === UserEmail
      )
  );

  // Handle modal open
  const handleTestimonialModal = (trainerId) => {
    setSelectedTrainerId(trainerId);
    const modal = document.getElementById("Add_Trainer_Testimonials");
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div>
      {/* Testimonial Prompt Box */}
      <div>
        <div className="bg-[#A1662F] py-3 border border-white">
          <h4 className="text-2xl font-bold text-center text-white">
            Leave a Testimonial
          </h4>
          <p className="text-white text-sm text-center">
            Share your experience with your trainer to help others.
          </p>
        </div>

        {/* Check if all testimonials are already submitted */}
        {trainersWithoutUserTestimonial.length === 0 ? (
          <p className="text-center text-gray-800 py-5 bg-white">
            You’ve already submitted testimonials for all your trainers.
          </p>
        ) : (
          // Trainers List
          trainersWithoutUserTestimonial.map((trainer, index) => (
            <div key={trainer._id}>
              <div className="flex items-center justify-between bg-white border-b-2 border-gray-800 px-5 py-3">
                <div className="flex gap-2 items-center">
                  <p className="font-bold">{index + 1}.</p>
                  <h4 className="text-lg font-semibold">{trainer.name}</h4>
                </div>
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

      {/* Testimonial Prompt Box */}
      <div className="pt-10">
        <div className="bg-[#A1662F] py-3 border border-white">
          <h4 className="text-2xl font-bold text-center text-white">
            My Testimonials
          </h4>
        </div>

        {/* Check if all testimonials are already submitted */}
        {trainersWithoutUserTestimonial.length === 0 ? (
          <p className="text-center text-gray-800 py-5 bg-white">
            You’ve already submitted testimonials for all your trainers.
          </p>
        ) : (
          // Trainers List
          trainersWithoutUserTestimonial.map((trainer, index) => (
            <div key={trainer._id}>
              <div className="flex items-center justify-between bg-white border-b-2 border-gray-800 px-5 py-3">
                <div className="flex gap-2 items-center">
                  <p className="font-bold">{index + 1}.</p>
                  <h4 className="text-lg font-semibold">{trainer.name}</h4>
                </div>
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

      {/* Testimonial Modal */}
      <dialog id="Add_Trainer_Testimonials" className="modal">
        <UserTrainerTestimonialsAddModal
          refetch={refetch}
          UserBasicData={UserBasicData}
          selectedTrainerId={selectedTrainerId}
          setSelectedTrainerId={setSelectedTrainerId}
        />
      </dialog>
    </div>
  );
};

// ✅ PropTypes
UserTrainerTestimonials.propTypes = {
  refetch: PropTypes.func.isRequired,
  UserEmail: PropTypes.string.isRequired,
  TrainerStudentHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UserTrainerTestimonials;
