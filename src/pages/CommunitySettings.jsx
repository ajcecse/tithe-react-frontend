import { useState } from "react";
import { FaPeopleRoof } from "react-icons/fa6";
import axiosInstance from "../axiosConfig.jsx"; // Import your axios instance

const settingsData = [
  { name: "SMYM", percent: 0, amountAllocated: 0, head: "John Jacobs" },
  {
    name: "Mathurvedi",
    percent: 0,
    amountAllocated: 0,
    head: "Mathew Abraham",
  },
];
const totalAmount = 100000;

const CommunitySettings = () => {
  const [communities, setCommunities] = useState(
    settingsData.map((community) => ({
      ...community,
      balanceAfterAllocation: totalAmount,
    }))
  );
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    percent: 0,
    amountAllocated: 0,
  }); // State to show Save button

  // Function to calculate cumulative balance after each allocation
  const updateBalances = (updatedCommunities) => {
    let runningTotalAllocated = 0;
    const result = updatedCommunities.map((community) => {
      runningTotalAllocated += community.amountAllocated;
      return {
        ...community,
        balanceAfterAllocation: totalAmount - runningTotalAllocated,
      };
    });
    setShowSaveButton(true); // Trigger the save button to appear
    return result;
  };

  const handlePercentageChange = (index, newPercentage) => {
    setCommunities((prevCommunities) => {
      const updatedCommunities = prevCommunities.map((community, i) => {
        if (i === index) {
          const updatedAmount = (totalAmount * newPercentage) / 100;
          return {
            ...community,
            percent: newPercentage,
            amountAllocated: updatedAmount,
          };
        }
        return community;
      });
      return updateBalances(updatedCommunities);
    });
  };

  const handleAllocatedAmountChange = (index, newAmount) => {
    setCommunities((prevCommunities) => {
      const updatedCommunities = prevCommunities.map((community, i) => {
        if (i === index) {
          const updatedPercentage = (newAmount / totalAmount) * 100;
          return {
            ...community,
            amountAllocated: newAmount,
            percent: updatedPercentage,
          };
        }
        return community;
      });
      return updateBalances(updatedCommunities);
    });
  };

  // Function to handle save button click, which sends a POST request
  const handleSave = async () => {
    try {
      await axiosInstance.post("/communitysettings", communities);
      alert("Community settings saved successfully!");
      setShowSaveButton(false); // Hide save button after saving
    } catch (error) {
      console.error("Error saving community settings:", error);
    }
  };
  const handleAddCommunity = () => {
    setCommunities((prevCommunities) => {
      const updatedCommunities = [
        ...prevCommunities,
        { ...newCommunity, balanceAfterAllocation: totalAmount },
      ];
      return updateBalances(updatedCommunities);
    });
    setIsModalOpen(false); // Close the modal after adding
    setNewCommunity({ name: "", percent: 0, amountAllocated: 0 }); // Reset form fields
  };

  return (
    <div className="w-full flex flex-col items-center p-[5rem]">
      <FaPeopleRoof className="text-[4rem]" />
      <h1 className="text-[2.5rem] font-bold mb-2">Community Settings</h1>
      <div className="flex flex-col items-center">
        <div className="flex gap-[10rem] w-full p-5">
          <div className="flex gap-[3rem] text-[1.5rem]">
            <h2 className="font-bold">Total Amount</h2>
            <h2>{totalAmount}</h2>
          </div>
          <div className="flex gap-[3rem] text-[1.5rem]">
            <h2 className="font-bold">Balance</h2>
            <h2>
              {totalAmount -
                communities.reduce(
                  (acc, community) => acc + community.amountAllocated,
                  0
                )}
            </h2>
          </div>
        </div>
        {/* Save Button appears conditionally */}
        {showSaveButton && (
          <button
            onClick={handleSave}
            className="mt-2 bg-blue-500 text-white px-5 py-2 rounded-lg w-[50%]"
          >
            Save Changes
          </button>
        )}
      </div>
      <div className="flex items-center w-full p-5 flex-col">
        <table className="border-[1px] bg-white rounded-xl">
          <thead className="text-[1.5rem]">
            <tr>
              <th>
                <h1 className="p-5">Community</h1>
              </th>
              <th>
                <h1 className="p-5">Percentage</h1>
              </th>
              <th>
                <h1 className="p-5">Allocated Amount</h1>
              </th>
              <th>
                <h1 className="p-5">Balance after Allocation</h1>
              </th>
            </tr>
          </thead>
          <tbody className="text-[1.2rem] text-center">
            {communities.map((community, index) => (
              <tr className="p-10" key={index}>
                <td className="pb-5">
                  <h2 className="p-3">{community.name}</h2>
                </td>
                <td className="pb-5">
                  <input
                    type="number"
                    className="border-2 w-[5rem] p-2 rounded-lg"
                    value={community.percent}
                    onChange={(e) =>
                      handlePercentageChange(
                        index,
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td className="pb-5">
                  <input
                    type="number"
                    className="border-2 w-[50%] p-2 rounded-lg"
                    value={community.amountAllocated}
                    onChange={(e) =>
                      handleAllocatedAmountChange(
                        index,
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td className="pb-5">
                  <h2 className="p-3">{community.balanceAfterAllocation}</h2>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 p-3 bg-green-500 text-white rounded-lg"
        >
          Add Community
        </button>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add New Community</h2>
            <div className="mb-4">
              <label className="block text-lg">Community Name</label>
              <input
                type="text"
                className="border-2 w-full p-2 rounded-lg"
                value={newCommunity.name}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg">Community Head</label>
              <input
                type="text"
                className="border-2 w-full p-2 rounded-lg"
                value={newCommunity.head}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, head: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleAddCommunity}
              className="mt-2 p-3 bg-green-500 text-white rounded-lg"
            >
              Add
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 ml-2 p-3 bg-red-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySettings;
