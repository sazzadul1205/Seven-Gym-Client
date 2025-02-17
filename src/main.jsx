import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PublicLayout from "./Layouts/PublicLayout.jsx";
import AuthProvider from "./Providers/AuthProviders.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Route Links
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";

// Auth Import
import Login from "./Pages/(Auth)/Login/Login.jsx";
import SignUp from "./Pages/(Auth)/SignUp/SignUp.jsx";
import SUDetails from "./Pages/(Auth)/SignUp/SUDetails/SUDetails.jsx";

// Public Pages Import
import Home from "./Pages/(PublicPages)/Home/Home.jsx";
import Forums from "./Pages/(PublicPages)/Forums/Forums.jsx";
import Gallery from "./Pages/(PublicPages)/Gallery/Gallery.jsx";
import AboutUs from "./Pages/(PublicPages)/(About)/AboutUs/AboutUs.jsx";
import Classes from "./Pages/(PublicPages)/(Classes)/Classes/Classes.jsx";
import Feedback from "./Pages/(PublicPages)/(About)/Feedback/Feedback.jsx";
import Trainers from "./Pages/(PublicPages)/(Trainers)/Trainers/Trainers.jsx";
import OurMission from "./Pages/(PublicPages)/(About)/OurMission/OurMission.jsx";
import Testimonials from "./Pages/(PublicPages)/Home/Testimonials/Testimonials.jsx";
import ClassesDetails from "./Pages/(PublicPages)/(Classes)/ClassesDetails/ClassesDetails.jsx";
import TrainersDetails from "./Pages/(PublicPages)/(Trainers)/TrainersDetails/TrainersDetails.jsx";
import TrainersBookings from "./Pages/(PublicPages)/(Trainers)/TrainersBookings/TrainersBookings.jsx";

// User Pages Import
import UserProfile from "./Pages/(UserPages)/UserProfile/UserProfile.jsx";
import UserSettings from "./Pages/(UserPages)/UserSettings/UserSettings.jsx";
import UserTearUpgrade from "./Pages/(UserPages)/UserTearUpgrade/UserTearUpgrade.jsx";
import TearUpgradePayment from "./Pages/(UserPages)/TearUpgradePayment/TearUpgradePayment.jsx";
import UserSchedulePlanner from "./Pages/(UserPages)/UserSchedulePlanner/UserSchedulePlanner.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route element={<PublicLayout />}>
              {/* Public Pages Link */}
              <Route path="/" element={<Home />} />
              <Route path="/Gallery" element={<Gallery />} />
              <Route path="/Trainers" element={<Trainers />} />
              <Route path="/Trainers/:name" element={<TrainersDetails />} />
              <Route
                path="/Trainers/Bookings/:name"
                element={<TrainersBookings />}
              />
              <Route path="/Classes" element={<Classes />} />
              <Route path="/Classes/:module" element={<ClassesDetails />} />
              <Route path="/Forums" element={<Forums />} />
              <Route path="/About/OurMission" element={<OurMission />} />
              <Route path="/About/Testimonials" element={<Testimonials />} />
              <Route path="/About/AboutUs" element={<AboutUs />} />
              <Route path="/About/Feedback" element={<Feedback />} />

              {/* Auth Pages Link */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SUDetails />} />

              {/* User Pages Link */}
              <Route
                path="/User/:email/UserProfile"
                element={<UserProfile />}
              />
              <Route path="/User/UserSettings" element={<UserSettings />} />
              <Route
                path="/User/:email/TierUpgrade"
                element={<UserTearUpgrade />}
              />
              <Route
                path="/User/:email/UserSchedulePlanner"
                element={<UserSchedulePlanner />}
              />
              <Route
                path="/User/:email/:tier/TierUpgradePayment"
                element={<TearUpgradePayment />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
