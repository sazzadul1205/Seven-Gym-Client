import React from "react";

const TDPricing = ({ TrainerDetails, TrainerSchedule }) => {
  console.log(TrainerSchedule);

  return (
    <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Per Session</h3>
        <p>${TrainerDetails.perSession}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Monthly Package</h3>
        <p>${TrainerDetails.monthlyPackage}</p>
      </div>
    </div>
  );
};

export default TDPricing;
