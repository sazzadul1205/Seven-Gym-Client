/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import HomePageAdminBanner from "./HomePageAdminBanner/HomePageAdminBanner";
import HomePageAdminWelcome from "./HomePageAdminWelcome/HomePageAdminWelcome";
import HomePageAdminServices from "./HomePageAdminServices/HomePageAdminServices";
import HomePageAdminPromotion from "./HomePageAdminPromotion/HomePageAdminPromotion";
import HomePageAdminFeatures from "./HomePageAdminFeatures/HomePageAdminFeatures";
import Home from "../../(PublicPages)/Home/Home";

// Define Tabs
const TABS = [
  { key: "view", label: "View Section" },
  { key: "banner", label: "Banner Section" },
  { key: "welcome", label: "Welcome Section" },
  { key: "services", label: "Services Section" },
  { key: "promotion", label: "Promotion Section" },
  { key: "features", label: "Features Section" },
];

const HomePageAdminControl = ({
  Refetch,
  PromotionsData,
  GymFeaturesData,
  HomeBannerSectionData,
  HomeWelcomeSectionData,
  HomeServicesSectionData,
}) => {
  const [activeTab, setActiveTab] = useState("view");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "view":
        return <Home />;
      case "banner":
        return (
          <HomePageAdminBanner
            Refetch={Refetch}
            HomeBannerSectionData={HomeBannerSectionData}
          />
        );
      case "welcome":
        return (
          <HomePageAdminWelcome
            Refetch={Refetch}
            HomeWelcomeSectionData={HomeWelcomeSectionData}
          />
        );
      case "services":
        return (
          <HomePageAdminServices
            Refetch={Refetch}
            HomeServicesSectionData={HomeServicesSectionData}
          />
        );
      case "promotion":
        return (
          <HomePageAdminPromotion
            Refetch={Refetch}
            PromotionsData={PromotionsData}
          />
        );
      case "features":
        return (
          <HomePageAdminFeatures
            Refetch={Refetch}
            GymFeaturesData={GymFeaturesData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-black pb-5">
      {/* Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Home Page Preview (Admin)
        </h3>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-500 font-semibold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content or Loading Spinner */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default HomePageAdminControl;
