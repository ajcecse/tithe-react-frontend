import { useEffect, useState } from "react";
import { FaPeopleRoof } from "react-icons/fa6";
import axiosInstance from "../axiosConfig.jsx"; // Import your axios instance
import { redirect, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);
  //Function to fetch communities
  const fetchCommunities = async () => {
    try {
      const response = await axiosInstance.get("/community/");
      console.log("Communities fetched successfully:", response.data);
      setCommunities(response.data);
      // Process the data as needed
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    }
  };
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
      // await axiosInstance.post("/communitysettings", communities);
      alert("Community settings saved successfully!");
      setShowSaveButton(false);
      navigate(-1);
      // Hide save button after saving
    } catch (error) {
      console.error("Error saving community settings:", error);
    }
    return redirect("/financesettings");
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
          onClick={() => {
            navigate("/community");
          }}
          className="mt-5 p-3 bg-green-500 text-white rounded-lg"
        >
          Manage Communities
        </button>
      </div>
    </div>
  );
};

export default CommunitySettings;
