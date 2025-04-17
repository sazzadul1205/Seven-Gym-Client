import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";
import React from "react"; // Required for createElement

export const getGenderIcon = (gender) => {
  const genderData = {
    Male: {
      icon: React.createElement(IoMdMale, {
        className: "text-blue-500 text-2xl font-bold",
      }),
      label: "Male",
    },
    Female: {
      icon: React.createElement(IoMdFemale, {
        className: "text-pink-500 text-2xl font-bold",
      }),
      label: "Female",
    },
    Other: {
      icon: React.createElement(MdOutlinePeopleAlt, {
        className: "text-gray-500 text-2xl font-bold",
      }),
      label: "Other",
    },
  };

  return (
    genderData[gender] || {
      icon: React.createElement(MdOutlinePeopleAlt, {
        className: "text-gray-500  text-2xl",
      }),
      label: "Not specified",
    }
  );
};
