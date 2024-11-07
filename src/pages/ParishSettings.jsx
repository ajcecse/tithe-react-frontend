import { FaChurch } from "react-icons/fa6";

function ParishSettings() {
  // const individual_pre_proportional_share = individual_collection - individual_prelim

  // if (individual_pre_proportional_share > 0)
  //     const total_pre_proprotional_share = array.map(individual_pre_proportional_share);
  // const parish_percent = 0.75;
  // const percentage_prop_share = ((total_allocation_after_community*parish_percent - total_prelim) / total_pre_proprotional_share) * 100

  // const individual_total_allocated = individual_pre_proportional_share*(percentage_prop_share/100) + individual_prelim
  const totalAmount = 100000;
  return (
    <div className="w-full flex flex-col items-center p-[5rem]">
      <FaChurch className="text-[4rem]" />
      <h1 className="text-[2.5rem] font-bold mb-2">Other Fund Settings</h1>
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
      </div>
    </div>
  );
}

export default ParishSettings;
