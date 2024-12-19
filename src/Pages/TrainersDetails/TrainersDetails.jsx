import { useParams } from "react-router";
import Loading from "../../Shared/Loading/Loading";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import TDImages from "./TDContent/TDImages";
import TDBio from "./TDContent/TDBio";

const TrainersDetails = () => {
  const axiosPublic = useAxiosPublic();
  let { name } = useParams();

  // Decode the URL parameter to handle spaces correctly
  const decodedName = decodeURIComponent(name); // Decode the name parameter

  // Fetching Trainer_Detail Data
  const {
    data: Trainer_DetailData,
    isLoading: Trainer_DetailDataIsLoading,
    error: Trainer_DetailDataError,
  } = useQuery({
    queryKey: ["Trainer_DetailData", decodedName], // Adding 'decodedName' to the query key
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/searchByNames?names=${decodedName}`) // Pass the decoded name in the API call
        .then((res) => res.data),
  });

  // Loading and error states
  if (Trainer_DetailDataIsLoading) {
    return <Loading />;
  }

  if (Trainer_DetailDataError) {
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

  const TrainerDetails = Trainer_DetailData[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#F72C5B] py-11"></div>

      {/* images and Name */}
      <TDImages TrainerDetails={TrainerDetails} />

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trainer Bio and Experience */}
          <TDBio TrainerDetails={TrainerDetails} />

          {/* Trainer Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <div className="mb-4">
              <h3 className="font-semibold">Phone</h3>
              <p>{TrainerDetails.contact.phone}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Email</h3>
              <p>{TrainerDetails.contact.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Website</h3>
              <a
                href={TrainerDetails.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {TrainerDetails.contact.website}
              </a>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Social Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={TrainerDetails.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={TrainerDetails.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={TrainerDetails.contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trainer Certifications */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
          <ul className="list-disc pl-6">
            {TrainerDetails.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>

        {/* Testimonials */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Client Testimonials</h2>
          {TrainerDetails.testimonials.map((testimonial, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold">{testimonial.clientName}</h3>
              <p>{testimonial.testimonial}</p>
              <p className="text-sm text-gray-500">
                Rating: {testimonial.rating} / 5
              </p>
            </div>
          ))}
        </div>

        {/* Trainer Preferences */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Training Preferences</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Focus Areas</h3>
            <ul className="list-disc pl-6">
              {TrainerDetails.preferences.focusAreas.map((focus, index) => (
                <li key={index}>{focus}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Class Types</h3>
            <ul className="list-disc pl-6">
              {TrainerDetails.preferences.classTypes.map((type, index) => (
                <li key={index}>{type}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trainer Pricing */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Per Session</h3>
            <p>${TrainerDetails.perSession}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Monthly Package</h3>
            <p>${TrainerDetails.monthlyPackage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainersDetails;
