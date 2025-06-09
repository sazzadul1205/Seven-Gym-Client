import { useQuery } from "@tanstack/react-query";

// Import Components
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
import HomeBackground from "../../../assets/Home-Background/Home-Background.jpeg";

// Import Hooks
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch Home Banner Section Data
  const {
    data: HomeBannerSectionData,
    isLoading: HomeBannerSectionIsLoading,
    error: HomeBannerSectionError,
  } = useQuery({
    queryKey: ["HomeBannerSection"],
    queryFn: () =>
      axiosPublic.get("/Home_Banner_Section").then((res) => res.data),
  });

  // Fetch Home Welcome Section Data
  const {
    data: HomeWelcomeSectionData,
    isLoading: HomeWelcomeSectionIsLoading,
    error: HomeWelcomeSectionError,
  } = useQuery({
    queryKey: ["HomeWelcomeSection"],
    queryFn: () =>
      axiosPublic.get("/Home_Welcome_Section").then((res) => res.data),
  });

  // Fetch Home Services Section Data
  const {
    data: HomeServicesSectionData,
    isLoading: HomeServicesSectionIsLoading,
    error: HomeServicesSectionError,
  } = useQuery({
    queryKey: ["HomeServicesSection"],
    queryFn: () =>
      axiosPublic.get("/Home_Services_Section").then((res) => res.data),
  });

  // Fetch Our Classes Data
  const {
    data: OurClassesData,
    isLoading: OurClassesIsLoading,
    error: OurClassesError,
  } = useQuery({
    queryKey: ["OurClasses"],
    queryFn: () => axiosPublic.get("/Our_Classes").then((res) => res.data),
  });

  // Fetch Class Details Data
  const {
    data: ClassDetailsData,
    isLoading: ClassDetailsIsLoading,
    error: ClassDetailsError,
  } = useQuery({
    queryKey: ["ClassDetails"],
    queryFn: () => axiosPublic.get("/Class_Details").then((res) => res.data),
  });

  // Fetch Trainers Data
  const {
    data: TrainersData,
    isLoading: TrainersIsLoading,
    error: TrainersError,
  } = useQuery({
    queryKey: ["Trainers"],
    queryFn: () => axiosPublic.get("/Trainers").then((res) => res.data),
  });

  // Fetch Testimonials Data
  const {
    data: TestimonialsData,
    isLoading: TestimonialsIsLoading,
    error: TestimonialsError,
  } = useQuery({
    queryKey: ["Testimonials"],
    queryFn: () => axiosPublic.get("/Testimonials").then((res) => res.data),
  });

  // Fetch Gallery Data
  const {
    data: GalleryData,
    isLoading: GalleryIsLoading,
    error: GalleryError,
  } = useQuery({
    queryKey: ["Gallery"],
    queryFn: () => axiosPublic.get("/Gallery").then((res) => res.data),
  });

  // Fetch Promotions Data
  const {
    data: PromotionsData,
    isLoading: PromotionsIsLoading,
    error: PromotionsError,
  } = useQuery({
    queryKey: ["Promotions"],
    queryFn: () => axiosPublic.get("/Promotions").then((res) => res.data),
  });

  // Fetch GymFeatures Data
  const {
    data: GymFeaturesData,
    isLoading: GymFeaturesIsLoading,
    error: GymFeaturesError,
  } = useQuery({
    queryKey: ["GymFeatures"],
    queryFn: () => axiosPublic.get("/Gym_Features").then((res) => res.data),
  });

  // Is Loading States
  if (
    GalleryIsLoading ||
    TrainersIsLoading ||
    PromotionsIsLoading ||
    OurClassesIsLoading ||
    GymFeaturesIsLoading ||
    TestimonialsIsLoading ||
    ClassDetailsIsLoading ||
    HomeBannerSectionIsLoading ||
    HomeWelcomeSectionIsLoading ||
    HomeServicesSectionIsLoading
  ) {
    return <Loading />;
  }

  // Error States
  if (
    GalleryError ||
    TrainersError ||
    PromotionsError ||
    OurClassesError ||
    GymFeaturesError ||
    TestimonialsError ||
    ClassDetailsError ||
    HomeBannerSectionError ||
    HomeWelcomeSectionError ||
    HomeServicesSectionError
  ) {
    return <FetchingError />;
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${HomeBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BannerSection homeBannerData={HomeBannerSectionData} />
      <WelcomeSection homeWelcomeData={HomeWelcomeSectionData} />
      <OurServices homeServicesData={HomeServicesSectionData} />
      <ClassSchedule
        ourClasses={OurClassesData}
        classDetails={ClassDetailsData}
      />
      <FeaturedTrainers trainersData={TrainersData} />
      <GalleryPreview galleryData={GalleryData} />
      <PromotionsSection promotionsData={PromotionsData} />
      <GymFeatures gymFeaturesData={GymFeaturesData} />
      <Testimonials testimonialsData={TestimonialsData} />
      <CallToAction />
    </div>
  );
};

export default Home;
