// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { IoSettings } from "react-icons/io5";

const ManagementClassMoreDetails = ({ selectedClass }) => {
  return (
    <section className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_More_Details_Edit"
          onClick={() =>
            document.getElementById("Class_More_Details_Edit_Modal").showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_More_Details_Edit"
          place="top"
          className="z-50"
          content="Edit Class More Details "
        />
      </>

      {/* Title */}
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">Class Information</h3>
      </header>

      {/* Details Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Reusable Section Component */}
        {[
          {
            title: "Class Goals",
            image: "https://i.ibb.co/Df68wyg/benefits.png",
            list: selectedClass?.classGoals,
          },
          {
            title: "Fitness Benefits",
            image: "https://i.ibb.co/RTDJJ4q/goal.png",
            list: selectedClass?.fitnessBenefits,
          },
          {
            title: "Feedback Mechanism",
            image: "https://i.ibb.co/Zfg9W0s/flag.png",
            list: selectedClass?.feedbackMechanism,
          },
          {
            title: "Class Milestones",
            image: "https://i.ibb.co/w74RM6f/mechanical-gears.png",
            list: selectedClass?.classMilestones,
          },
        ].map(({ title, image, list }, index) => (
          <div
            key={index}
            className="bg-gradient-to-bl hover:bg-gradient-to-tr from-white to-gray-200 p-6 rounded-lg shadow-md hover:shadow-2xl cursor-default"
          >
            {/* Icon */}
            <img src={image} alt={title} className="w-20 mx-auto" />

            {/* Title */}
            <h3 className="text-2xl font-semibold text-gray-800 text-center mt-4">
              {title}
            </h3>

            {/* List */}
            {list?.length > 0 ? (
              <ul className="text-gray-200 mt-4 list-disc pl-6 space-y-2">
                {list.map((item, i) => (
                  <li className="text-lg text-black " key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-300 mt-2">
                No data available
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Prop Validation
ManagementClassMoreDetails.propTypes = {
  selectedClass: PropTypes.shape({
    module: PropTypes.string,
    classGoals: PropTypes.arrayOf(PropTypes.string),
    fitnessBenefits: PropTypes.arrayOf(PropTypes.string),
    feedbackMechanism: PropTypes.arrayOf(PropTypes.string),
    classMilestones: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ManagementClassMoreDetails;
