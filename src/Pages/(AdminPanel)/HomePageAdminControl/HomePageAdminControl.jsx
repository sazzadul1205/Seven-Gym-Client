import { Tooltip } from "react-tooltip";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import HomePageAdminBanner from "./HomePageAdminBanner/HomePageAdminBanner";

const HomePageAdminControl = ({
  Refetch,
  GalleryData,
  PromotionsData,
  GymFeaturesData,
  TestimonialsData,
  HomeBannerSectionData,
  HomeWelcomeSectionData,
  HomeServicesSectionData,
}) => {
  return (
    <div className="text-black pb-5">
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Home Page Preview (Admin)
        </h3>
      </div>

      {/* Home Banner Preview */}
      <HomePageAdminBanner
        Refetch={Refetch}
        HomeBannerSectionData={HomeBannerSectionData}
      />
    </div>
  );
};

export default HomePageAdminControl;
