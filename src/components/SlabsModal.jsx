import React, { useState } from "react";

const SlabsModal = ({ isOpen, onClose, onSave }) => {
  const [slabs, setSlabs] = useState([{ minValue: 0, maxValue: "" }]); // Start with the first slab min value of 0

  // Handle input changes for each slab
  const handleSlabChange = (index, field, value) => {
    const newSlabs = [...slabs];
    newSlabs[index][field] = parseInt(value);

    // Adjust values based on constraints
    if (field === "maxValue" && newSlabs[index].maxValue !== "") {
      // Update the min value of the next slab if max value changes
      if (index < newSlabs.length - 1) {
        newSlabs[index + 1].minValue = newSlabs[index].maxValue + 1;
      }
    } else if (field === "minValue" && newSlabs[index].minValue !== "") {
      // Ensure min value is always greater than the previous slab's max value
      if (
        index > 0 &&
        newSlabs[index].minValue <= newSlabs[index - 1].maxValue
      ) {
        newSlabs[index].minValue = newSlabs[index - 1].maxValue + 1;
      }
    }

    setSlabs(newSlabs);
  };

  // Add a new slab with dynamic starting minValue
  const addSlab = () => {
    const lastSlab = slabs[slabs.length - 1];
    const newMinValue = lastSlab.maxValue !== "" ? lastSlab.maxValue + 1 : 0;
    setSlabs([...slabs, { minValue: newMinValue, maxValue: "" }]);
  };

  // Delete a slab
  const deleteSlab = (index) => {
    const newSlabs = slabs.filter((_, i) => i !== index);

    // Re-adjust min values of slabs after the deleted one
    for (let i = 1; i < newSlabs.length; i++) {
      newSlabs[i].minValue = newSlabs[i - 1].maxValue + 1;
    }

    setSlabs(newSlabs);
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
        <div className="flex justify-center py-3 w-full">
          <h2 className="text-2xl font-bold mb-4">Set Slabs</h2>
        </div>
        {slabs.map((slab, index) => (
          <div key={index} className="mb-4 flex space-x-4 items-center">
            <input
              type="number"
              placeholder="Min Value"
              value={slab.minValue}
              onChange={(e) =>
                handleSlabChange(index, "minValue", e.target.value)
              }
              className="border p-2 w-full"
              disabled={index === 0} // Disable editing of the first slab's minValue
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
            <button
              onClick={() => deleteSlab(index)}
              className="bg-red-500 text-white px-2 py-1 rounded-lg"
              disabled={slabs.length === 1} // Disable delete if only one slab exists
            >
              X
            </button>
          </div>
        ))}
        <div className="flex justify-center items-center gap-[3rem]">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={addSlab}
            className="bg-green-500 text-white px-4 py-2 rounded-lg "
          >
            + Add Slab
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlabsModal;
