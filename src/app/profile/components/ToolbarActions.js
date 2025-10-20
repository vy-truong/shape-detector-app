"use client";

export default function ToolbarActions({
  //create multiple select img
  //count, delete, toggle, preview 
  imagesCount = 0,
  selectedCount = 0,
  onDeleteSelected,
  onToggleSelectAll,
  onPreviewOutfit, // opens outfit modal
  showPreview = true, //show preview 
  showDelete = true,
}) {
  if (imagesCount === 0) return null;

  return (
    <div className="flex flex-wrap justify-center sm:justify-between items-center mb-6 gap-3">
      {/* ==== LEFT SIDE: Delete & Preview Buttons ==== */}
      <div className="flex items-center gap-3">
      {showPreview && (
        <button
          onClick={onPreviewOutfit}
          disabled={selectedCount < 2}
          className={`text-sm px-4 py-2 rounded-full transition-all 
            
            ${
                // only allow styling when chosing >2 img 
            selectedCount < 2
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Preview Outfit
          {selectedCount > 1 ? ` (${selectedCount})` : ""}
        </button>
      )}

    {showDelete && (
        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className={`text-sm px-4 py-2 rounded-full transition-all ${
            selectedCount === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Delete Selected
          {selectedCount > 0 ? ` (${selectedCount})` : ""}
        </button>
    )}
          {/* ==== RIGHT SIDE: Select All Toggle ==== */}
        <button
            onClick={onToggleSelectAll}
            className="text-sm text-white underline hover:text-gray-200 transition-all"
        >
            {selectedCount === imagesCount ? "Unselect All" : "Select All"}
        </button>

      </div>
    </div>
  );
}
