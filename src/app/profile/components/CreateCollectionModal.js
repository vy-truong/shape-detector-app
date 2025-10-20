"use client";

import { useState, useEffect } from "react";
import { Modal } from "@mui/material";

export default function CreateCollectionModal({
  open = false,
  onClose,
  onConfirm, // async (name) => void
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white rounded-2xl w-[90%] sm:w-[420px] mx-auto mt-[30vh] p-6 text-heading shadow-lg space-y-4">
        <h3 className="text-lg font-fraunces text-center">
          Name Outfit Collection
        </h3>

        <input
          type="text"
          placeholder="e.g. Office Chic / Date Night"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
          <button
            onClick={() => onConfirm?.(name)}
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
