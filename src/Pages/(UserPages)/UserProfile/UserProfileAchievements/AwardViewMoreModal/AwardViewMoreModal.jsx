import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";
import { IoSettingsSharp } from "react-icons/io5";
import { FaRegStar, FaStar } from "react-icons/fa";

// Utility Import
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const AwardViewMoreModal = ({ usersData, refetch, PageEmail }) => {
  const axiosPublic = useAxiosPublic();

  // Destructure awards and email from usersData for clarity
  const { awards: initialAwards, email } = usersData;

  // Local state for awards list and warning messages
  const [awards, setAwards] = useState(initialAwards);
  const [warning, setWarning] = useState("");

  // Update local awards state when usersData.awards changes
  useEffect(() => {
    setAwards(initialAwards);
  }, [initialAwards]);

  //  Toggle the favorite status of an award.
  const toggleFavorite = useCallback(
    async (index, awardCode) => {
      // Prevent toggling if PageEmail does not match the user's email.
      if (PageEmail !== email) {
        setWarning("You are not allowed to modify favorites on this page.");
        return;
      }

      const selectedAward = awards[index];

      // Prevent marking more than 6 awards as favorite.
      if (
        !selectedAward.favorite &&
        awards.filter((a) => a.favorite).length >= 6
      ) {
        setWarning("You can only mark up to 6 awards as favorites.");
        return;
      }

      try {
        // API call to toggle the award's favorite status.
        const response = await axiosPublic.put("/Users/toggle-award-favorite", {
          email,
          awardCode,
        });

        if (response.status === 200) {
          // Update local state with toggled favorite status.
          setAwards((prevAwards) =>
            prevAwards.map((award, i) =>
              i === index ? { ...award, favorite: !award.favorite } : award
            )
          );
          // Call refetch to refresh parent data.
          refetch();
          // Clear warning message on success.
          setWarning("");
        } else {
          // Set warning message if the API call fails.
          setWarning(
            response.data.message || "Failed to update favorite status."
          );
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
        setWarning("Failed to update favorite status. Please try again.");
      }
    },
    [awards, axiosPublic, email, refetch, PageEmail]
  );

  return (
    <div className="modal-box max-w-6xl bg-gray-100 rounded-xl shadow-xl w-full p-6 relative">
      {/* Modal Header */}
      <div className="flex justify-between items-center text-black mb-4 border-b-2 border-black pb-2 px-2">
        {/* Settings Link */}
        <Link to={`/User/UserSettings?tab=User_Award_Settings`}>
          <IoSettingsSharp className="mr-5 text-2xl hover:text-red-500" />
        </Link>
        <h3 className="font-bold text-lg flex items-center">All My Awards</h3>
        {/* Close Button using dialog's close() method */}
        <button
          onClick={() =>
            document.getElementById("Award_View_More_Modal").close()
          }
        >
          <ImCross className="hover:text-red-500 text-xl cursor-pointer" />
        </button>
      </div>

      {/* Warning/Error Banner */}
      {warning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{warning}</p>
        </div>
      )}

      {/* Awards Table */}
      <div className="overflow-x-auto bg-white text-black shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border border-gray-200">Icon</th>
              <th className="p-3 border border-gray-200">Award Name</th>
              <th className="p-3 border border-gray-200">Description</th>
              <th className="p-3 border border-gray-200">Date Awarded</th>
              <th className="p-3 border border-gray-200">Awarded By</th>
              <th className="p-3 border border-gray-200 text-center">
                Favorite
              </th>
            </tr>
          </thead>
          <tbody>
            {awards.map((award, index) => (
              <tr
                key={award.awardCode || index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3 border border-gray-200 text-center">
                  <img
                    src={award.awardIcon || ""}
                    alt={award.awardName || "Award"}
                    className="w-10 h-10 mx-auto"
                  />
                </td>
                <td className="p-3 border border-gray-200">
                  {award.awardName}
                </td>
                <td className="p-3 border border-gray-200">
                  {award.description}
                </td>
                <td className="p-3 border border-gray-200">
                  {award.dateAwarded}
                </td>
                <td className="p-3 border border-gray-200">
                  {award.awardedBy}
                </td>
                <td className="p-3 border border-gray-200 text-center">
                  {/* Toggle Favorite Status Button */}
                  <button
                    onClick={() => toggleFavorite(index, award.awardCode)}
                    disabled={PageEmail !== email}
                    className="focus:outline-none"
                  >
                    {award.favorite ? (
                      <FaStar
                        className={`text-yellow-400 text-2xl ${
                          PageEmail !== email
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      />
                    ) : (
                      <FaRegStar
                        className={`text-gray-500 text-2xl ${
                          PageEmail !== email
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Define PropTypes for AwardViewMoreModal
AwardViewMoreModal.propTypes = {
  usersData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        awardCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        awardIcon: PropTypes.string,
        awardName: PropTypes.string,
        description: PropTypes.string,
        dateAwarded: PropTypes.string,
        awardedBy: PropTypes.string,
        favorite: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  PageEmail: PropTypes.string.isRequired,
};

export default AwardViewMoreModal;
