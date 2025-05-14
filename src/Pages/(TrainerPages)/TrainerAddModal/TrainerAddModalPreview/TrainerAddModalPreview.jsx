import { useEffect, useState } from "react";

// Import Components
import PreviewBasicInformation from "./PreviewBasicInformation/PreviewBasicInformation";
import PreviewContacts from "./PreviewContacts/PreviewContacts";
import PreviewDetails from "./PreviewDetails/PreviewDetails";
import PreviewSchedule from "./PreviewSchedule/PreviewSchedule";

const TrainerAddModalPreview = () => {
  const [trainerSchedule, setTrainerSchedule] = useState(null);
  const [trainerBasicInfo, setTrainerBasicInfo] = useState(null);

  useEffect(() => {
    const scheduleData = localStorage.getItem("Trainer_Schedule");
    const basicInfoData = localStorage.getItem("trainerBasicInfo");

    try {
      const parsedSchedule = scheduleData ? JSON.parse(scheduleData) : null;
      const parsedBasicInfo = basicInfoData ? JSON.parse(basicInfoData) : null;

      setTrainerSchedule(parsedSchedule);
      setTrainerBasicInfo(parsedBasicInfo);

      console.log("Trainer Schedule:", parsedSchedule);
      console.log("Trainer Basic Info:", parsedBasicInfo);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, []);

  return (
    <div>
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800 bg-white py-2 border border-b-black">
        Preview
      </h3>

      {/* Basic Preview */}
      <PreviewBasicInformation trainerBasicInfo={trainerBasicInfo} />

      {/* Contacts */}
      <PreviewContacts trainerBasicInfo={trainerBasicInfo} />

      {/* Details */}
      <PreviewDetails trainerBasicInfo={trainerBasicInfo} />

      {/* Trainer Schedule  */}
      <PreviewSchedule trainerSchedule={trainerSchedule} />
    </div>
  );
};

export default TrainerAddModalPreview;
