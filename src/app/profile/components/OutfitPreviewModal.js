"use client";

import { Modal } from "@mui/material";

export default function OutfitPreviewModal({
  open = false,
  onClose,
  selectedItems = [], // array of full image objects
  onSaveClick,        // opens the collection prompt
}) {
    // Create an empty object to hold grouped items
const grouped = selectedItems.reduce((accumulator, currentItem) => {

    // Step 1: Get the category of the current item
    // If the item doesn't have a category, use "other"
    let category;
    if (currentItem.category) {
      category = currentItem.category;
    } else {
      category = "other";
    }
  
    // Step 2: Check if this category already exists in the accumulator
    // If not, create a new array for it
    if (!accumulator[category]) {
      accumulator[category] = [];
    }
  
    // Step 3: Push the current item into the correct category array
    accumulator[category].push(currentItem);
  
    // Step 4: Return the accumulator for the next loop
    return accumulator;
  
  }, {}); // Start with an empty object

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white text-heading rounded-2xl w-[95%] sm:w-[700px] mx-auto mt-[8vh] p-6 space-y-6 shadow-lg overflow-y-auto max-h-[80vh]">
        <h3 className="text-xl font-fraunces text-center">
          Mix &amp; Match Preview
        </h3>

        {/* Layout by category */}
        <div className="space-y-8">
          {["top", "bottom", "skirt", "dress"].map((category) => (
            grouped[category] && (
              <div key={category} className="text-center">
                <p className="text-gray-600 text-sm capitalize mb-2">
                  {category}
                </p>
                <div className="flex justify-center flex-wrap gap-4">
                  {grouped[category].map((item) => (
                    <div key={item.id} className="flex flex-col items-center">
                      <img
                        src={item.url || item.image_url}
                        alt={item.title || "item"}
                        className="w-40 h-40 object-contain rounded-lg border shadow-sm"
                      />
                      <p className="text-sm mt-1 font-medium">
                        {item.title || "Untitled"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={onSaveClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save Outfit
          </button>
        </div>
      </div>
    </Modal>
  );

}
