// import Packages
import PropTypes from "prop-types";

// import Icons
import { FaCog } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

// import Modal
import TermsOfServiceEditModal from "./TermsOfServiceEditModal/TermsOfServiceEditModal";
import TermsOfServiceBackgroundEditModal from "./TermsOfServiceBackgroundEditModal/TermsOfServiceBackgroundEditModal";

const TermOfServiceManagement = ({ TermsOfServiceData, Refetch }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-gray-400 py-2 flex items-center">
        {/* Left: Balance No Content */}
        <div className="flex-shrink-0 w-10" />

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Terms Of Service (Admin)
        </h3>

        {/* Right: Edit Background Button */}
        <div className="flex-shrink-0 w-10">
          <button
            onClick={() => {
              document
                .getElementById("Terms_Of_Service_Background_Edit_Modal")
                .showModal();
            }}
            id="edit-background-image-btn"
            className="cursor-pointer"
            aria-label="Edit background-image"
          >
            <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
          <Tooltip
            anchorSelect="#edit-background-image-btn"
            content="Edit Background Image Section"
          />
        </div>
      </div>

      <div
        className="bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${TermsOfServiceData?.background})` }}
      >
        <div className="relative bg-white/80 text-gray-800">
          <div className="max-w-5xl mx-auto py-5">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-6 text-center">
              {TermsOfServiceData.title}
            </h1>
            {/* Lat Update */}
            <p className="text-sm text-gray-500 text-center mb-10">
              Last updated: {TermsOfServiceData.updatedDate}
            </p>

            {/* Terms Of Service */}
            {TermsOfServiceData.sections.map((section, index) => (
              <section key={index} className="mb-8">
                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">
                  {section.heading}
                </h2>

                {/* Content */}
                {Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </section>
            ))}
          </div>

          {/* Edit Icon with Tooltip */}
          <div className="absolute top-4 right-4 z-10 group ">
            <button
              onClick={() => {
                document
                  .getElementById("Terms_Of_Service_Edit_Modal")
                  .showModal();
              }}
              id="edit-hero-btn"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
              aria-label="Edit Hero"
            >
              <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <Tooltip
              anchorSelect="#edit-hero-btn"
              content="Edit Hero Section"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <>
        {/* Edit About Us Background Modal */}
        <dialog id="Terms_Of_Service_Background_Edit_Modal" className="modal">
          <TermsOfServiceBackgroundEditModal
            Refetch={Refetch}
            TermsOfServiceData={TermsOfServiceData}
          />
        </dialog>

        {/* Edit About Us Hero Section Modal */}
        <dialog id="Terms_Of_Service_Edit_Modal" className="modal">
          <TermsOfServiceEditModal
            Refetch={Refetch}
            TermsOfServiceData={TermsOfServiceData}
          />
        </dialog>
      </>
    </>
  );
};

// Prop Validation
TermOfServiceManagement.propTypes = {
  TermsOfServiceData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    background: PropTypes.string,
    updatedDate: PropTypes.string,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ).isRequired,
  }),
  Refetch: PropTypes.func.isRequired,
};

export default TermOfServiceManagement;
