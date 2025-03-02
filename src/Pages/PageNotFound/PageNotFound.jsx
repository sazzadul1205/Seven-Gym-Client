import { Link } from "react-router"; // Ensure you use 'react-router-dom' for routing
import Background from "../../assets/Error-Background/ErrorBackground.jpg"; // Path to background image

// PageNotFound Component: This component is shown when the user navigates to a page that doesn't exist.
const PageNotFound = () => {
  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: `url(${Background})`, // Setting the background image for the page
        backgroundSize: "cover", // Ensure the background covers the entire screen
        backgroundPosition: "center", // Center the background image
      }}
    >
      {/* Wrapper div for the entire screen with flexbox to center the content */}
      <div className="w-screen h-screen flex bg-black/50 items-center justify-center gap-5">
        {/* Container for the 404 number and spinner animation */}
        <div className="flex items-center justify-center border-r-2 pr-5">
          <h1 className="text-[10rem] sm:text-[6rem] md:text-[8rem] font-bold text-white">
            4
          </h1>{" "}
          {/* Display the number 4 in large font, responsive */}
          {/* Spinner to give a loading effect, added animation */}
          <div className="w-20 h-20 border-8 border-t-white border-b-white border-l-transparent border-r-transparent rounded-full animate-spin mx-8"></div>
          <h1 className="text-[10rem] sm:text-[6rem] md:text-[8rem] font-bold text-white">
            4
          </h1>{" "}
          {/* Display the number 4 in large font, responsive */}
        </div>

        {/* Section for the error message and return button */}
        <div className="items-center text-center">
          <p className="text-2xl sm:text-xl md:text-3xl font-extrabold text-white animate-pulse">
            Uh Oh! Page not found! {/* Error message */}
          </p>

          {/* Link to navigate back to the homepage */}
          <Link to={"/"} className="items-center">
            {/* Button to return to home page with gradient hover effect */}
            <button className="bg-linear-to-br hover:bg-linear-to-tl from-[#F72C5B] to-[#f72c5b7a] mt-5 py-3 px-10 font-bold text-white rounded-full">
              Return To Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
