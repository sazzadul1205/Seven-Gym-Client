/* eslint-disable react/prop-types */
import AboutUsPageManagement from "./AboutUsPageManagement/AboutUsPageManagement";
import OurMissionPageManagement from "./OurMissionPageManagement/OurMissionPageManagement";

const AllExtraPageManagement = ({ OurMissionsData, AboutUsData, Refetch }) => {
  return (
    <div className="text-black">
      <OurMissionPageManagement
        OurMissionsData={OurMissionsData}
        Refetch={Refetch}
      />
      <AboutUsPageManagement AboutUsData={AboutUsData} Refetch={Refetch} />
    </div>
  );
};

export default AllExtraPageManagement;
