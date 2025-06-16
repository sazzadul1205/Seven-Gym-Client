/* eslint-disable react/prop-types */
import OurMissionPageManagement from "./OurMissionPageManagement/OurMissionPageManagement";

const AllExtraPageManagement = ({ OurMissionsData, Refetch }) => {
  console.log(OurMissionsData);

  return (
    <div className="text-black">
      <OurMissionPageManagement
        OurMissionsData={OurMissionsData}
        Refetch={Refetch}
      />
    </div>
  );
};

export default AllExtraPageManagement;
