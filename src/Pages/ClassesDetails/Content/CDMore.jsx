/* eslint-disable react/prop-types */

const CDMore = ({ ThisModule }) => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 mt-8 grid grid-cols-2 gap-5">
      {/* Class Goals Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <img src={"https://i.ibb.co.com/Df68wyg/benefits.png"} alt="" className="w-20 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-800 text-center">Class Goals</h3>
        <ul className="text-gray-600 mt-4 list-disc pl-6 space-y-2">
          {ThisModule.classGoals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </div>

      {/* Fitness Benefits Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <img src={"https://i.ibb.co.com/RTDJJ4q/goal.png"} alt="" className="w-20 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Fitness Benefits
        </h3>
        <ul className="text-gray-600 mt-4 list-disc pl-6 space-y-2">
          {ThisModule.fitnessBenefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>

      {/* Feedback Mechanism Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <img src={"https://i.ibb.co.com/Zfg9W0s/flag.png"} alt="" className="w-20 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Feedback Mechanism
        </h3>
        <ul className="text-gray-600 mt-4 list-disc pl-6 space-y-2">
          {ThisModule.feedbackMechanism.map((feedback, index) => (
            <li key={index}>{feedback}</li>
          ))}
        </ul>
      </div>

      {/* Class Milestones Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <img src={"https://i.ibb.co.com/w74RM6f/mechanical-gears.png"} alt="" className="w-20 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Class Milestones
        </h3>
        <ul className="text-gray-600 mt-4 list-disc pl-6 space-y-2">
          {ThisModule.classMilestones.map((milestone, index) => (
            <li key={index}>{milestone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CDMore;
