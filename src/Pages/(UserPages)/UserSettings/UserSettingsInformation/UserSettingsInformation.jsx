import { GrUserSettings } from "react-icons/gr";
import BannerSelector from "./BannerSelector/BannerSelector";
import BasicInfoSelector from "./BasicInfoSelector/BasicInfoSelector";
import DetailsInfoSelector from "./DetailsInfoSelector/DetailsInfoSelector";
import SocialLinkSelector from "./SocialLinkSelector/SocialLinkSelector";

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
        <BannerSelector UsersData={UsersData} />

        {/* Avatar, Name, Phone, Date, Gender */}
        <BasicInfoSelector UsersData={UsersData} />

        {/* Bio, Goals  */}
        <DetailsInfoSelector UsersData={UsersData} />

        {/* Social Links */}
        <SocialLinkSelector UsersData={UsersData} />
      </div>
    </div>
  );
};

export default UserSettingsInformation;
