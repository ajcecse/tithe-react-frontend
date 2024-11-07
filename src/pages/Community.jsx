import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig.jsx";
import { FaPeopleRoof } from "react-icons/fa6";

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    phone: "",
    headOfCommunity: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });
  const [editingCommunity, setEditingCommunity] = useState(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      // Step 1: Get all community IDs
      const communityIDResponse = await axiosInstance.get("/community");
      const communityIDs = communityIDResponse.data; // Array of community IDs
      console.log(communityIDs);
      // Step 2: Fetch details for each community using the IDs
      const communityDetailPromises = communityIDs.map((id) =>
        axiosInstance.get(`/community/${id._id}`)
      );
      const communityDetailsResponses = await Promise.all(
        communityDetailPromises
      );

      // Step 3: Extract and set the community details
      const communityDetails = communityDetailsResponses.map((res) => res.data);
      console.log(communityDetails);
      setCommunities(communityDetails);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle add community
  const handleAddCommunity = async () => {
    try {
      await axiosInstance.post("/community/", newCommunity);
      fetchCommunities(); // Refresh community list
      closeAndResetModal();
    } catch (error) {
      console.error(
        "Error adding community:",
        error.response?.data || error.message
      );
    }
  };

  // Handle update community
  const handleUpdateCommunity = async () => {
    try {
      await axiosInstance.put(
        `/community/${editingCommunity._id}`,
        newCommunity
      );
      fetchCommunities(); // Refresh community list
      closeAndResetModal();
    } catch (error) {
      console.error(
        "Error updating community:",
        error.response?.data || error.message
      );
    }
  };

  // Handle delete community
  const handleDeleteCommunity = async (id) => {
    try {
      await axiosInstance.delete(`/community/${id}`);
      fetchCommunities(); // Refresh community list
    } catch (error) {
      console.error(
        "Error deleting community:",
        error.response?.data || error.message
      );
    }
  };

  const openModalForEdit = (community) => {
    setEditingCommunity(community);
    setNewCommunity({
      name: community.name,
      phone: community.phone,
      headOfCommunity: community.headOfCommunity,
    });
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setNewCommunity({
      name: "",
      phone: "",
      headOfCommunity: {
        fullName: "",
        email: "",
        phoneNumber: "",
      },
    });
    setEditingCommunity(null);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <FaPeopleRoof className="text-5xl mb-3" />
      <h1 className="text-3xl font-bold mb-6">Community Management</h1>

      {/* Community List */}
      <div className="w-full">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Community</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Head Name</th>
              <th className="p-4">Head Email</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {communities.map((community) => (
              <tr key={community._id} className="border-t">
                <td className="p-4">{community.name}</td>
                <td className="p-4">{community.phone}</td>
                <td className="p-4">{community.headOfCommunity.fullName}</td>
                <td className="p-4">{community.headOfCommunity.email}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => openModalForEdit(community)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCommunity(community._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Community Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Add Community
      </button>

      {/* Modal for Add/Edit Community */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3 space-y-4">
            <h2 className="text-2xl font-bold text-center">
              {editingCommunity ? "Edit Community" : "Add New Community"}
            </h2>

            <div>
              <label className="block text-lg">Community Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newCommunity.name}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-lg">Community Phone</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newCommunity.phone}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, phone: e.target.value })
                }
              />
            </div>

            {/* Head of Community */}
            <h3 className="text-xl font-semibold mt-4">
              Community Head Details
            </h3>
            <div>
              <label className="block text-lg">Head Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newCommunity.headOfCommunity.fullName}
                onChange={(e) =>
                  setNewCommunity({
                    ...newCommunity,
                    headOfCommunity: {
                      ...newCommunity.headOfCommunity,
                      fullName: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-lg">Head Phone</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newCommunity.headOfCommunity.phoneNumber}
                onChange={(e) =>
                  setNewCommunity({
                    ...newCommunity,
                    headOfCommunity: {
                      ...newCommunity.headOfCommunity,
                      phoneNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-lg">Head Email</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newCommunity.headOfCommunity.email}
                onChange={(e) =>
                  setNewCommunity({
                    ...newCommunity,
                    headOfCommunity: {
                      ...newCommunity.headOfCommunity,
                      email: e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={
                  editingCommunity ? handleUpdateCommunity : handleAddCommunity
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {editingCommunity ? "Update" : "Add"}
              </button>
              <button
                onClick={closeAndResetModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagement;
