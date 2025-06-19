import PropTypes from "prop-types";

const ClassesDetailsMore = ({ ThisModule }) => {
  return (
    <section className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      {/* Title */}
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">Class Information</h3>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Reusable Section Component */}
        {[
          {
            title: "Class Goals",
            image: "https://i.ibb.co/Df68wyg/benefits.png",
            list: ThisModule?.classGoals,
          },
          {
            title: "Fitness Benefits",
            image: "https://i.ibb.co/RTDJJ4q/goal.png",
            list: ThisModule?.fitnessBenefits,
          },
          {
            title: "Feedback Mechanism",
            image: "https://i.ibb.co/Zfg9W0s/flag.png",
            list: ThisModule?.feedbackMechanism,
          },
          {
            title: "Class Milestones",
            image: "https://i.ibb.co/w74RM6f/mechanical-gears.png",
            list: ThisModule?.classMilestones,
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

// PropTypes validation
ClassesDetailsMore.propTypes = {
  ThisModule: PropTypes.shape({
    classGoals: PropTypes.arrayOf(PropTypes.string),
    fitnessBenefits: PropTypes.arrayOf(PropTypes.string),
    feedbackMechanism: PropTypes.arrayOf(PropTypes.string),
    classMilestones: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ClassesDetailsMore;
