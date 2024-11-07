import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig.jsx";
import { FaPeopleCarry } from "react-icons/fa";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
  });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all communities
  const fetchProjects = async () => {
    try {
      // Step 1: Get all project IDs
      const projectIDResponse = await axiosInstance.get("/fund/");
      const projectIDs = projectIDResponse.data; // Array of project IDs
      console.log(projectIDs);
      // Step 2: Fetch details for each project using the IDs
      const projectDetailPromises = projectIDs.map((id) =>
        axiosInstance.get(`/fund/${id._id}`)
      );
      const projectDetailsResponses = await Promise.all(projectDetailPromises);

      // Step 3: Extract and set the project details
      const projectDetails = projectDetailsResponses.map((res) => res.data);
      console.log(projectDetails);
      setProjects(projectDetails);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle add project
  const handleAddProject = async () => {
    try {
      await axiosInstance.post("/fund/", newProject);
      fetchProjects(); // Refresh project list
      closeAndResetModal();
    } catch (error) {
      console.error(
        "Error adding project:",
        error.response?.data || error.message
      );
    }
  };

  // Handle update project
  const handleUpdateProject = async () => {
    try {
      await axiosInstance.put(`/fund/${editingProject._id}`, newProject);
      fetchProjects(); // Refresh project list
      closeAndResetModal();
    } catch (error) {
      console.error(
        "Error updating project:",
        error.response?.data || error.message
      );
    }
  };

  // Handle delete project
  const handleDeleteProject = async (id) => {
    try {
      await axiosInstance.delete(`/fund/${id}`);
      fetchProjects(); // Refresh project list
    } catch (error) {
      console.error(
        "Error deleting project:",
        error.response?.data || error.message
      );
    }
  };

  const openModalForEdit = (project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
    });
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setNewProject({
      name: "",
    });
    setEditingProject(null);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <FaPeopleCarry className="text-5xl mb-3" />
      <h1 className="text-3xl font-bold mb-6">Other Projects Management</h1>

      {/* Community List */}
      <div className="w-full text-center flex justify-center">
        <table className="w-[50%] border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">Project Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t">
                <td className="p-4">{project.name}</td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => openModalForEdit(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
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
        Add Project
      </button>

      {/* Modal for Add/Edit Community */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3 space-y-4">
            <h2 className="text-2xl font-bold text-center">
              {editingProject ? "Edit Community" : "Add New Community"}
            </h2>

            <div>
              <label className="block text-lg">Project Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            {/* Save/Cancel Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={
                  editingProject ? handleUpdateProject : handleAddProject
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {editingProject ? "Update" : "Add"}
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

export default ProjectManagement;
