/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import { HiDotsVertical } from "react-icons/hi";

const AllUserManagement = ({ AllUsersData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = AllUsersData.filter(
    (user) => user.role === "Member"
  ).filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center">
        <label className="text-gray-700 font-medium mb-2 text-lg">
          Search by User Name
        </label>
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            aria-label="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="text-black overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Tier</th>
              <th>Action</th>
            </tr>s
          </thead>
          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>{user.tier}</td>
                <td>
                  <p>
                    <HiDotsVertical />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers?.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUserManagement;
