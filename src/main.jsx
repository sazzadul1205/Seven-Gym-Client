// CSS Import
import "./index.css";

import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import HomePageLayout from "./Layouts/HomePageLayout.jsx";
import PublicPageLayout from "./Layouts/PublicPageLayout.jsx";

// Auth Provider
import AuthProvider from "./Providers/AuthProviders.jsx";

// Route Links
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";

// Auth Import
import Login from "./Pages/(Auth)/Login/Login.jsx";
import SignUp from "./Pages/(Auth)/SignUp/SignUp.jsx";
import SignUpDetails from "./Pages/(Auth)/SignUpDetails/SignUpDetails.jsx";

// Public Pages Import
import Home from "./Pages/(PublicPages)/Home/Home.jsx";
import Gallery from "./Pages/(PublicPages)/Gallery/Gallery.jsx";
import Community from "./Pages/(PublicPages)/Community/Community.jsx";
import AboutUs from "./Pages/(PublicPages)/(About)/AboutUs/AboutUs.jsx";
import Classes from "./Pages/(PublicPages)/(Classes)/Classes/Classes.jsx";
import Feedback from "./Pages/(PublicPages)/(About)/Feedback/Feedback.jsx";
import Trainers from "./Pages/(PublicPages)/(Trainers)/Trainers/Trainers.jsx";
import OurMission from "./Pages/(PublicPages)/(About)/OurMission/OurMission.jsx";
import ClassesDetails from "./Pages/(PublicPages)/(Classes)/ClassesDetails/ClassesDetails.jsx";
import TrainersDetails from "./Pages/(PublicPages)/(Trainers)/TrainersDetails/TrainersDetails.jsx";
import TestimonialsPage from "./Pages/(PublicPages)/(About)/TestimonialsPage/TestimonialsPage.jsx";
import TrainersBookings from "./Pages/(PublicPages)/(Trainers)/TrainersBookings/TrainersBookings.jsx";

// User Pages Import
import UserProfile from "./Pages/(UserPages)/UserProfile/UserProfile.jsx";
import UserSettings from "./Pages/(UserPages)/UserSettings/UserSettings.jsx";
import UserTierUpgrade from "./Pages/(UserPages)/UserTierUpgrade/UserTierUpgrade.jsx";
import TermsOfService from "./Pages/(PublicPages)/(About)/TermsOfService/TermsOfService.jsx";
import TearUpgradePayment from "./Pages/(UserPages)/TierUpgradePayment/TierUpgradePayment.jsx";
import UserClassManagement from "./Pages/(UserPages)/UserClassManagement/UserClassManagement.jsx";
import UserSchedulePlanner from "./Pages/(UserPages)/UserSchedulePlanner/UserSchedulePlanner.jsx";
import UserTrainerManagement from "./Pages/(UserPages)/UserTrainerManagement/UserTrainerManagement.jsx";
import UserTrainerSessionPayment from "./Pages/(UserPages)/UserTrainerSessionPayment/UserTrainerSessionPayment.jsx";

// Trainer Pages Import
import TrainerSettingsLayout from "./Layouts/TrainerSettingsLayout.jsx";

// Private Route
import MemberPrivateRoute from "./Routes/MemberPrivateRoute.jsx";
import TrainerPrivateRoute from "./Routes/TrainerPrivateRoute.jsx";
import ClassManagerPrivateRoute from "./Routes/ClassManagerPrivateRoute.jsx";

// UnAuthorizes Page
import UnauthorizedPage from "./Pages/UnauthorizedPage/UnauthorizedPage.jsx";

// Admin Panel Page
import AdminPanelLayout from "./Layouts/AdminPanelLayout.jsx";

// Banned Page
import BannedPage from "./Pages/BannedPage/BannedPage.jsx";
import AdminPrivateRoute from "./Routes/AdminPrivateRoute.jsx";
import ScrollToTop from "./Routes/ScrollToTop.jsx";
import ClassManagementLayout from "./Layouts/ClassManagementLayout.jsx";

// React Query Client
const queryClient = new QueryClient();

