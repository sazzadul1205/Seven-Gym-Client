import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./Pages/Home/Home.jsx";
import PublicLayout from "./Layouts/PublicLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import Gallery from "./Pages/Gallery/Gallery.jsx";
import Trainers from "./Pages/Trainers/Trainers.jsx";
import Classes from "./Pages/Classes/Classes.jsx";
import Forums from "./Pages/Forums/Forums.jsx";
import OurMission from "./Pages/OurMission/OurMission.jsx";
import Testimonials from "./Pages/Testimonials/Testimonials.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Gallery" element={<Gallery />} />
            <Route path="/Trainers" element={<Trainers />} />
            <Route path="/Classes" element={<Classes />} />
            <Route path="/Forums" element={<Forums />} />
            <Route path="/About/OurMission" element={<OurMission />} />
            <Route path="/About/Testimonials" element={<Testimonials />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
