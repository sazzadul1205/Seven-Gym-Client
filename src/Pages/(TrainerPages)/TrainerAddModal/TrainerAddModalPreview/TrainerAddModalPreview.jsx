import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Components
import PreviewDetails from "./PreviewDetails/PreviewDetails";
import PreviewSchedule from "./PreviewSchedule/PreviewSchedule";
import PreviewContacts from "./PreviewContacts/PreviewContacts";
import PreviewBasicInformation from "./PreviewBasicInformation/PreviewBasicInformation";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const TrainerAddModalPreview = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Schedule state
  const [trainerSchedule, setTrainerSchedule] = useState(null);

  // Basic info state
  const [trainerBasicInfo, setTrainerBasicInfo] = useState(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const scheduleData = localStorage.getItem("Trainer_Schedule");
    const basicInfoData = localStorage.getItem("trainerBasicInfo");

    try {
      const parsedSchedule = scheduleData ? JSON.parse(scheduleData) : null;
      const parsedBasicInfo = basicInfoData ? JSON.parse(basicInfoData) : null;

      setTrainerSchedule(parsedSchedule);
      setTrainerBasicInfo(parsedBasicInfo);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Parsing Error",
        text: "Could not parse trainer data from local storage.",
      });
    }
  }, []);

  // Submit data to the backend
  const handleSubmit = async () => {
    if (trainerBasicInfo && trainerSchedule && user?.email) {
      const basicInfoWithEmail = {
        ...trainerBasicInfo,
        email: user.email,
      };

      const scheduleWithEmail = {
        ...trainerSchedule,
        email: user.email,
      };

      try {
        // Add trainer
        await axiosPublic.post("/Trainers", basicInfoWithEmail);

        // Add trainer schedule
        await axiosPublic.post("/Trainers_Schedule", scheduleWithEmail);

        // Success alert
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Trainer and schedule submitted successfully.",
        });

        refetch(); // Refetch the parent data
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            error.response?.data?.error ||
            "Something went wrong while submitting.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Missing trainer info or user email.",
      });
    }
  };

  return (
    <div>
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800 bg-white py-2 border border-b-black">
        Preview
      </h3>

      {/* Preview Sections */}
      <PreviewBasicInformation trainerBasicInfo={trainerBasicInfo} />
      <PreviewContacts trainerBasicInfo={trainerBasicInfo} />
      <PreviewDetails trainerBasicInfo={trainerBasicInfo} />
      <PreviewSchedule trainerSchedule={trainerSchedule} />

      {/* Mismatch Warning */}
      {trainerBasicInfo &&
        trainerSchedule &&
        trainerBasicInfo.name !== trainerSchedule.trainerName && (
          <p className="text-red-600 text-sm text-center mt-2 font-medium">
            ⚠️ Trainer name mismatch: please ensure both schedules and basic
            info belong to the same trainer.
          </p>
        )}

      {/* Submit Button */}
      <div className="flex justify-center items-center w-full py-4">
        <CommonButton
          type="button"
          text="Submit"
          iconSize="text-lg"
          bgColor="blue"
          px="px-20"
          py="py-2"
          borderRadius="rounded-lg"
          width="auto"
          isLoading={false}
          textColor="text-white"
          clickEvent={handleSubmit}
          iconPosition="after"
          disabled={
            !(
              trainerBasicInfo?.name &&
              trainerSchedule?.trainerName &&
              trainerBasicInfo.name === trainerSchedule.trainerName
            )
          }
        />
      </div>
    </div>
  );
};

// ✅ Prop Validation
TrainerAddModalPreview.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default TrainerAddModalPreview;
