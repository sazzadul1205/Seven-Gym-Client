import React from "react";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

/**
 * Return an icon element and label for a given gender.
 *
 * @param {string} gender — Accepts varied formats like "Male", "FEMALE", "femal", etc.
 * @param {string} size — Tailwind text-size (e.g. "2xl", "3xl", "4xl"); defaults to "2xl"
 * @returns {{ icon: React.ReactElement, label: string }}
 */
export function getGenderIcon(gender, size = "2xl") {
  const textSizeClass = `text-${size} font-bold`;
  const normalized = (gender || "").trim().toLowerCase();

  const match = normalized.startsWith("male")
    ? "Male"
    : normalized.startsWith("fem")
    ? "Female"
    : normalized.startsWith("oth")
    ? "Other"
    : "Unknown";

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
    Unknown: {
      icon: React.createElement(MdOutlinePeopleAlt, {
        className: `text-gray-500 ${textSizeClass}`,
      }),
      label: "Not specified",
    },
  };

  return genderData[match];
}
