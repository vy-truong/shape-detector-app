"use client";

import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileNav from "../ProfileNav";
// import ToolbarActions from "../components/ToolbarActions";
// import InlineRename from "./components/InlineRename";
import { useRouter } from "next/navigation";
import { Modal } from "@mui/material";


export default function SavedCollectionPage() {
  const [mounted, setMounted] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const router = useRouter();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");


  useEffect(() => setMounted(true), []);

  // Load collections on mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data, error } = await supabase
          .from("outfit_collections")
          .select("id, name, created_at");

        if (error) {
          console.error("Error fetching collections:", error);
          toast.error("Failed to load collections");
          return;
        }

        console.log("Fetched collections:", data); 
        setCollections(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Unexpected error while loading collections");
      }
    };

    fetchCollections();
  }, []);

  if (!mounted) return null;

  // Toggle collection selection
  const toggleSelectCollection = (id) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Delete selected collections
  const handleDeleteSelected = async () => {
    if (selectedCollections.length === 0) return;
    if (!window.confirm("Delete selected collections?")) return;

    const { error } = await supabase
      .from("outfit_collections")
      .delete()
      .in("id", selectedCollections);

    if (error) {
      console.error(error);
      toast.error("Failed to delete collections");
    } else {
      toast.success("Deleted successfully");
      setCollections((prev) =>
        prev.filter((c) => !selectedCollections.includes(c.id))
      );
      setSelectedCollections([]);
    }
  };

  // Add new collection
  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }
  
    const { data, error } = await supabase
      .from("outfit_collections")
      .insert([{ name: newCollectionName, created_at: new Date().toISOString() }])
      .select("*")
      .single();
  
    if (error) {
      console.error(error);
      toast.error("Failed to create collection");
    } else {
      setCollections((prev) => [...prev, data]);
      toast.success("New collection added");
      setOpenAddModal(false);
      setNewCollectionName("");
    }
  };
  

  // Inline rename
  const handleRename = async (id, newName) => {
    const { error } = await supabase
      .from("outfit_collections")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      console.error("Rename failed:", error);
      toast.error("Rename failed");
    } else {
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
      );
    }
  };

  return (
    <section className="bg-heading-hl min-h-screen p-8 sm:p-12 text-white">
      <ProfileNav/>
      <h3 className="text-2xl font-fraunces font-medium mb-6 text-center sm:text-left">
        Saved Collections
      </h3>
   {/* ===== FIX 3: Add Add/Delete controls (like WardrobeView) ===== */}
   <div className="flex flex-wrap justify-center sm:justify-between items-center mb-6 gap-3">
        {selectedCollections.length > 0 ? (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 transition-all"
          >
            Delete Selected ({selectedCollections.length})
          </button>
        ) : (
          <div></div>
        )}

        {/* add new collection */}
        <div className="flex gap-4">
          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            + New Collection
          </button>

          <button
            onClick={() => {
              if (selectedCollections.length === collections.length) {
                setSelectedCollections([]);
              } else {
                setSelectedCollections(collections.map((c) => c.id));
              }
            }}
            className="text-sm text-white underline hover:text-gray-200 transition-all"
          >
            {selectedCollections.length === collections.length
              ? "Unselect All"
              : "Select All"}
          </button>
        </div>
      </div>

      {/* ===== FIX 4: Add fallback text if empty ===== */}
      {collections.length === 0 ? (
        <p className="text-center text-gray-200 italic mt-8">
          No collections found. Try adding one.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`relative p-5 rounded-xl bg-heading-hd/60 hover:bg-heading-hd transition-all cursor-pointer ${
                selectedCollections.includes(collection.id)
                  ? "ring-2 ring-blue-400"
                  : ""
              }`}
            >
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedCollections.includes(collection.id)}
                onChange={() => toggleSelectCollection(collection.id)}
                className="absolute top-3 right-3 w-5 h-5 accent-blue-500"
              />

              {/* FIX 5: Show name directly instead of InlineRename for now */}
              <h4 className="text-lg font-semibold text-white mb-1">
                {collection.name || "Untitled Collection"}
              </h4>

              <p className="text-sm text-gray-200 mt-2">Outfits:</p>

              {/* FIX 6: Correct navigation path */}
              <button
                onClick={() =>
                  router.push(`/profile/savedcollection/${collection.id}`)
                }
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-all"
              >
                View Collection
              </button>
            </div>
          ))}
        </div>
      )}
      {/* ===== Add New Collection Modal ===== */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        className="flex items-center justify-center"
      >
        <div className="bg-heading-hd text-white rounded-xl p-8 w-[90%] max-w-md shadow-2xl text-center">
          <h3 className="text-xl font-semibold mb-4">Create New Collection</h3>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection name"
            className="w-full bg-white p-3 rounded-md text-black mb-6 outline-none"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddCollection}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setOpenAddModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-full transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>


      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
    </section>
  );
}
