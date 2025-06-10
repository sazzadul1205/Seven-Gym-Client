const HomePageAdminServices = ({ Refetch, HomeWelcomeSectionData }) => {
  return (
    <section>
      {/* Title */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Edit Button */}
        {/* <div className="flex-shrink-0 pl-3">
          <button
            id={`edit-welcome-btn`}
            className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => {
              setSelectedWelcome(HomeWelcomeSectionData);
              document.getElementById("Edit_Welcome_Modal").showModal();
            }}
          >
            <FaEdit className="text-yellow-500" />
          </button>
          <Tooltip
            anchorSelect={`#edit-welcome-btn`}
            content="Edit Welcome Section"
          />
        </div> */}

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Services Section ( Services {HomeWelcomeSectionData.length} )
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      <div className="grid grid-cols-4" >
        {HomeWelcomeSectionData.map((service) => (
          <div key={service.id || service.title} className="px-3 py-4">
            <div
              className="block transform transition duration-300 hover:scale-105"
              aria-label={`Learn more about ${service.title}`}
              onClick={() => alert(`Redirect to - ${service.link}`)}
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePageAdminServices;
