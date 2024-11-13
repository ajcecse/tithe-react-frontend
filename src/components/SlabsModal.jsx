import React, { useState } from "react";

const SlabsModal = ({ isOpen, onClose, onSave }) => {
  const [slabs, setSlabs] = useState([{ minValue: 0, maxValue: "" }]); // Start with the first slab min value of 0

  // Handle input changes for each slab
  const handleSlabChange = (index, field, value) => {
    const newSlabs = [...slabs];
    newSlabs[index][field] = value;
    setSlabs(newSlabs);
  };

  // Add a new slab with dynamic starting minValue
  const addSlab = () => {
    const lastSlab = slabs[slabs.length - 1];
    const newMinValue =
      lastSlab.maxValue !== "" ? parseInt(lastSlab.maxValue) + 1 : 0;

    setSlabs([...slabs, { minValue: newMinValue, maxValue: "" }]);
  };

  // Save handler
  const handleSave = () => {
    onSave(slabs); // Save slabs data to parent or backend
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null; // Render only when isOpen is true

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Set Slabs</h2>

        {slabs.map((slab, index) => (
          <div key={index} className="mb-4 flex space-x-4">
            <input
              type="number"
              placeholder="Min Value"
              value={slab.minValue}
              onChange={(e) =>
                handleSlabChange(index, "minValue", e.target.value)
              }
              className="border p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max Value"
              value={slab.maxValue}
              onChange={(e) =>
                handleSlabChange(index, "maxValue", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
        ))}

        <button
          onClick={addSlab}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          + Add Slab
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SlabsModal;
