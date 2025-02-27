import { useQuery } from "@tanstack/react-query";

import GymFeatures from "./GymFeatures/GymFeatures";
import OurServices from "./OurServices/OurServices";
import Testimonials from "./Testimonials/Testimonials";
import CallToAction from "./CallToAction/CallToAction";
import BannerSection from "./BannerSection/BannerSection";
import ClassSchedule from "./ClassSchedule/ClassSchedule";
import WelcomeSection from "./WelcomeSection/WelcomeSection";
import GalleryPreview from "./GalleryPreview/GalleryPreview";
import FeaturedTrainers from "./FeaturedTrainers/FeaturedTrainers";
import PromotionsSection from "./PromotionsSection/PromotionsSection";

// Background Asset
import Background from "../../../assets/Background.jpeg";

import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching data for all the sections
  const {
    data: Home_Banner_SectionData,
    isLoading: Home_Banner_SectionDataIsLoading,
    error: Home_Banner_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Banner_Section"],
    queryFn: () =>
      axiosPublic.get("/Home_Banner_Section").then((res) => res.data),
  });
  const {
    data: Home_Welcome_SectionData,
    isLoading: Home_Welcome_SectionDataIsLoading,
    error: Home_Welcome_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Welcome_Section"],
    queryFn: () =>
      axiosPublic.get("/Home_Welcome_Section").then((res) => res.data),
  });
  const {
    data: Home_Services_SectionData,
    isLoading: Home_Services_SectionDataIsLoading,
    error: Home_Services_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Services_Section"],
    queryFn: () =>
      axiosPublic.get("/Home_Services_Section").then((res) => res.data),
  });
  const {
    data: Our_ClassesData,
    isLoading: Our_ClassesDataIsLoading,
    error: Our_ClassesDataError,
  } = useQuery({
    queryKey: ["Our_Classes"],
    queryFn: () => axiosPublic.get("/Our_Classes").then((res) => res.data),
  });
  const {
    data: Class_DetailsData,
    isLoading: Class_DetailsDataIsLoading,
    error: Class_DetailsDataError,
  } = useQuery({
    queryKey: ["Class_Details"],
    queryFn: () => axiosPublic.get("/Class_Details").then((res) => res.data),
  });
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["Trainers"],
    queryFn: () => axiosPublic.get("/Trainers").then((res) => res.data),
  });
  const {
    data: TestimonialsData,
    isLoading: TestimonialsDataIsLoading,
    error: TestimonialsDataError,
  } = useQuery({
    queryKey: ["Testimonials"],
    queryFn: () => axiosPublic.get("/Testimonials").then((res) => res.data),
  });
  const {
    data: GalleryData,
    isLoading: GalleryDataIsLoading,
    error: GalleryDataError,
  } = useQuery({
    queryKey: ["Gallery"],
    queryFn: () => axiosPublic.get("/Gallery").then((res) => res.data),
  });
  const {
    data: PromotionsData,
    isLoading: PromotionsDataIsLoading,
    error: PromotionsDataError,
  } = useQuery({
    queryKey: ["Promotions"],
    queryFn: () => axiosPublic.get("/Promotions").then((res) => res.data),
  });
  const {
    data: Gym_FeaturesData,
    isLoading: Gym_FeaturesDataIsLoading,
    error: Gym_FeaturesDataError,
  } = useQuery({
    queryKey: ["Gym_Features"],
    queryFn: () => axiosPublic.get("/Gym_Features").then((res) => res.data),
  });

  // Check if any data is loading
  const isLoading = [
    Home_Banner_SectionDataIsLoading,
    Home_Welcome_SectionDataIsLoading,
    Home_Services_SectionDataIsLoading,
    Our_ClassesDataIsLoading,
    Class_DetailsDataIsLoading,
    TrainersDataIsLoading,
    TestimonialsDataIsLoading,
    GalleryDataIsLoading,
    PromotionsDataIsLoading,
    Gym_FeaturesDataIsLoading,
  ].some(Boolean); // Use Array.some to check if any value is true

  // Check if any error occurred
  const hasError = [
    Home_Banner_SectionDataError,
    Home_Welcome_SectionDataError,
    Home_Services_SectionDataError,
    Our_ClassesDataError,
    Class_DetailsDataError,
    TrainersDataError,
    TestimonialsDataError,
    GalleryDataError,
    PromotionsDataError,
    Gym_FeaturesDataError,
  ].some(Boolean); // Use Array.some to check if any value is true

  // Loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <FetchingError />;
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Render components with their respective data */}
      <BannerSection homeBannerData={Home_Banner_SectionData} />
      <WelcomeSection homeWelcomeData={Home_Welcome_SectionData} />
      <OurServices homeServicesData={Home_Services_SectionData} />
      <ClassSchedule
        ourClasses={Our_ClassesData}
        classDetails={Class_DetailsData}
      />
      <FeaturedTrainers trainersData={TrainersData} />
      <GalleryPreview galleryData={GalleryData} />
      <PromotionsSection promotionsData={PromotionsData} />
      <GymFeatures gymFeaturesData={Gym_FeaturesData} />
      <Testimonials testimonialsData={TestimonialsData} />
      <CallToAction />
    </div>
  );
};

export default Home;
