import { Link } from "react-router";
import Background from "../../assets/Background.jpeg";
import { Oval } from "react-loader-spinner";

const PageNotFound = () => {
  return (
    <div
      className="page-not-found w-screen h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center">
        <h1 className="text-[10rem] font-bold text-gray-800">4</h1>
        <div className="flex items-center justify-center mx-8">
          <Oval
            visible={true}
            height={100}
            width={100}
            color="#1f2937"
            ariaLabel="oval-loading"
          />
        </div>
        <h1 className="text-[10rem] font-bold text-gray-800">4</h1>
      </div>
      <p className="mt-10 text-2xl font-extrabold text-gray-700 animate-pulse">
        Uh Oh! Page not found!
      </p>
      <Link to={'/'}>
        <button className="bg-[#F72C5B] hover:bg-[#f72c5b7a] mt-5 py-3 px-10 font-bold text-white rounded-full">
          Return To Home
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;
