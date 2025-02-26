import { Link } from "react-router";
import PropTypes from "prop-types";
import Title from "../../../../Shared/Component/Title";

const OurServices = ({ homeServicesData }) => {
  return (
    <div className="py-10 bg-gradient-to-t from-black/20 to-black/40">
      <div className="mx-auto max-w-7xl ">
        <div className="container mx-auto text-center">
          {/* Section Title */}
          <div className="px-6">
            <Title titleContent="Our Services" />
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-5 md:mt-11 px-2">
            {homeServicesData.map((service) => (
              <Link
                key={service.id || service.title}
                to={service.link}
                className="block transform transition duration-300 hover:scale-105 "
                aria-label={`Learn more about ${service.title}`} //
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
                  <p className="text-gray-700">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
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
