import Background from "../../assets/Background.jpeg";
import Highlights from "./Highlights/Highlights";
import ClassSchedule from "./ClassSchedule/ClassSchedule";
import FeaturedTrainers from "./FeaturedTrainers/FeaturedTrainers";
import Testimonials from "./Testimonials/Testimonials";
import GalleryPreview from "./GalleryPreview/GalleryPreview";
import PromotionsSection from "./PromotionsSection/PromotionsSection";
import GymFeatures from "./GymFeatures/GymFeatures";
import CallToAction from "./CallToAction/CallToAction";
import BannerSection from "./BannerSection/BannerSection";
import WelcomeSection from "./WelcomeSection/WelcomeSection";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BannerSection />
      <WelcomeSection />
      <Highlights />
      <ClassSchedule />
      <FeaturedTrainers />
      <Testimonials />
      <GalleryPreview />
      <PromotionsSection />
      <GymFeatures />
      <CallToAction />
    </div>
  );
};

export default Home;
