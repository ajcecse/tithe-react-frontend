import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const MoveFamily = () => {
  const [foranes, setForanes] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [koottaymas, setKoottaymas] = useState([]);
  const [families, setFamilies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedForane, setSelectedForane] = useState("");
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedKoottayma, setSelectedKoottayma] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [formData, setFormData] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchID, setSearchID] = useState("");
  const [displayRes, setDisplayRes] = useState(null);
  const relationOptions = [
    "head",
    "bride",
    "groom",
    "son",
    "daughter",
    "father",
    "mother",
    "brother",
    "sister",
  ];
  useEffect(() => {
    fetchForanes();
  }, []);

  useEffect(() => {
    if (selectedForane) fetchParishes(selectedForane);
  }, [selectedForane]);

  useEffect(() => {
    if (selectedParish) fetchKoottaymas(selectedParish);
  }, [selectedParish]);

  useEffect(() => {
    if (selectedKoottayma) fetchFamilies(selectedKoottayma);
  }, [selectedKoottayma]);

  useEffect(() => {
    if (selectedFamily) {
      fetchPersons(selectedFamily);
    }
  }, [selectedFamily]);

  const fetchForanes = async () => {
    try {
      const response = await axiosInstance.get("/forane");
      setForanes(response.data);
    } catch (error) {
      console.error("Error fetching foranes:", error);
    }
  };

  const fetchParishes = async (foraneId) => {
    try {
      const response = await axiosInstance.get(`/parish/forane/${foraneId}`);
      setParishes(response.data || []);
    } catch (error) {
      console.error("Error fetching parishes:", error);
    }
  };

  const fetchKoottaymas = async (parishId) => {
    try {
      const response = await axiosInstance.get(`/koottayma/parish/${parishId}`);
      setKoottaymas(response.data || []);
    } catch (error) {
      console.error("Error fetching koottaymas:", error);
    }
  };

  const fetchFamilies = async (koottaymaId) => {
    try {
      const response = await axiosInstance.get(
        `/family/kottayma/${koottaymaId}`
      );
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchPersons = async (familyId) => {
    try {
      const response = await axiosInstance.get(`/person/family/${familyId}`);
      fetchFamilyDetails(response.data);
      setPersons(response.data || []);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const fetchPersonDetails = async (personId) => {
    try {
      const response = await axiosInstance.get(`/person/${personId}`);
      response.data.dob = formatDate(response.data.dob);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const fetchFamilyDetails = async (persons) => {
    try {
      // Use Promise.all to wait for all asynchronous calls to complete
      const responses = await Promise.all(
        persons.map(async (p) => {
          const response = await axiosInstance.get(`/person/${p._id}`);
          return response.data; // or whatever data you want to return
        })
      );
      setPersons(responses); // This will be an array of all responses
      return responses;
    } catch (error) {
      console.error("Error fetching family details:", error);
      throw error; // Re-throw if you want it to be handled by the caller
    }
  };

  const handleSelectChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };
  function formatDateSubmit(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  const handleMove = (personId) => {
    const personDetails = fetchPersonDetails(personId);
    setFormData(personDetails);
    setIsMoving(!isMoving);
  };

  const handleDelete = async (personId) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await axiosInstance.delete(`/person/${personId}`);
        fetchPersons(selectedFamily);
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // formData.dob = formatDateSubmit(formData.dob);
    try {
      if (isMoving) {
        await axiosInstance.put(`/person/${formData._id}`, formData);
      } else {
        await axiosInstance.post("/person/", {
          ...formData,
          family: selectedFamily,
          forane: selectedForane,
          parish: selectedParish,
        });
      }
      fetchPersons(selectedFamily);
      resetForm();
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  const resetForm = () => {
    setFormData({});
    setIsMoving(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchID(e.target.value);
    console.log(searchID);
    if (searchID.length == 6) {
      setSelectedFamily(searchID);
      setDisplayRes(true);
      console.log(persons[0]);
    } else {
      setDisplayRes(false);
    }
  };
  return (
    <div className="container mx-auto flex flex-col items-center ">
      <h1 className="text-3xl font-bold p-10">Move Person</h1>
      <div className="min w-full flex justify-around">
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">
            Enter Famliy ID and click SPACE
          </label>
          <input
            type="text"
            placeholder="Enter Family ID"
            value={searchID}
            onChange={handleSearchInputChange}
            className="p-2"
          />
        </div>
      </div>
      {selectedFamily && displayRes && (
        <div>
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Persons in Family</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Baptism Name</th>
                  <th className="p-4 border-b">Relation</th>
                  <th className="p-4 border-b">Gender</th>
                  <th className="p-4 border-b">DOB</th>
                  <th className="p-4 border-b">Occupation</th>
                  <th className="p-4 border-b">Education</th>
                </tr>
              </thead>
              <tbody>
                {persons.map((person) => (
                  <tr key={person._id}>
                    <td className="py-2 pl-[3rem] border-b">{person.name}</td>
                    <td className="py-2 pl-[3rem] border-b">
                      {person.baptismName}
                    </td>
                    <td className="py-2 pl-[3rem] border-b">
                      {person.relation}
                    </td>
                    <td className="py-2 pl-[3rem] border-b">{person.gender}</td>
                    <td className="py-2 pl-[3rem] border-b">{person.dob}</td>
                    <td className="py-2 pl-[3rem] border-b">
                      {person.occupation}
                    </td>
                    <td className="py-2 pl-[3rem] border-b">
                      {person.education}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center py-4">
            {" "}
            <h1 className="text-[3rem] font-bold">Current</h1>
            <div className="flex justify-around gap-[10rem] text-2xl">
              <div className="flex gap-2">
                <h1>Forane :</h1>
                <p>{persons[0].forane.name}</p>
              </div>
              <div className="flex gap-2">
                <h1>Parish :</h1>
                <p>{persons[0].parish.name}</p>
              </div>
              <div className="flex gap-2">
                <h1>Kootayma :</h1>
                {/* <p>{persons[0].koottayma.name}</p> */}
              </div>
            </div>
            <div className="min w-full flex justify-around">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Forane
                </label>
                <select
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedForane}
                  onChange={handleSelectChange(setSelectedForane)}
                >
                  <option value="">Select a new Forane</option>
                  {foranes.map((forane) => (
                    <option key={forane._id} value={forane._id}>
                      {forane.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedForane && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Parish
                  </label>
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedParish}
                    onChange={handleSelectChange(setSelectedParish)}
                  >
                    <option value="">Select a new Parish</option>
                    {parishes.map((parish) => (
                      <option key={parish._id} value={parish._id}>
                        {parish.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedParish && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Koottayma
                  </label>
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedKoottayma}
                    onChange={handleSelectChange(setSelectedKoottayma)}
                  >
                    <option value="">Select a new Koottayma</option>
                    {koottaymas.map((koottayma) => (
                      <option key={koottayma._id} value={koottayma._id}>
                        {koottayma.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                className="bg-green-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                onClick={() => handleMove(person._id)}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveFamily;
