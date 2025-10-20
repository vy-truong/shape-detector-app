"use client";

import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { toast } from "react-toastify";
import supabase from "../../config/supabaseClient";

export default function OutfitSaveModal({
  open,
  onClose,
  selectedImages,
  images,
  onSuccess,
}) {
  // state for dropdown and form inputs
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [outfitName, setOutfitName] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch all existing collections when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchCollections = async () => {
      const { data, error } = await supabase
        .from("outfit_collections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching collections:", error);
      } else {
        setCollections(data || []);
      }
    };

    fetchCollections();
  }, [open]);

  // reset form on modal close
  useEffect(() => {
    if (!open) {
      setSelectedCollection("");
      setNewCollectionName("");
      setOutfitName("");
      setLoading(false);
    }
  }, [open]);

  // main save handler
  const handleSave = async () => {
    if (!outfitName.trim()) {
      toast.error("Please enter an outfit name.");
      return;
    }

    const finalCollectionName =
      selectedCollection === "new"
        ? newCollectionName.trim()
        : selectedCollection;

    if (!finalCollectionName) {
      toast.error("Please choose or enter a collection name.");
      return;
    }

    try {
      setLoading(true);

      // Step 1 — find or create collection
      let collectionId;
      const { data: existing, error: findError } = await supabase
        .from("outfit_collections")
        .select("*")
        .eq("name", finalCollectionName)
        .maybeSingle();

      if (findError) throw findError;

      if (existing) {
        collectionId = existing.id;
      } else {
        const { data: newCollection, error: insertError } = await supabase
          .from("outfit_collections")
          .insert([
            { name: finalCollectionName, created_at: new Date().toISOString() },
          ])
          .select("*")
          .single();

        if (insertError) throw insertError;
        collectionId = newCollection.id;
      }

      // Step 2 — create new outfit
      const { data: outfitData, error: outfitError } = await supabase
        .from("outfits")
        .insert([
          { name: outfitName.trim(), created_at: new Date().toISOString() },
        ])
        .select("*")
        .single();

      if (outfitError) throw outfitError;
      const outfitId = outfitData.id;

      // Step 3 — link wardrobe items to outfit
      const selectedItems = images.filter((img) =>
        selectedImages.includes(img.id)
      );

      const outfitItems = selectedItems.map((item) => ({
        outfit_id: outfitId,
        wardrobe_item_id: item.id,
        created_at: new Date().toISOString(),
      }));

      const { error: outfitItemsError } = await supabase
        .from("outfit_items")
        .insert(outfitItems);

      if (outfitItemsError) throw outfitItemsError;

      // Step 4 — link outfit to collection
      const { error: linkError } = await supabase
        .from("collection_outfits")
        .insert([
          {
            collection_id: collectionId,
            outfit_id: outfitId,
            created_at: new Date().toISOString(),
          },
        ]);

      if (linkError) throw linkError;

      toast.success(
        `Outfit "${outfitName}" saved to collection "${finalCollectionName}".`
      );

      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast.error("Failed to save outfit or collection.");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white text-heading rounded-2xl w-[90%] sm:w-[450px] mx-auto mt-[15vh] p-6 space-y-5 shadow-lg">
        <h3 className="text-xl font-fraunces text-center mb-2">
          Save Your Outfit
        </h3>

        {/* outfit name input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Outfit Name
          </label>
          <input
            type="text"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            placeholder="e.g. Coffee Date Outfit"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* choose existing collection */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Choose Collection
          </label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select an existing collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.name}>
                {col.name}
              </option>
            ))}
            <option value="new">Create New Collection</option>
          </select>
        </div>

        {/* new collection name input */}
        {selectedCollection === "new" && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              New Collection Name
            </label>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. Fall Work Looks"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        )}

        {/* action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
