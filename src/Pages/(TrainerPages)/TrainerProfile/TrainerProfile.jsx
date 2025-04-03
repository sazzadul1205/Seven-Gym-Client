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
        <TrainerProfileHeader
          TrainerDetails={TrainerProfileData || {}}
          refetch={refetch}
        />
      </div>

      {/* Content Section */}
      <div className="bg-linear-to-b from-gray-400 to-gray-200 pb-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trainer Bio and Experience */}
          <TrainerProfileAbout
            TrainerDetails={TrainerProfileData || {}}
            refetch={refetch}
          />

          {/* Trainer Contact Information */}
          <TrainerProfileContact
            TrainerDetails={TrainerProfileData || {}}
            refetch={refetch}
          />
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
  TrainerScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      // Define properties based on the structure of each schedule item
      day: PropTypes.string,
      time: PropTypes.string,
      sessionType: PropTypes.string,
      availability: PropTypes.string,
      // Add more properties if needed
    })
  ),
  TrainerData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      gender: PropTypes.string,
      specialization: PropTypes.string,
      tier: PropTypes.string,
      imageUrl: PropTypes.string,
      // Add other relevant fields for TrainerData
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfile;
