/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegStar, FaStar, FaRegTrashAlt, FaTrophy } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";

const USAwards = ({ UsersData, refetch }) => {
  // State to manage the view mode (table or grid)
  const [viewMode, setViewMode] = useState("table");
  const [AddAwardData, setAddAwardData] = useState();

  // State to manage awards with favorites
  const [awards, setAwards] = useState(
    UsersData?.awards?.map((award) => ({ ...award, favorite: false })) || []
  );

  // Toggle favorite status for an award
  const toggleFavorite = (index) => {
    setAwards((prevAwards) =>
      prevAwards.map((award, i) =>
        i === index ? { ...award, favorite: !award.favorite } : award
      )
    );
  };

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      {/* Header Section */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <FaTrophy /> User Awards Settings
        </p>
      </header>

      {/* Page Section */}
      <div className="p-5">
        {/* View Mode Selector */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <button
              className="flex gap-3 items-center bg-gradient-to-br hover:bg-gradient-to-tr from-green-500 to-green-300 text-gray-100 hover:text-gray-500 font-semibold px-16 py-3 rounded-lg"
              onClick={() =>
                document.getElementById("Add_Award_Modal").showModal()
              }
            >
              + Add Awards <FaTrophy />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold italic">Format:</p>
            <label className="swap swap-rotate bg-blue-200 rounded-full p-2">
              {/* Hidden Checkbox */}
              <input
                type="checkbox"
                checked={viewMode === "grid"}
                onChange={() =>
                  setViewMode(viewMode === "table" ? "grid" : "table")
                }
              />
              {/* Table Icon */}
              <CiViewTable className="swap-off h-8 w-8 text-blue-700" />

              {/* Grid Icon */}
              <IoGridOutline className="swap-on h-8 w-8 text-blue-600" />
            </label>
          </div>
        </div>

        {/* Awards Display */}
        <>
          {viewMode === "table" ? (
            // Table View
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 border border-gray-200">Icon</th>
                    <th className="p-3 border border-gray-200">Class Name</th>
                    <th className="p-3 border border-gray-200">Description</th>
                    <th className="p-3 border border-gray-200">Date Awarded</th>
                    <th className="p-3 border border-gray-200">Instructor</th>
                    <th className="p-3 border border-gray-200">Level</th>
                    <th className="p-3 border border-gray-200">Favorite</th>
                    <th className="p-3 border border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapping over awards to render rows */}
                  {awards.map((award, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3 border border-gray-200">
                        <img
                          src={award.icon}
                          alt={`${award.className} icon`}
                          className="w-10 h-10"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        {award.className}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {award.description}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {award.dateAwarded}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {award.instructor}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {award.level}
                      </td>
                      <td className="p-3 border border-gray-200 text-center">
                        <button onClick={() => toggleFavorite(index)}>
                          {award.favorite ? (
                            <FaStar className="text-yellow-400 text-2xl" />
                          ) : (
                            <FaRegStar className="text-gray-500 text-2xl" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 border border-gray-200">
                        <button className="bg-gradient-to-br hover:bg-gradient-to-tl from-[#F72C5B] to-[#f72c5bb4] p-3 rounded-xl w-full">
                          <FaRegTrashAlt className="text-white justify-center mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mapping over awards to render cards */}
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br pt-5 from-white via-gray-100 to-gray-200 shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  {/* Icon */}
                  <div className="bg-blue-100 p-3 rounded-full shadow-md">
                    <img
                      src={award.icon}
                      alt={`${award.className} icon`}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  {/* Title and Description */}
                  <div className="py-2">
                    <h2 className="text-lg font-bold text-gray-800 mt-4">
                      {award.className}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {award.description}
                    </p>
                  </div>

                  {/* Award Details */}
                  <div className="w-full border-t border-gray-300 pt-5 px-5">
                    <div className="flex justify-between">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">
                          Date Awarded:
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Instructor:
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Level:
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {award.dateAwarded}
                        </p>
                        <p className="text-sm text-gray-500">
                          {award.instructor}
                        </p>
                        <p className="text-sm text-gray-500">{award.level}</p>
                      </div>
                    </div>
                  </div>

                  {/* Favorite and Delete Actions */}
                  <div className="flex justify-between mt-4 w-full bg-gray-200 py-3 px-5">
                    <button onClick={() => toggleFavorite(index)}>
                      {award.favorite ? (
                        <FaStar className="text-yellow-400 text-2xl" />
                      ) : (
                        <FaRegStar className="text-gray-500 text-2xl" />
                      )}
                    </button>
                    <button className="bg-gradient-to-br hover:bg-gradient-to-tl from-[#F72C5B] to-[#f72c5bb4] p-3 rounded-xl px-10">
                      <FaRegTrashAlt className="text-white justify-center mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      </div>

      {/* Modal */}
      <dialog id="Add_Award_Modal" className="modal">
        <div className="modal-box">
          {/* Top Part */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Add Award</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() => document.getElementById("Add_Award_Modal").close()}
            />
          </div>
          {/* Content Part */}
          <AddAwardData setAddAwardData={setAddAwardData} />
        </div>
      </dialog>
    </div>
  );
};

export default USAwards;
