import React from "react";

// Import Icons
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

/**
 * Return an icon element and label for a given gender.
 *
 * @param {"Male"|"Female"|"Other"} gender
 * @param {string} size  — Tailwind text-size (e.g. "2xl", "3xl", "4xl"); defaults to "2xl"
 * @returns {{ icon: React.ReactElement, label: string }}
 */
export function getGenderIcon(gender, size = "2xl") {
  // Build the dynamic text-size class once
  const textSizeClass = `text-${size} font-bold`;

  const genderData = {
    Male: {
      icon: React.createElement(IoMdMale, {
        className: `text-blue-500 ${textSizeClass}`,
      }),
      label: "Male",
    },
    Female: {
      icon: React.createElement(IoMdFemale, {
        className: `text-pink-500 ${textSizeClass}`,
      }),
      label: "Female",
    },
    Other: {
      icon: React.createElement(MdOutlinePeopleAlt, {
        className: `text-gray-500 ${textSizeClass}`,
      }),
      label: "Other",
    },
  };

  // Fallback if gender key not found
  return (
    genderData[gender] || {
      icon: React.createElement(MdOutlinePeopleAlt, {
        className: `text-gray-500 ${textSizeClass}`,
      }),
      label: "Not specified",
    }
  );
}
