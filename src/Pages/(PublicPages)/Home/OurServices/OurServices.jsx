import { Link } from "react-router";

// Import Packages
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";

// Import Slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import Title
import Title from "../../../../Shared/Component/Title";

const OurServices = ({ homeServicesData }) => {
  // Slider settings
  const settings = {
    infinite: true,
    speed: 1000, // Transition speed
    autoplay: true,
    autoplaySpeed: 2000, // Slide change speed
    slidesToShow: 4, // Default: PC view
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // Tablets (2 slides)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767, // Mobile (1 slide)
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 bg-gradient-to-t from-black/40 to-black/70">
      <div className="mx-auto ">
        <div className="container mx-auto text-center">
          {/* Section Title */}
          <div className="px-6">
            <Title titleContent="Our Services" />
          </div>

          {/* Services Slider */}
          <Slider {...settings} className="mt-2s md:mt-2 px-2">
            {homeServicesData.map((service) => (
              <div key={service.id || service.title} className="px-3 py-4">
                <Link
                  to={service.link}
                  id={`service-link-${service._id}`}
                  className="block transform transition duration-300 hover:scale-105 cursor-default"
                  aria-label={`Learn more about ${service.title}`}
                >
                  {/* Service Card */}
                  <div className="bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 to-gray-400 shadow-lg hover:shadow-2xl rounded-lg p-6 text-center h-[190px] w-full flex flex-col justify-between">
                    {/* Service Icon */}
                    <div className="flex justify-center items-center mb-4">
                      <img
                        src={service.icon}
                        alt={`${service.title} icon`}
                        className="w-12 h-12"
                      />
                    </div>

                    {/* Service Title */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {service.title}
                    </h3>

                    {/* Service Description */}
                    <p className="text-black" >{service.description}</p>
                  </div>
                </Link>
                <Tooltip
                  anchorSelect={`#service-link-${service._id}`}
                  place="top"
                  content={`Go To ${service.link}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
OurServices.propTypes = {
  homeServicesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OurServices;
