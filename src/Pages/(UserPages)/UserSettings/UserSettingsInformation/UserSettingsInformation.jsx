import { GrUserSettings } from "react-icons/gr";
import BannerSettings from "./BannerSettings/BannerSettings";
import BasicInfoSettings from "./BasicInfoSettings/BasicInfoSettings";

const UserSettingsInformation = ({ UsersData }) => {
  return (
    <div className="bg-linear-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white ">
          <GrUserSettings />
          User Information Settings
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Banners Section */}
        <BannerSettings UsersData={UsersData} />

        {/* Avatar, Name, Phone, Date, Gender */}
        <BasicInfoSettings UsersData={UsersData} />

        {/* Bio, Goals  */}
        <DetailsInfoSelector />
      </div>
    </div>
  );
};

export default UserSettingsInformation;
