/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Import Sections
import HomePageAdminBanner from "./HomePageAdminBanner/HomePageAdminBanner";
import HomePageAdminWelcome from "./HomePageAdminWelcome/HomePageAdminWelcome";
import HomePageAdminServices from "./HomePageAdminServices/HomePageAdminServices";
import HomePageAdminPromotion from "./HomePageAdminPromotion/HomePageAdminPromotion";

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

      <HomePageAdminWelcome
        Refetch={Refetch}
        HomeWelcomeSectionData={HomeWelcomeSectionData}
      />

      <HomePageAdminServices
        Refetch={Refetch}
        HomeServicesSectionData={HomeServicesSectionData}
      />

      <HomePageAdminPromotion
        Refetch={Refetch}
        PromotionsData={PromotionsData}
      />
    </div>
  );
};

export default HomePageAdminControl;
