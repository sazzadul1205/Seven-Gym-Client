import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PublicLayout from "./Layouts/PublicLayout.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Route Links
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import SignUp from "./Pages/SignUp/SignUp.jsx";
import Forums from "./Pages/Forums/Forums.jsx";
import Classes from "./Pages/Classes/Classes.jsx";
import Gallery from "./Pages/Gallery/Gallery.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import Trainers from "./Pages/Trainers/Trainers.jsx";
import Feedback from "./Pages/Feedback/Feedback.jsx";
import AuthProvider from "./Providers/AuthProviders.jsx";
import OurMission from "./Pages/OurMission/OurMission.jsx";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import Testimonials from "./Pages/Testimonials/Testimonials.jsx";
import ClassesDetails from "./Pages/ClassesDetails/ClassesDetails.jsx";
import TrainersDetails from "./Pages/TrainersDetails/TrainersDetails.jsx";
import SUDetails from "./Pages/SignUp/SUDetails/SUDetails.jsx";
import TrainerPayment from "./Pages/Payments/TrainersPayment.jsx";

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
              <Route path="/Trainers/:name/Payment" element={<TrainerPayment />} />
              <Route path="/Classes" element={<Classes />} />
              <Route path="/Classes/:module" element={<ClassesDetails />} />
              <Route path="/Forums" element={<Forums />} />
              <Route path="/About/OurMission" element={<OurMission />} />
              <Route path="/About/Testimonials" element={<Testimonials />} />
              <Route path="/About/AboutUs" element={<AboutUs />} />
              <Route path="/About/Feedback" element={<Feedback />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SUDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
