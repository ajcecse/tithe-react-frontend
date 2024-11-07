import { useState, useEffect } from "react";
import { FaPeopleCarry } from "react-icons/fa";
import axiosInstance from "../axiosConfig.jsx"; // Import your axios instance
import { useNavigate } from "react-router-dom";

const totalAmount = 100000;

const OtherProjectSettings = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
  }); // State to show Save button
  useEffect(() => {
    fetchProjects();
  }, []);
  //Function to fetch communities
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get("/fund/");
      console.log("Communities fetched successfully:", response.data);
      setProjects(response.data);
      // Process the data as needed
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    }
  };

  // Function to calculate cumulative balance after each allocation
  const updateBalances = (updatedProjects) => {
    let runningTotalAllocated = 0;
    const result = updatedProjects.map((project) => {
      runningTotalAllocated += project.amountAllocated;
      return {
        ...project,
        balanceAfterAllocation: totalAmount - runningTotalAllocated,
      };
    });
    setShowSaveButton(true); // Trigger the save button to appear
    return result;
  };

  const handlePercentageChange = (index, newPercentage) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.map((project, i) => {
        if (i === index) {
          const updatedAmount = (totalAmount * newPercentage) / 100;
          return {
            ...project,
            percent: newPercentage,
            amountAllocated: updatedAmount,
          };
        }
        return project;
      });
      return updateBalances(updatedProjects);
    });
  };

  const handleAllocatedAmountChange = (index, newAmount) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.map((project, i) => {
        if (i === index) {
          const updatedPercentage = (newAmount / totalAmount) * 100;
          return {
            ...project,
            amountAllocated: newAmount,
            percent: updatedPercentage,
          };
        }
        return project;
      });
      return updateBalances(updatedProjects);
    });
  };

  // Function to handle save button click, which sends a POST request
  const handleSave = async () => {
    try {
      // await axiosInstance.post("/otherprojectsettings", projects);
      alert("Other Projects settings saved successfully!");
      setShowSaveButton(false);
      navigate(-1);
      // Hide save button after saving
    } catch (error) {
      console.error("Error saving community settings:", error);
    }
  };
  const handleAddCommunity = () => {
    setProjects((prevProjects) => {
      const updatedProjects = [
        ...prevProjects,
        { ...newProject, balanceAfterAllocation: totalAmount },
      ];
      return updateBalances(updatedProjects);
    });
    setIsModalOpen(false); // Close the modal after adding
    setNewProject({ name: "", percent: 0, amountAllocated: 0 }); // Reset form fields
  };

  return (
    <div className="w-full flex flex-col items-center p-[5rem]">
      <FaPeopleCarry className="text-[4rem]" />
      <h1 className="text-[2.5rem] font-bold mb-2">Other Project Settings</h1>
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
                projects.reduce(
                  (acc, project) => acc + project.amountAllocated,
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
                <h1 className="p-5">Project</h1>
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
            {projects.map((project, index) => (
              <tr className="p-10" key={index}>
                <td className="pb-5">
                  <h2 className="p-3">{project.name}</h2>
                </td>
                <td className="pb-5">
                  <input
                    type="number"
                    className="border-2 w-[5rem] p-2 rounded-lg"
                    value={project.percent}
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
                    value={project.amountAllocated}
                    onChange={(e) =>
                      handleAllocatedAmountChange(
                        index,
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td className="pb-5">
                  <h2 className="p-3">{project.balanceAfterAllocation}</h2>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => navigate("/projects")}
          className="mt-5 p-3 bg-green-500 text-white rounded-lg"
        >
          Manage Projects
        </button>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
            <div className="mb-4">
              <label className="block text-lg">Project Name</label>
              <input
                type="text"
                className="border-2 w-full p-2 rounded-lg"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg">Project Head</label>
              <input
                type="text"
                className="border-2 w-full p-2 rounded-lg"
                value={newProject.head}
                onChange={(e) =>
                  setNewProject({ ...newProject, head: e.target.value })
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

export default OtherProjectSettings;
