import Background from "../../assets/Background1.jpg";
import Banner from "./Banner/Banner";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center opacity-80"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <Banner></Banner>
    </div>
  );
};

export default Home;
