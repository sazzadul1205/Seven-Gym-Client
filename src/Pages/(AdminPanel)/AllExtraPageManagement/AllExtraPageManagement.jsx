import { useEffect, useState } from "react";

// import Tabs
import AboutUsPageManagement from "./AboutUsPageManagement/AboutUsPageManagement";
import TermOfServiceManagement from "./TermOfServiceManagement/TermOfServiceManagement";
import OurMissionPageManagement from "./OurMissionPageManagement/OurMissionPageManagement";
import PropTypes from "prop-types";

// Define Tabs
const TABS = [
  { key: "ourMission", label: "Our Mission" },
  { key: "aboutUs", label: "About Us" },
  { key: "termsOfService", label: "Terms Of Service" },
];

const AllExtraPageManagement = ({
  TermsOfServiceData,
  OurMissionsData,
  AboutUsData,
  Refetch,
}) => {
  // Local State Management
  const [activeTab, setActiveTab] = useState("ourMission");
  const [isLoading, setIsLoading] = useState(false);

  // Tab Loading State
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Tabs Switch
  const renderTabContent = () => {
    switch (activeTab) {
      case "ourMission":
        return (
          <OurMissionPageManagement
            OurMissionsData={OurMissionsData}
            Refetch={Refetch}
          />
        );
      case "aboutUs":
        return (
          <AboutUsPageManagement AboutUsData={AboutUsData} Refetch={Refetch} />
        );
      case "termsOfService":
        return (
          <TermOfServiceManagement
            TermsOfServiceData={TermsOfServiceData}
            Refetch={Refetch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-black">
      {/* Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Extra Page Preview (Admin)
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

// Prop Validation
AllExtraPageManagement.propTypes = {
  TermsOfServiceData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    background: PropTypes.string,
    updatedDate: PropTypes.string,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ).isRequired,
  }),

  OurMissionsData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    hero: PropTypes.shape({
      title: PropTypes.string.isRequired,
      subTitle: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
    }).isRequired,
    mission: PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    vision: PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    coreValues: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        img: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
    missionGoals: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        goal: PropTypes.string.isRequired,
        progress: PropTypes.string.isRequired,
      })
    ).isRequired,
    callToAction: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    subTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),

  AboutUsData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hero: PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subTitle: PropTypes.string.isRequired,
    }).isRequired,
    introduction: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    missionVisionValues: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    teamMembers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        socials: PropTypes.shape({
          linkedin: PropTypes.string,
          twitter: PropTypes.string,
          facebook: PropTypes.string,
          github: PropTypes.string,
          portfolio: PropTypes.string,
        }),
      })
    ).isRequired,
  }),

  Refetch: PropTypes.func,
};

export default AllExtraPageManagement;
