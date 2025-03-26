import { GrUserSettings } from "react-icons/gr";
import BannerSettings from "./BannerSettings/BannerSettings";

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
      <div className="space-y-3 py-2 px-1">
        {/* Banners Section */}
        <BannerSettings UsersData={UsersData} />
      </div>
    </div>
  );
};

export default UserSettingsInformation;