// React DOM Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Page Not Found */}
            <Route path="*" element={<PageNotFound />} />

            <Route path="/Banned/:email" element={<BannedPage />} />

            <Route path="/Unauthorized" element={<UnauthorizedPage />} />

            {/* Home Page Layout */}
            <Route element={<HomePageLayout />}>
              {/* Auth Pages Links */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SignUpDetails />} />

              {/* Home Pages Link */}
              <Route path="/" element={<Home />} />
            </Route>

            {/* Public Page Layouts */}
            <Route element={<PublicPageLayout />}>
              <Route path="/Gallery" element={<Gallery />} />
              <Route path="/Trainers" element={<Trainers />} />
              <Route path="/Trainers/:name" element={<TrainersDetails />} />
              <Route
                path="/Trainers/Booking/:name"
                element={
                  <MemberPrivateRoute>
                    <TrainersBookings />
                  </MemberPrivateRoute>
                }
              />
              <Route path="/Classes" element={<Classes />} />
              <Route path="/Classes/:module" element={<ClassesDetails />} />
              <Route path="/CommunityPosts" element={<Community />} />
              <Route path="/About/OurMission" element={<OurMission />} />
              <Route
                path="/About/Testimonials"
                element={<TestimonialsPage />}
              />
              <Route path="/About/AboutUs" element={<AboutUs />} />
              <Route path="/About/Feedback" element={<Feedback />} />
              <Route
                path="/About/TermsOfServices"
                element={<TermsOfService />}
              />

              {/* User Pages Links */}

              <Route
                path="/User/UserProfile/:email"
                element={
                  <MemberPrivateRoute>
                    <UserProfile />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/User/UserSettings"
                element={
                  <MemberPrivateRoute>
                    <UserSettings />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/User/TierUpgrade/:email"
                element={
                  <MemberPrivateRoute>
                    <UserTierUpgrade />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/User/TierUpgradePayment/:email/:tier"
                element={
                  <MemberPrivateRoute>
                    <TearUpgradePayment />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/User/UserSchedule/:email"
                element={
                  <MemberPrivateRoute>
                    <UserSchedulePlanner />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/User/UserTrainerManagement"
                element={
                  <MemberPrivateRoute>
                    <UserTrainerManagement />
                  </MemberPrivateRoute>
                }
              />

              <Route
                path="/User/UserClassManagement"
                element={
                  <MemberPrivateRoute>
                    <UserClassManagement />
                  </MemberPrivateRoute>
                }
              />

              <Route
                path="/User/UserTrainerSessionPayment/:id"
                element={
                  <MemberPrivateRoute>
                    <UserTrainerSessionPayment />
                  </MemberPrivateRoute>
                }
              />
            </Route>

            {/* Trainer Page Links */}
            <Route
              path="/Trainer"
              element={
                <TrainerPrivateRoute>
                  <TrainerSettingsLayout />
                </TrainerPrivateRoute>
              }
            />

            {/* Admin Page Links */}
            <Route
              path="/Admin"
              element={
                <AdminPrivateRoute>
                  <AdminPanelLayout />
                </AdminPrivateRoute>
              }
            />

            {/* Class Management */}
            <Route
              path="/Class_Management"
              element={
                <ClassManagerPrivateRoute>
                  <ClassManagementLayout />
                </ClassManagerPrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);

// const FAKE_DATE_STRING = "2025-06-20"; // 👈 your custom date (YYYY-MM-DD)

// (function overrideDateWithRealTime() {
//   const OriginalDate = Date;

//   class MixedDate extends OriginalDate {
//     constructor(...args) {
//       if (args.length === 0) {
//         const now = new OriginalDate();
//         const fakeDateTimeString = `${FAKE_DATE_STRING}T${
//           now.toTimeString().split(" ")[0]
//         }`;
//         return new OriginalDate(fakeDateTimeString);
//       }
//       return new OriginalDate(...args);
//     }

//     static now() {
//       const now = new OriginalDate();
//       const fakeDateTimeString = `${FAKE_DATE_STRING}T${
//         now.toTimeString().split(" ")[0]
//       }`;
//       return new OriginalDate(fakeDateTimeString).getTime();
//     }

//     static parse(...args) {
//       return OriginalDate.parse(...args);
//     }

//     static UTC(...args) {
//       return OriginalDate.UTC(...args);
//     }
//   }

//   window.Date = MixedDate;

//   console.warn(
//     "📆 Date is now faked to:",
//     new Date().toString(),
//     "| Date Part:",
//     FAKE_DATE_STRING,
//     "| Time Part: Real system time"
//   );
// })();
