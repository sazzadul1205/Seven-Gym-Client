// Import Package
import PropTypes from "prop-types";

// Import Components
import TrainerProfileAbout from "./TrainerProfileAbout/TrainerProfileAbout";
import TrainerProfileHeader from "./TrainerProfileHeader/TrainerProfileHeader";
import TrainerProfileContact from "./TrainerProfileContact/TrainerProfileContact";
import TrainerProfileDetails from "./TrainerProfileDetails/TrainerProfileDetails";
import TrainerProfileSchedule from "./TrainerProfileSchedule/TrainerProfileSchedule";
import TrainerDetailsTestimonials from "../../(PublicPages)/(Trainers)/TrainersDetails/TrainerDetailsTestimonials/TrainerDetailsTestimonials";

const TrainerProfile = ({ TrainerScheduleData, TrainerData, refetch }) => {
  // Extract trainer details
  const TrainerProfileData = TrainerData?.[0] || null;

  // Extract schedule details
  const TrainerProfileScheduleData = TrainerScheduleData?.[0] || null;

  return (
    <div className="bg-fixed bg-cover bg-center">
      {/* Header Section */}
      <div className="bg-linear-to-b from-gray-200 to-gray-400">
        <TrainerProfileHeader TrainerDetails={TrainerProfileData || {}} />
      </div>

      {/* Content Section */}
      <div className="bg-linear-to-b from-gray-400 to-gray-200 pb-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trainer Bio and Experience */}
          <TrainerProfileAbout TrainerDetails={TrainerProfileData || {}} />

          {/* Trainer Contact Information */}
          <TrainerProfileContact TrainerDetails={TrainerProfileData || {}} />
        </div>

        {/* Trainer Pricing and Availability */}
        <TrainerProfileSchedule
          TrainerDetails={TrainerProfileData || {}}
          TrainerSchedule={TrainerProfileScheduleData || {}}
        />

        {/* Trainer Certifications & Details */}
        <TrainerProfileDetails TrainerDetails={TrainerProfileData || {}} />

        {/* Trainer Testimonials */}
        <TrainerDetailsTestimonials TrainerDetails={TrainerProfileData || {}} />
      </div>
    </div>
  );
};

// Prop Type
TrainerProfile.propTypes = {
  TrainerScheduleData: PropTypes.array,
  TrainerData: PropTypes.array,
};

export default TrainerProfile;
