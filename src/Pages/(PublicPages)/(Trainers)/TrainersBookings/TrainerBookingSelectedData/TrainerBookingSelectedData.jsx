import { useNavigate } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// import Icons
import { FaRegUser } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

// Import Buttons
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

const TrainerBookingSelectedData = ({ SelectedSessionData }) => {
  const navigate = useNavigate();

  // UnPack the Selected Session Data
  const { trainerName, day, time, session } = SelectedSessionData;

  // Participant Limit Fix
  const participantLimit = session?.participantLimit
    ? String(session?.participantLimit).toLowerCase()
    : "no limit";

  // Class Price
  const classPrice = session?.classPrice
    ? String(session?.classPrice).toLowerCase()
    : "free";

  return (
    <div className="relative bg-gradient-to-b from-gray-500/80 to-gray-500/50">
      {/* Section-Scoped Floating Back Button */}
      <button
        className="absolute top-5 left-5 flex items-center gap-2 text-lg px-5 md:px-10 py-2 bg-white hover:bg-gray-100/90 text-black rounded-lg cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <p className="hidden md:flex">Back</p>
      </button>

      {/* Page Content */}
      <div className="mx-auto max-w-7xl py-5 pt-20 flex flex-col md:flex-row items-center justify-center gap-5">
        {/* Selected Session Data */}
        <div className="max-w-4xl w-full bg-black/50 rounded-xl p-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Selected Session Details
          </h2>

          {/* Trainer and Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white text-white py-4">
            {/* Trainer Name */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">Trainer:</span>
              {trainerName}
            </div>

            {/* Day */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">Day:</span> {day}
            </div>

            {/* Time */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">Requested Time:</span>
              {time}
            </div>

            {/* Class Type */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">Class Type:</span>
              {session?.classType}
            </div>

            {/* Participant Limit */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">
                Participant Limit:
              </span>
              {participantLimit === "no limit" ? (
                "No Limit"
              ) : (
                <div className="flex text-center items-center gap-2">
                  <span>{session?.participantLimit}</span>
                  <FaRegUser />
                </div>
              )}
            </div>

            {/* Class Price */}
            <div className="flex justify-between">
              <span className="font-semibold text-white">Price Per Class:</span>
              {classPrice === "free" ? "Free" : `$ ${session?.classPrice}`}
            </div>
          </div>

          {/* Session Timing */}
          <div className="border-t border-white pt-4">
            {/* Title */}
            <h3 className="text-xl text-center font-semibold text-white mb-2">
              Session Timing
            </h3>

            {/* Timing Start & End */}
            <div className="flex justify-between items-center px-0 md:px-20">
              {/* Start Time */}
              <p className="">
                <span className="font-semibold text-white mr-2">Start:</span>
                {formatTimeTo12Hour(session?.start)}
              </p>

              {/* Divider */}
              <span className="px-0 lg:px-5">-</span>

              {/* End Time */}
              <p className="">
                <span className="font-semibold text-white mr-2">End:</span>
                {formatTimeTo12Hour(session?.end)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          {/* Go to billing */}
          <CommonButton
            text="Go To Billing"
            bgColor="green"
            clickEvent={() => {
              const billingSection = document.getElementById("billing-section");
              if (billingSection) {
                billingSection.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          />

          {/* Go to Same Classes */}
          <CommonButton
            text={`Same Classes: ${session?.classType}`}
            bgColor="indigo"
            clickEvent={() => {
              const billingSection = document.getElementById(
                "same-classes-section"
              );
              if (billingSection) {
                billingSection.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          />

          {/* Go to Same Day */}
          <CommonButton
            text={`Same Day: ${day}`}
            bgColor="purple"
            clickEvent={() => {
              const billingSection =
                document.getElementById("same-day-section");
              if (billingSection) {
                billingSection.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          />

          {/* Go to All Schedule */}
          <CommonButton
            text="All Schedule"
            bgColor="gray"
            clickEvent={() => {
              const billingSection = document.getElementById(
                "all-schedule-section"
              );
              if (billingSection) {
                billingSection.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

// PropTypes
TrainerBookingSelectedData.propTypes = {
  SelectedSessionData: PropTypes.shape({
    trainerName: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    session: PropTypes.shape({
      classType: PropTypes.string,
      participantLimit: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      classPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      start: PropTypes.string,
      end: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default TrainerBookingSelectedData;
