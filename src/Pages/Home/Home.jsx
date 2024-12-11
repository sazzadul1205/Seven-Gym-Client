import Background from "../../assets/Background1.jpg";
import Welcome from "./Welcome/Welcome";
import Banner from "./Banner/Banner";
import Highlights from "./Highlights/Highlights";
import ClassSchedule from "./ClassSchedule/ClassSchedule";
import FeaturedTrainers from "./FeaturedTrainers/FeaturedTrainers";
import Testimonials from "./Testimonials/Testimonials";
import GalleryPreview from "./GalleryPreview/GalleryPreview";
import PromotionsSection from "./PromotionsSection/PromotionsSection";
import GymFeatures from "./GymFeatures/GymFeatures";
import CallToAction from "./CallToAction/CallToAction";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <Banner />
      <Welcome />
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
