import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";
import Loading from "../../../../Shared/Loading/Loading";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { ImCross } from "react-icons/im";
import InputField from "../../../../Shared/InputField/InputField";
import { useForm } from "react-hook-form";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useState } from "react";
import Swal from "sweetalert2";

/* eslint-disable react/prop-types */
const UserTrainerTestimonials = ({ UserEmail, TrainerStudentHistoryData }) => {
  const axiosPublic = useAxiosPublic();

  // Rating State
  const [rating, setRating] = useState(0);

  // UseForm Utility
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const trainerNames = TrainerStudentHistoryData.map((item) => item.name);

  const {
    data: UserBasicData,
    isLoading: UserBasicIsLoading,
    error: UserBasicError,
  } = useQuery({
    queryKey: ["TrainersData", UserEmail],
    queryFn: async () => {
      const response = await axiosPublic.get(
        `/Users/BasicProfile?email=${UserEmail}`
      );
      return response.data;
    },
    enabled: trainerNames.length > 0,
  });

  const {
    data: TrainersData,
    isLoading: TrainerIsLoading,
    error: TrainerError,
  } = useQuery({
    queryKey: ["TrainersData", trainerNames],
    queryFn: async () => {
      const response = await axiosPublic.get(
        `/Trainers/SearchTrainersByNames?names=${trainerNames.join(",")}`
      );
      return response.data;
    },
    enabled: trainerNames.length > 0,
  });

  if (TrainerIsLoading || UserBasicIsLoading) return <Loading />;
  if (TrainerError || UserBasicError) return <FetchingError />;

  // Filter out trainers that already have a testimonial from the user
  const trainersWithoutUserTestimonial = TrainersData.filter((trainer) => {
    return !trainer.testimonials?.some(
      (testimonial) => testimonial.email === UserEmail
    );
  });

  // Handle form submission
  const onSubmit = async (data) => {
    const TestimonialPayload = {
      clientAvatar: UserBasicData.profileImage,
      clientName: UserBasicData.fullName,
      testimonial: data.testimonial,
      email: UserBasicData.email,
      rating: rating,
    };

    console.log("Testimonial Payload :", TestimonialPayload);

    console.log("trainer ID :", trainerId);

    try {
      const response = await axiosPublic.patch(
        `/AddTestimonials/${trainerId}`, // Make sure trainerId is available
        TestimonialPayload
      );

      if (response.data?.message === "Testimonial added successfully!") {
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your testimonial has been submitted.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Optionally reset the form
        reset(); // If you're using react-hook-form
        setRating(0); // Reset rating if needed
      }
    } catch (error) {
      console.error("Testimonial submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Something went wrong.",
      });
    }
  };

  return (
    <div>
      <div className="text-center py-1">
        <h3 className="text-xl font-semibold">Your Trainer Reviews</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      <div className="mt-2">
        <div className="bg-[#A1662F] py-2 px-6">
          <h3 className="text-2xl font-bold text-center text-white">
            Leave a Testimonial
          </h3>
          <p className="text-white text-sm text-center mt-1">
            Share your experience with your trainer to help others.
          </p>
        </div>

        {trainersWithoutUserTestimonial.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">
            You’ve already submitted testimonials for all your trainers.
          </p>
        ) : (
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
                  clickEvent={() =>
                    document
                      .getElementById("Add_Trainer_Testimonials")
                      .showModal()
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>

      <dialog id="Add_Trainer_Testimonials" className="modal">
        <div className="modal-box max-w-2xl p-0 bg-gradient-to-b from-white to-gray-100 text-black">
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">Leave a Testimonial</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document.getElementById("Add_Trainer_Testimonials")?.close()
              }
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <InputField
              label="Testimonial"
              id="testimonial"
              type="textarea"
              hight="30"
              placeholder="Write your feedback here..."
              register={register}
              errors={errors}
              options={{ required: "Testimonial is required" }}
            />

            {/* Star Rating */}
            <div className="flex items-center gap-4">
              <label htmlFor="rating" className="font-medium">
                Your Rating :
              </label>
              <Rating
                style={{ maxWidth: 150 }}
                value={rating}
                onChange={setRating}
                isRequired
              />
            </div>

            <div className="flex justify-end mt-4">
              <CommonButton
                text="Leave a Testimonial"
                py="py-2"
                bgColor="TestimonialColor"
                type="submit"
              />
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UserTrainerTestimonials;
