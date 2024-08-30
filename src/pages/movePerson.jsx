import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const MovePerson = () => {
  const [persons, setPersons] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [formData, setFormData] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [moveID, setMoveID] = useState("");
  const [displayRes, setDisplayRes] = useState(null);

  useEffect(() => {
    if (selectedFamily) {
      fetchPersons(selectedFamily);
    }
  }, [selectedFamily]);

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

  const handleMove = async (person) => {
    try {
      const response = await axiosInstance.get(`/family/${moveID}`);
      setIsMoving(!isMoving);
      if (response) {
        console.log(response.data);
        fetchPersonDetails(person);
        try {
          if (!isMoving) {
            await axiosInstance.put(`/person/${person}`, {
              ...formData,
              forane: response.data.forane._id,
              parish: response.data.parish._id,
              family: response.data.id,
            });
            setSearchID("");
            setDisplayRes(false);
          }
        } catch (error) {
          console.error("Error saving person:", error);
        }
      } else {
        console.log("shit that didn't work");
      }
    } catch (error) {
      console.error("Error fetching one family:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchID(e.target.value);
    if (searchID.length == 6 && !displayRes) {
      setSelectedFamily(searchID);
      setDisplayRes(true);
    } else {
      setDisplayRes(false);
    }
  };

  const handleMoveInputChange = (e) => {
    setMoveID(e.target.value);
    console.log(moveID);
    if (moveID.length == 6) {
      console.log(persons[0]);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center ">
      <h1 className="text-3xl font-bold p-10">Move Family</h1>
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
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Persons in Family</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-4 border-b">Baptism Name</th>
                <th className="p-4 border-b">Relation</th>
                <th className="p-4 border-b">Gender</th>
                <th className="p-4 border-b">DOB</th>
                <th className="p-4 border-b">Occupation</th>
                <th className="p-4 border-b">Education</th>
                <th className="p-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person._id}>
                  <td className="p-2 border-b flex">{person.name}</td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.baptismName}
                  </td>
                  <td className="py-2 pl-[3rem] border-b">{person.relation}</td>
                  <td className="py-2 pl-[3rem] border-b">{person.gender}</td>
                  <td className="py-2 pl-[3rem] border-b">{person.dob}</td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.occupation}
                  </td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.education}
                  </td>
                  <td className="py-2 pl-[3rem] border-b">
                    <button
                      className="bg-green-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleMove(person._id)}
                    >
                      Move
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isMoving && (
        <div className="min w-full flex flex-col items-center p-10">
          <h1 className="font-bold text-[2rem]">Move to</h1>
          <div className="flex flex-col items-center">
            <label className="block text-gray-700 text-md font-bold m-2">
              Enter Famliy ID and click SPACE
            </label>
            <input
              type="text"
              placeholder="Enter Family ID"
              value={moveID}
              onChange={handleMoveInputChange}
              className="p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovePerson;
