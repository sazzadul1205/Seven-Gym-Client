import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

/**
 * Returns an icon and label based on the user's gender.
 *
 * @param {string} gender - The gender value (e.g., "Male", "Female", "Other").
 * @returns {object} An object with `icon` and `label` keys representing the gender.
 */
export const getGenderIcon = (gender) => {
  // Define icon and label mappings for known gender types
  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 font-bold" />,
      label: "Other",
    },
  };

  // Return the matching gender object or a default fallback if not found
  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-2xl" />,
      label: "Not specified",
    }
  );
};
