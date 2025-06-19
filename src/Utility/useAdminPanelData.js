import useAuth from "../Hooks/useAuth";
import useFetchData from "./useFetchData";

const useAdminPanelData = () => {
  const { user } = useAuth();

  // 1. All Users
  const {
    data: AllUsersData,
    isLoading: AllUsersIsLoading,
    error: AllUsersError,
    refetch: AllUsersRefetch,
  } = useFetchData("AllUsersData", "/Users");

  // 2. All Trainers
  const {
    data: AllTrainersData,
    isLoading: AllTrainersIsLoading,
    error: AllTrainersError,
    refetch: AllTrainersRefetch,
  } = useFetchData("AllTrainersData", "/Trainers");

  // 3. Tier Upgrade Payment
  const {
    data: TierUpgradePaymentData,
    isLoading: TierUpgradePaymentIsLoading,
    error: TierUpgradePaymentError,
    refetch: TierUpgradePaymentRefetch,
  } = useFetchData("TierUpgradePaymentData", "/Tier_Upgrade_Payment");

  // 4. Tier Upgrade Refund
  const {
    data: TierUpgradeRefundData,
    isLoading: TierUpgradeRefundIsLoading,
    error: TierUpgradeRefundError,
    refetch: TierUpgradeRefundRefetch,
  } = useFetchData("TierUpgradeRefundData", "/Tier_Upgrade_Refund");

  // 5. Daily Tier Upgrade Payment
  const {
    data: DailyTierUpgradePaymentData,
    isLoading: DailyTierUpgradePaymentIsLoading,
    error: DailyTierUpgradePaymentError,
    refetch: DailyTierUpgradePaymentRefetch,
  } = useFetchData(
    "DailyTierUpgradePaymentData",
    "/Tier_Upgrade_Payment/DailyStatus"
  );

  // 6. Daily Tier Upgrade Refund
  const {
    data: DailyTierUpgradeRefundData,
    isLoading: DailyTierUpgradeRefundIsLoading,
    error: DailyTierUpgradeRefundError,
    refetch: DailyTierUpgradeRefundRefetch,
  } = useFetchData(
    "DailyTierUpgradeRefundData",
    "/Tier_Upgrade_Refund/DailyStatus"
  );

  // 7. Trainer Session Payment
  const {
    data: TrainerSessionPaymentData,
    isLoading: TrainerSessionPaymentIsLoading,
    error: TrainerSessionPaymentError,
    refetch: TrainerSessionPaymentRefetch,
  } = useFetchData("TrainerSessionPaymentData", "/Trainer_Session_Payment");

  // 8. Trainer Session Refund
  const {
    data: TrainerSessionRefundData,
    isLoading: TrainerSessionRefundIsLoading,
    error: TrainerSessionRefundError,
    refetch: TrainerSessionRefundRefetch,
  } = useFetchData("TrainerSessionRefundData", "/Trainer_Session_Refund");

  // 9. Trainer Session Active
  const {
    data: TrainerSessionActiveData,
    isLoading: TrainerSessionActiveIsLoading,
    error: TrainerSessionActiveError,
    refetch: TrainerSessionActiveRefetch,
  } = useFetchData(
    "TrainerSessionActiveData",
    "/Trainer_Session_Completed_&_Active/ActiveSessions"
  );

  // 10. Trainer Session Completed
  const {
    data: TrainerSessionCompletedData,
    isLoading: TrainerSessionCompletedIsLoading,
    error: TrainerSessionCompletedError,
    refetch: TrainerSessionCompletedRefetch,
  } = useFetchData(
    "TrainerSessionCompletedData",
    "/Trainer_Session_Completed_&_Active/CompletedSessions"
  );

  // 11. Trainer Session Payment Status
  const {
    data: TrainerSessionPaymentStatusData,
    isLoading: TrainerSessionPaymentStatusIsLoading,
    error: TrainerSessionPaymentStatusError,
    refetch: TrainerSessionPaymentStatusRefetch,
  } = useFetchData(
    "TrainerSessionPaymentStatusData",
    "/Trainer_Session_Payment/DailyStats"
  );

  // 12. Trainer Session Refund Status
  const {
    data: TrainerSessionRefundStatusData,
    isLoading: TrainerSessionRefundStatusIsLoading,
    error: TrainerSessionRefundStatusError,
    refetch: TrainerSessionRefundStatusRefetch,
  } = useFetchData(
    "TrainerSessionRefundStatusData",
    "/Trainer_Session_Refund/DailyStats"
  );

  // 13. Trainer Session Active Status
  const {
    data: TrainerSessionActiveStatusData,
    isLoading: TrainerSessionActiveStatusIsLoading,
    error: TrainerSessionActiveStatusError,
    refetch: TrainerSessionActiveStatusRefetch,
  } = useFetchData(
    "TrainerSessionActiveStatusData",
    "/Trainer_Session_Completed_&_Active/ActiveSessions/DailyStatus"
  );

  // 14. Trainer Session Completed Status
  const {
    data: TrainerSessionCompletedStatusData,
    isLoading: TrainerSessionCompletedStatusIsLoading,
    error: TrainerSessionCompletedStatusError,
    refetch: TrainerSessionCompletedStatusRefetch,
  } = useFetchData(
    "TrainerSessionCompletedStatusData",
    "/Trainer_Session_Completed_&_Active/CompletedSessions/DailyStatus"
  );

  // 15. All Trainer Booking Accepted
  const {
    data: AllTrainerBookingAcceptedData,
    isLoading: AllTrainerBookingAcceptedIsLoading,
    error: AllTrainerBookingAcceptedError,
    refetch: AllTrainerBookingAcceptedRefetch,
  } = useFetchData(
    "AllTrainerBookingAcceptedData",
    "/Trainer_Booking_Accepted"
  );

  // 16. All Trainer Booking History
  const {
    data: AllTrainerBookingHistoryData,
    isLoading: AllTrainerBookingHistoryIsLoading,
    error: AllTrainerBookingHistoryError,
    refetch: AllTrainerBookingHistoryRefetch,
  } = useFetchData("AllTrainerBookingHistoryData", "/Trainer_Booking_History");

  // 17. All Trainer Booking Request
  const {
    data: AllTrainerBookingRequestData,
    isLoading: AllTrainerBookingRequestIsLoading,
    error: AllTrainerBookingRequestError,
    refetch: AllTrainerBookingRequestRefetch,
  } = useFetchData("AllTrainerBookingRequestData", "/Trainer_Booking_Request");

  // 18. All Trainer Booking Completed
  const {
    data: AllTrainerBookingCompletedData,
    isLoading: AllTrainerBookingCompletedIsLoading,
    error: AllTrainerBookingCompletedError,
    refetch: AllTrainerBookingCompletedRefetch,
  } = useFetchData(
    "AllTrainerBookingCompletedData",
    "/Trainer_Booking_History/Completed"
  );

  // 19. All Trainer Booking Cancelled
  const {
    data: AllTrainerBookingCancelledData,
    isLoading: AllTrainerBookingCancelledIsLoading,
    error: AllTrainerBookingCancelledError,
    refetch: AllTrainerBookingCancelledRefetch,
  } = useFetchData(
    "AllTrainerBookingCancelledData",
    "/Trainer_Booking_History/Cancelled"
  );

  // 20. Trainer Booking Accepted Status
  const {
    data: TrainerBookingAcceptedStatusData,
    isLoading: TrainerBookingAcceptedStatusIsLoading,
    error: TrainerBookingAcceptedStatusError,
    refetch: TrainerBookingAcceptedStatusRefetch,
  } = useFetchData(
    "TrainerBookingAcceptedStatusData",
    "/Trainer_Booking_Accepted/DailyStatus"
  );

  // 21. Trainer Booking Request Status
  const {
    data: TrainerBookingRequestStatusData,
    isLoading: TrainerBookingRequestStatusIsLoading,
    error: TrainerBookingRequestStatusError,
    refetch: TrainerBookingRequestStatusRefetch,
  } = useFetchData(
    "TrainerBookingRequestStatusData",
    "/Trainer_Booking_Request/DailyStatus"
  );

  // 22. Fetch Trainer Booking Completed Status Data
  const {
    data: TrainerBookingCompletedStatusData,
    isLoading: TrainerBookingCompletedStatusIsLoading,
    error: TrainerBookingCompletedStatusError,
    refetch: TrainerBookingCompletedStatusRefetch,
  } = useFetchData(
    "TrainerBookingCompletedStatusData",
    "/Trainer_Booking_History/Completed/DailyStatus"
  );

  // 23. Fetch Trainer Booking Cancelled Status Data
  const {
    data: TrainerBookingCancelledStatusData,
    isLoading: TrainerBookingCancelledStatusIsLoading,
    error: TrainerBookingCancelledStatusError,
    refetch: TrainerBookingCancelledStatusRefetch,
  } = useFetchData(
    "TrainerBookingCancelledStatusData",
    "/Trainer_Booking_History/Cancelled/DailyStatus"
  );

  // 24. Fetch Trainers Schedule Data
  const {
    data: TrainersScheduleData,
    isLoading: TrainersScheduleIsLoading,
    error: TrainersScheduleError,
    refetch: TrainersScheduleRefetch,
  } = useFetchData("TrainersScheduleData", "/Trainers_Schedule");

  // 25. Fetch Home Banner Section
  const {
    data: HomeBannerSectionData,
    isLoading: HomeBannerSectionIsLoading,
    error: HomeBannerSectionError,
    refetch: HomeBannerSectionRefetch,
  } = useFetchData("HomeBannerSection", "/Home_Banner_Section");

  // 26. Fetch Home Welcome Section
  const {
    data: HomeWelcomeSectionData,
    isLoading: HomeWelcomeSectionIsLoading,
    error: HomeWelcomeSectionError,
    refetch: HomeWelcomeSectionRefetch,
  } = useFetchData("HomeWelcomeSection", "/Home_Welcome_Section");

  // 27. Fetch Home Services Section
  const {
    data: HomeServicesSectionData,
    isLoading: HomeServicesSectionIsLoading,
    error: HomeServicesSectionError,
    refetch: HomeServicesSectionRefetch,
  } = useFetchData("HomeServicesSection", "/Home_Services_Section");

  // 28. Fetch Gallery
  const {
    data: GalleryData,
    isLoading: GalleryIsLoading,
    error: GalleryError,
    refetch: GalleryRefetch,
  } = useFetchData("GalleryData", "/Gallery");

  // 29. Fetch Promotions
  const {
    data: PromotionsData,
    isLoading: PromotionsIsLoading,
    error: PromotionsError,
    refetch: PromotionsRefetch,
  } = useFetchData("PromotionsData", "/Promotions");

  // 30. Fetch Gym Features
  const {
    data: GymFeaturesData,
    isLoading: GymFeaturesIsLoading,
    error: GymFeaturesError,
    refetch: GymFeaturesRefetch,
  } = useFetchData("GymFeaturesData", "/Gym_Features");

  // 31. Fetch Testimonials
  const {
    data: TestimonialsData,
    isLoading: TestimonialsIsLoading,
    error: TestimonialsError,
    refetch: TestimonialsRefetch,
  } = useFetchData("TestimonialsData", "/Testimonials");

  // 32. Fetch Community Posts
  const {
    data: CommunityPostsData,
    isLoading: CommunityPostsIsLoading,
    error: CommunityPostsError,
    refetch: CommunityPostsRefetch,
  } = useFetchData("CommunityPostsData", "/CommunityPosts");

  // 32. Fetch Feedback
  const {
    data: FeedbackData,
    isLoading: FeedbackIsLoading,
    error: FeedbackError,
    refetch: FeedbackRefetch,
  } = useFetchData("FeedbackData", "/Feedback");

  // 33. Fetch Feedback
  const {
    data: OurMissionsData,
    isLoading: OurMissionsIsLoading,
    error: OurMissionsError,
    refetch: OurMissionsRefetch,
  } = useFetchData("OurMissionsData", "/Our_Missions");

  // 34. Fetch Feedback
  const {
    data: AboutUsData,
    isLoading: AboutUsIsLoading,
    error: AboutUsError,
    refetch: AboutUsRefetch,
  } = useFetchData("AboutUsData", "/AboutUs");

  // 35. Fetch Terms Of Service
  const {
    data: TermsOfServiceData,
    isLoading: TermsOfServiceIsLoading,
    error: TermsOfServiceError,
    refetch: TermsOfServiceRefetch,
  } = useFetchData("TermsOfServiceData", "/Terms_Of_Service");

  // 35. Fetch Terms Of Service
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
    refetch: UserRefetch,
  } = useFetchData("UserData", `/Users?email=${user?.email}`);

  // Unified refetch function
  const refetchAll = async () => {
    await UserRefetch();
    await GalleryRefetch();
    await AboutUsRefetch();
    await AllUsersRefetch();
    await FeedbackRefetch();
    await PromotionsRefetch();
    await OurMissionsRefetch();
    await AllTrainersRefetch();
    await GymFeaturesRefetch();
    await TestimonialsRefetch();
    await CommunityPostsRefetch();
    await TermsOfServiceRefetch();
    await TrainersScheduleRefetch();
    await HomeBannerSectionRefetch();
    await TierUpgradeRefundRefetch();
    await TierUpgradePaymentRefetch();
    await HomeWelcomeSectionRefetch();
    await HomeServicesSectionRefetch();
    await TrainerSessionRefundRefetch();
    await TrainerSessionActiveRefetch();
    await TrainerSessionPaymentRefetch();
    await DailyTierUpgradeRefundRefetch();
    await DailyTierUpgradePaymentRefetch();
    await TrainerSessionCompletedRefetch();
    await AllTrainerBookingHistoryRefetch();
    await AllTrainerBookingRequestRefetch();
    await AllTrainerBookingAcceptedRefetch();
    await TrainerSessionRefundStatusRefetch();
    await TrainerSessionActiveStatusRefetch();
    await AllTrainerBookingCompletedRefetch();
    await AllTrainerBookingCancelledRefetch();
    await TrainerBookingRequestStatusRefetch();
    await TrainerSessionPaymentStatusRefetch();
    await TrainerBookingAcceptedStatusRefetch();
    await TrainerSessionCompletedStatusRefetch();
    await TrainerBookingCompletedStatusRefetch();
    await TrainerBookingCancelledStatusRefetch();
  };

  const isLoading =
    UserIsLoading ||
    GalleryIsLoading ||
    AboutUsIsLoading ||
    AllUsersIsLoading ||
    FeedbackIsLoading ||
    PromotionsIsLoading ||
    AllTrainersIsLoading ||
    OurMissionsIsLoading ||
    GymFeaturesIsLoading ||
    TestimonialsIsLoading ||
    TermsOfServiceIsLoading ||
    CommunityPostsIsLoading ||
    TrainersScheduleIsLoading ||
    TierUpgradeRefundIsLoading ||
    HomeBannerSectionIsLoading ||
    TierUpgradePaymentIsLoading ||
    HomeWelcomeSectionIsLoading ||
    HomeServicesSectionIsLoading ||
    TrainerSessionRefundIsLoading ||
    TrainerSessionActiveIsLoading ||
    TrainerSessionPaymentIsLoading ||
    DailyTierUpgradeRefundIsLoading ||
    TrainerSessionCompletedIsLoading ||
    DailyTierUpgradePaymentIsLoading ||
    AllTrainerBookingHistoryIsLoading ||
    AllTrainerBookingRequestIsLoading ||
    AllTrainerBookingAcceptedIsLoading ||
    TrainerSessionRefundStatusIsLoading ||
    TrainerSessionActiveStatusIsLoading ||
    AllTrainerBookingCompletedIsLoading ||
    AllTrainerBookingCancelledIsLoading ||
    TrainerSessionPaymentStatusIsLoading ||
    TrainerBookingRequestStatusIsLoading ||
    TrainerBookingAcceptedStatusIsLoading ||
    TrainerSessionCompletedStatusIsLoading ||
    TrainerBookingCompletedStatusIsLoading ||
    TrainerBookingCancelledStatusIsLoading;

  const error =
    UserError ||
    GalleryError ||
    AboutUsError ||
    AllUsersError ||
    FeedbackError ||
    PromotionsError ||
    AllTrainersError ||
    OurMissionsError ||
    GymFeaturesError ||
    TestimonialsError ||
    TermsOfServiceError ||
    CommunityPostsError ||
    TrainersScheduleError ||
    HomeBannerSectionError ||
    TierUpgradeRefundError ||
    TierUpgradePaymentError ||
    HomeWelcomeSectionError ||
    HomeServicesSectionError ||
    TrainerSessionRefundError ||
    TrainerSessionActiveError ||
    TrainerSessionPaymentError ||
    DailyTierUpgradeRefundError ||
    TrainerSessionCompletedError ||
    DailyTierUpgradePaymentError ||
    AllTrainerBookingHistoryError ||
    AllTrainerBookingRequestError ||
    AllTrainerBookingAcceptedError ||
    TrainerSessionRefundStatusError ||
    TrainerSessionActiveStatusError ||
    AllTrainerBookingCompletedError ||
    AllTrainerBookingCancelledError ||
    TrainerSessionPaymentStatusError ||
    TrainerBookingRequestStatusError ||
    TrainerBookingAcceptedStatusError ||
    TrainerSessionCompletedStatusError ||
    TrainerBookingCompletedStatusError ||
    TrainerBookingCancelledStatusError;

  return {
    // Is Loading States
    isLoading,

    // Error States
    error,

    // Data State
    UserData,
    GalleryData,
    AboutUsData,
    AllUsersData,
    FeedbackData,
    PromotionsData,
    GymFeaturesData,
    OurMissionsData,
    AllTrainersData,
    TestimonialsData,
    TermsOfServiceData,
    CommunityPostsData,
    TrainersScheduleData,
    HomeBannerSectionData,
    TierUpgradeRefundData,
    HomeWelcomeSectionData,
    TierUpgradePaymentData,
    HomeServicesSectionData,
    TrainerSessionRefundData,
    TrainerSessionActiveData,
    TrainerSessionPaymentData,
    DailyTierUpgradeRefundData,
    DailyTierUpgradePaymentData,
    TrainerSessionCompletedData,
    AllTrainerBookingRequestData,
    AllTrainerBookingHistoryData,
    AllTrainerBookingAcceptedData,
    TrainerSessionRefundStatusData,
    TrainerSessionActiveStatusData,
    AllTrainerBookingCompletedData,
    AllTrainerBookingCancelledData,
    TrainerSessionPaymentStatusData,
    TrainerBookingRequestStatusData,
    TrainerBookingAcceptedStatusData,
    TrainerSessionCompletedStatusData,
    TrainerBookingCompletedStatusData,
    TrainerBookingCancelledStatusData,

    refetchAll,
  };
};

export default useAdminPanelData;
