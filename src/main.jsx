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
import Forums from "./Pages/(PublicPages)/Forums/Forums.jsx";
import Gallery from "./Pages/(PublicPages)/Gallery/Gallery.jsx";
import AboutUs from "./Pages/(PublicPages)/(About)/AboutUs/AboutUs.jsx";
import Classes from "./Pages/(PublicPages)/(Classes)/Classes/Classes.jsx";
import Feedback from "./Pages/(PublicPages)/(About)/Feedback/Feedback.jsx";
import Trainers from "./Pages/(PublicPages)/(Trainers)/Trainers/Trainers.jsx";
import OurMission from "./Pages/(PublicPages)/(About)/OurMission/OurMission.jsx";
import ClassesDetails from "./Pages/(PublicPages)/(Classes)/ClassesDetails/ClassesDetails.jsx";
import TrainersDetails from "./Pages/(PublicPages)/(Trainers)/TrainersDetails/TrainersDetails.jsx";
import TrainersBookings from "./Pages/(PublicPages)/(Trainers)/TrainersBookings/TrainersBookings.jsx";

// User Pages Import
import UserProfile from "./Pages/(UserPages)/UserProfile/UserProfile.jsx";
import UserSettings from "./Pages/(UserPages)/UserSettings/UserSettings.jsx";
import UserTierUpgrade from "./Pages/(UserPages)/UserTierUpgrade/UserTierUpgrade.jsx";
import TearUpgradePayment from "./Pages/(UserPages)/TierUpgradePayment/TierUpgradePayment.jsx";
import UserSchedulePlanner from "./Pages/(UserPages)/UserSchedulePlanner/UserSchedulePlanner.jsx";
import TestimonialsPage from "./Pages/(PublicPages)/(About)/TestimonialsPage/TestimonialsPage.jsx";

// Trainer Pages Import
import TrainerSettingsLayout from "./Layouts/TrainerSettingsLayout.jsx";
import UserTrainerManagement from "./Pages/(UserPages)/UserTrainerManagement/UserTrainerManagement.jsx";

// Private Route
import MemberPrivateRoute from "./Routes/MemberPrivateRoute.jsx";
import TrainerPrivateRoute from "./Routes/TrainerPrivateRoute.jsx";
import UnauthorizedPage from "./Pages/UnauthorizedPage/UnauthorizedPage.jsx";

// React Query Client
const queryClient = new QueryClient();

// React DOM Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Page Not Found */}
            <Route path="*" element={<PageNotFound />} />

            {/* Home Page Layout */}
            <Route element={<HomePageLayout />}>
              {/* Auth Pages Links */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SignUpDetails />} />
              <Route path="/Unauthorized" element={<UnauthorizedPage />} />

              {/* Home Pages Link */}
              <Route path="/" element={<Home />} />
            </Route>

            {/* Public Page Layouts */}
            <Route element={<PublicPageLayout />}>
              {/* Public Pages Link */}
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
              <Route path="/Forums" element={<Forums />} />
              <Route path="/About/OurMission" element={<OurMission />} />
              <Route
                path="/About/Testimonials"
                element={<TestimonialsPage />}
              />
              <Route path="/About/AboutUs" element={<AboutUs />} />
              <Route path="/About/Feedback" element={<Feedback />} />

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
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
