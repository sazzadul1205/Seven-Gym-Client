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
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Shared/Loading/Loading";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching Home_Banner_Section Data
  const {
    data: Home_Banner_SectionData,
    isLoading: Home_Banner_SectionDataIsLoading,
    error: Home_Banner_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Banner_SectionData"],
    queryFn: () =>
      axiosPublic.get(`/Home_Banner_Section`).then((res) => res.data),
  });

  // Fetching Home_Welcome_Section Data
  const {
    data: Home_Welcome_SectionData,
    isLoading: Home_Welcome_SectionDataIsLoading,
    error: Home_Welcome_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Welcome_SectionData"],
    queryFn: () =>
      axiosPublic.get(`/Home_Welcome_Section`).then((res) => res.data),
  });

  // Fetching Home_Services_Section Data
  const {
    data: Home_Services_SectionData,
    isLoading: Home_Services_SectionDataIsLoading,
    error: Home_Services_SectionDataError,
  } = useQuery({
    queryKey: ["Home_Services_SectionData"],
    queryFn: () =>
      axiosPublic.get(`/Home_Services_Section`).then((res) => res.data),
  });

  // Fetching Our_Classes Data
  const {
    data: Our_ClassesData,
    isLoading: Our_ClassesDataIsLoading,
    error: Our_ClassesDataError,
  } = useQuery({
    queryKey: ["Our_ClassesData"],
    queryFn: () => axiosPublic.get(`/Our_Classes`).then((res) => res.data),
  });

  // Fetching Class_Details Data
  const {
    data: Class_DetailsData,
    isLoading: Class_DetailsDataIsLoading,
    error: Class_DetailsDataError,
  } = useQuery({
    queryKey: ["Class_DetailsData"],
    queryFn: () => axiosPublic.get(`/Class_Details`).then((res) => res.data),
  });

  // Fetching Trainers Data
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["TrainersData"],
    queryFn: () => axiosPublic.get(`/Trainers`).then((res) => res.data),
  });

  // Fetching Testimonials Data
  const {
    data: TestimonialsData,
    isLoading: TestimonialsDataIsLoading,
    error: TestimonialsDataError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });

  // Fetching Gallery Data
  const {
    data: GalleryData,
    isLoading: GalleryDataIsLoading,
    error: GalleryDataError,
  } = useQuery({
    queryKey: ["GalleryData"],
    queryFn: () => axiosPublic.get(`/Gallery`).then((res) => res.data),
  });

  // Fetching Promotions Data
  const {
    data: PromotionsData,
    isLoading: PromotionsDataIsLoading,
    error: PromotionsDataError,
  } = useQuery({
    queryKey: ["PromotionsData"],
    queryFn: () => axiosPublic.get(`/Promotions`).then((res) => res.data),
  });

  // Fetching Gym_Features Data
  const {
    data: Gym_FeaturesData,
    isLoading: Gym_FeaturesDataIsLoading,
    error: Gym_FeaturesDataError,
  } = useQuery({
    queryKey: ["Gym_FeaturesData"],
    queryFn: () => axiosPublic.get(`/Gym_Features`).then((res) => res.data),
  });

  // Loading and error states (render below hooks)
  if (
    Home_Banner_SectionDataIsLoading ||
    Home_Welcome_SectionDataIsLoading ||
    Home_Services_SectionDataIsLoading ||
    Our_ClassesDataIsLoading ||
    Class_DetailsDataIsLoading ||
    TrainersDataIsLoading ||
    TestimonialsDataIsLoading ||
    GalleryDataIsLoading ||
    PromotionsDataIsLoading ||
    Gym_FeaturesDataIsLoading
  ) {
    return <Loading />;
  }

  if (
    Home_Banner_SectionDataError ||
    Home_Welcome_SectionDataError ||
    Home_Services_SectionDataError ||
    Our_ClassesDataError ||
    Class_DetailsDataError ||
    TrainersDataError ||
    TestimonialsDataError ||
    GalleryDataError ||
    PromotionsDataError ||
    Gym_FeaturesDataError
  ) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
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
      <BannerSection homeBannerData={Home_Banner_SectionData} />
      <WelcomeSection homeWelcomeData={Home_Welcome_SectionData} />
      <Highlights homeServicesData={Home_Services_SectionData} />
      <ClassSchedule
        ourClasses={Our_ClassesData}
        classDetails={Class_DetailsData}
      />
      <FeaturedTrainers trainersData={TrainersData} />
      <Testimonials testimonialsData={TestimonialsData} />
      <GalleryPreview galleryData={GalleryData} />
      <PromotionsSection promotionsData={PromotionsData} />
      <GymFeatures gymFeaturesData={Gym_FeaturesData} />
      <CallToAction />
    </div>
  );
};

export default Home;
