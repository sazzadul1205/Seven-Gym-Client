import Background from "../../assets/Background1.jpg";
import Welcome from "./Welcome/Welcome";
import Banner from "./Banner/Banner";
import Highlights from "./Highlights/Highlights";
import ClassSchedule from "./ClassSchedule/ClassSchedule";
import FeaturedTrainers from "./FeaturedTrainers/FeaturedTrainers";
import Testimonials from "./Testimonials/Testimonials";
import GalleryPreview from "./GalleryPreview/GalleryPreview";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center opacity-80"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <Banner></Banner>
      <Welcome></Welcome>
      <Highlights></Highlights>
      <ClassSchedule></ClassSchedule>
      <FeaturedTrainers></FeaturedTrainers>
      <Testimonials></Testimonials>
      <GalleryPreview></GalleryPreview>
    </div>
  );
};

export default Home;
