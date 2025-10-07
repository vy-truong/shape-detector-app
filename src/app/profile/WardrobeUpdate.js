"use client";

export default function WardrobeUpdate() {
  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
          <span className="text-yellow-500">📸</span> Upload Your Outfit Photos
        </h3>

        {/* Form */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Category */}
          <select className="flex-1 border border-gray-200 rounded-md p-2 text-sm text-muted">
            <option>Choose category</option>
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="e.g., Blue silk blouse"
            className="flex-1 border border-gray-200 rounded-md p-2 text-sm text-muted"
          />
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center cursor-pointer text-muted">
          <span className="text-xl mb-1">⬆️</span>
          <p className="text-sm">Click to upload photo</p>
          <p className="text-xs text-mutedlight">
            Background will be automatically removed ✨
          </p>
        </div>

        {/* Note */}
        <p className="text-xs text-muted mt-3">
          ✨ Our AI will automatically remove the background for a professional
          look
        </p>
      </div>

      {/* Empty Wardrobe Placeholder */}
      <div className="border-2 border-dashed border-gray-200 rounded-md py-16 text-center text-muted">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">👕</span>
          <p className="text-base font-medium">Your wardrobe is empty</p>
          <p className="text-sm text-mutedlight">
            Start uploading your clothing items to build your digital closet
          </p>
        </div>
      </div>
    </div>
  );
}
