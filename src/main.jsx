import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PublicLayout from "./Layouts/PublicLayout.jsx";
import AuthProvider from "./Providers/AuthProviders.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Route Links
import Login from "./Pages/(Auth)/Login/Login.jsx";
import SignUp from "./Pages/(Auth)/SignUp/SignUp.jsx";
import Home from "./Pages/(Public Pages)/Home/Home.jsx";
import Forums from "./Pages/(Public Pages)/Forums/Forums.jsx";
import Gallery from "./Pages/(Public Pages)/Gallery/Gallery.jsx";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import UserProfile from "./Pages/(Users)/UserProfile/UserProfile.jsx";
import SUDetails from "./Pages/(Auth)/SignUp/SUDetails/SUDetails.jsx";
import AboutUs from "./Pages/(Public Pages)/(About)/AboutUs/AboutUs.jsx";
import Classes from "./Pages/(Public Pages)/(Classes)/Classes/Classes.jsx";
import Feedback from "./Pages/(Public Pages)/(About)/Feedback/Feedback.jsx";
import Trainers from "./Pages/(Public Pages)/(Trainers)/Trainers/Trainers.jsx";
import OurMission from "./Pages/(Public Pages)/(About)/OurMission/OurMission.jsx";
import Testimonials from "./Pages/(Public Pages)/Home/Testimonials/Testimonials.jsx";
import ClassesDetails from "./Pages/(Public Pages)/(Classes)/ClassesDetails/ClassesDetails.jsx";
import TrainersDetails from "./Pages/(Public Pages)/(Trainers)/TrainersDetails/TrainersDetails.jsx";
import TrainersBookings from "./Pages/(Public Pages)/(Trainers)/TrainersBookings/TrainersBookings.jsx";
import UserTearUpgrade from "./Pages/(Users)/UserTearUpgrade/UserTearUpgrade.jsx";
import TearUpgradePayment from "./Pages/(Users)/TearUpgradePayment/TearUpgradePayment.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route element={<PublicLayout />}>
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
              {/* Login Section */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SUDetails />} />
              {/* User Section */}
              <Route
                path="/User/:email/UserProfile"
                element={<UserProfile />}
              />
              <Route
                path="/User/:email/TierUpgrade"
                element={<UserTearUpgrade />}
              />
              <Route
                path="/User/:email/:tier"
                element={<TearUpgradePayment />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
