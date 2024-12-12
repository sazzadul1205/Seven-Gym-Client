/* eslint-disable react/prop-types */
import Title from "../../../Shared/Componenet/Title";

const PromotionsSection = ({ promotionsData }) => {
  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Promotions & Offers"} />
        </div>

        {/* Promotions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-8 mt-6 md:mt-11 text-left px-1">
          {promotionsData.map((promo) => (
            <div
              key={promo._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-56 object-cover"
              />
              <div className="flex-1 pt-2 px-3 md:px-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {promo.title}
                </h3>
                <p className="text-gray-600 mb-1">{promo.description}</p>
              </div>
              <div className="p-6">
                <a
                  href={promo.link}
                  className="inline-block px-10 py-3 font-semibold text-white bg-[#F72C5B] hover:bg-white hover:text-[#F72C5B] border border-[#F72C5B] rounded-lg transition duration-300 transform hover:scale-105 w-full text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;
