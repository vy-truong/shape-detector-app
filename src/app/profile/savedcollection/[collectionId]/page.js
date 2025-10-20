"use client";

import { use, useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import ProfileNav from "../../ProfileNav";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "@mui/material";
import { SlSizeFullscreen } from "react-icons/sl";
import { IoCloseOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import ToolbarActions from "../../components/ToolbarActions";

export default function CollectionDetailPage({ params }) {
  const { collectionId } = use(params);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Selection & editing states
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [editingOutfitId, setEditingOutfitId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);


  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("outfit_collections")
        .select(`
          id,
          name,
          created_at,
          collection_outfits (
            outfit_id,
            outfits (
              id,
              name,
              outfit_items (
                wardrobe_item_id,
                wardrobe_items (
                  id,
                  title,
                  category,
                  image_url
                )
              )
            )
          )
        `)
        .eq("id", collectionId)
        .single();

      if (error) {
        console.error("Error loading collection:", error);
        toast.error("Failed to load collection");
        setCollection(null);
      } else {
        setCollection(data);
      }

      setLoading(false);
    };

    loadCollection();
  }, [collectionId]);

  if (!mounted) return null;
  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (!collection) return <p className="text-white p-10">Collection not found.</p>;

  // ================== Modal Handlers ==================
  const handleOpenModal = (outfit) => {
    setSelectedOutfit(outfit);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOutfit(null);
    setOpenModal(false);
  };

  // ================== Selection Handlers ==================
  const toggleSelectOutfit = (id) => {
    setSelectedOutfits((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedOutfits.length === collection.collection_outfits.length) {
      setSelectedOutfits([]);
    } else {
      setSelectedOutfits(collection.collection_outfits.map((l) => l.outfits.id));
    }
  };

  // ================== Rename Handlers ==================
  const startEditing = (id, currentName) => {
    setEditingOutfitId(id);
    setEditingName(currentName);
  };

  const handleRenameOutfit = async (id) => {
    if (!editingName.trim()) return;

    const { error } = await supabase
      .from("outfits")
      .update({ name: editingName })
      .eq("id", id);

    if (error) {
      toast.error("Failed to rename outfit");
    } else {
      toast.success("Outfit renamed");
      setCollection((prev) => ({
        ...prev,
        collection_outfits: prev.collection_outfits.map((link) =>
          link.outfits.id === id
            ? { ...link, outfits: { ...link.outfits, name: editingName } }
            : link
        ),
      }));
    }

    setEditingOutfitId(null);
    setEditingName("");
  };

  

  // ================== Delete Outfits ==================
  const handleDeleteSelected = async () => {
    if (selectedOutfits.length === 0) return;

    setConfirmOpen(true);

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("outfits")
      .delete()
      .in("id", selectedOutfits);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete selected outfits");
      return;
    }

    // Remove from state
    setCollection((prev) => ({
      ...prev,
      collection_outfits: prev.collection_outfits.filter(
        (link) => !selectedOutfits.includes(link.outfits.id)
      ),
    }));

    toast.success("Selected outfits deleted successfully!");
    setSelectedOutfits([]);
  };

  // (Preview not used but kept for completeness)
  const handlePreviewSelected = () => {
    toast.info(`Previewing ${selectedOutfits.length} selected outfits...`);
  };

  return (
    <main className="bg-heading-hl min-h-screen text-white p-8 relative">
      <ProfileNav />
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-white hover:text-white/80 transition-all mb-6"
      >
        <IoIosArrowRoundBack size={20} />
        <span className="text-md">Back</span>
      </button>

      <h1 className="text-xl font-fraunces mb-5 text-center sm:text-left tracking-wide">
        {collection.name || "Untitled Collection"}
      </h1>

      {/* Add New Outfit Button + Toolbar */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        {/* Left: Add button */}
        <button
          onClick={() => (window.location.href = "/profile/wardrobe")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition-all shadow-md"
        >
          <span className="text-lg">＋</span>
          Add New Outfit
        </button>

        {/* Right: Toolbar (Delete + Select All) */}
        {selectedOutfits.length > 0 && (
          <ToolbarActions
            imagesCount={collection.collection_outfits.length}
            selectedCount={selectedOutfits.length}
            onDeleteSelected={handleDeleteSelected}
            onToggleSelectAll={handleToggleSelectAll}
            showPreview={false}
            showDelete={true}
          />
        )}
      </div>



      {/* ================== Outfit Grid ================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {collection.collection_outfits.map((link) => {
          const outfit = link.outfits;
          const isSelected = selectedOutfits.includes(outfit.id);

          return (
            <div
              key={outfit.id}
              className={`relative bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md transition-transform duration-300 ${
                isSelected ? "ring-2 ring-blue-400 scale-[1.02]" : "hover:scale-[1.02]"
              }`}
            >

              {/* Header: name + edit + fullscreen */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 w-full">
                  {editingOutfitId === outfit.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleRenameOutfit(outfit.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleRenameOutfit(outfit.id)}
                      className="bg-transparent border-b border-white/50 focus:outline-none text-rg capitalize w-full mr-2"
                      autoFocus
                    />
                  ) : (
                    <>
                      <h3 className="text-rg font-regular capitalize">{outfit.name}</h3>
                      <button
                        onClick={() => startEditing(outfit.id, outfit.name)}
                        className="text-white/70 hover:text-blue-300 transition-colors"
                        title="Rename Outfit"
                      >
                        <MdDriveFileRenameOutline size={20} />
                        
                      </button>
                    </>
                  )}
                
                </div>
                  {/* Right side: fullscreen + select */}
                  <div className="flex items-center gap-5 ml-2">
                    <button
                      onClick={() => handleOpenModal(outfit)}
                      className="text-white hover:text-blue-300 transition-colors"
                      title="View Fullsize"
                    >
                      <SlSizeFullscreen size={15} />
                    </button>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOutfit(outfit.id)}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                      title="Select Outfit"
                    />
                  </div>
              </div>

              {/* Outfit Items */}
              <div className="grid grid-cols-2 gap-5 justify-items-center">
                {outfit.outfit_items?.map((itemLink) => {
                  const item = itemLink.wardrobe_items;
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl flex items-center justify-center overflow-hidden hover:bg-white/30 transition-all"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="object-contain w-full h-full p-2 hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================== Modal ================== */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className="flex items-center justify-center"
      >
        <div className="bg-heading-hd text-white rounded-3xl shadow-xl p-10 max-w-2xl w-[90%]">
          {selectedOutfit && (
            <>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-fraunces text-left capitalize">
                  {selectedOutfit.name}
                </h2>
                <button
                  onClick={() => handleCloseModal(true)}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>

              {/* Top items */}
              <div className="flex flex-wrap justify-center gap-8 mb-10">
                {selectedOutfit.outfit_items
                  ?.filter((i) => i.wardrobe_items.category === "top")
                  .map((i) => (
                    <img
                      key={i.wardrobe_items.id}
                      src={i.wardrobe_items.image_url}
                      alt={i.wardrobe_items.title}
                      className="object-contain w-60 h-60 rounded-xl"
                    />
                  ))}
              </div>

              {/* Bottom items */}
              <div className="flex flex-wrap justify-center gap-8">
                {selectedOutfit.outfit_items
                  ?.filter((i) =>
                    ["bottom", "skirt", "pants"].includes(i.wardrobe_items.category)
                  )
                  .map((i) => (
                    <img
                      key={i.wardrobe_items.id}
                      src={i.wardrobe_items.image_url}
                      alt={i.wardrobe_items.title}
                      className="object-contain w-60 h-60 rounded-xl"
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Custom Confirm Delete Modal */}
    <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} className="flex items-center justify-center">
      <div className="bg-[#2a3b59] text-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-center">
        <h3 className="text-xl font-semibold mb-4">Delete Confirmation</h3>
        <p className="text-gray-200 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold">{selectedOutfits.length}</span> outfit(s)?
          <br />This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={async () => {
              setConfirmOpen(false);
              const { error } = await supabase.from("outfits").delete().in("id", selectedOutfits);
              if (error) {
                toast.error("Failed to delete selected outfits");
                return;
              }
              setCollection((prev) => ({
                ...prev,
                collection_outfits: prev.collection_outfits.filter(
                  (link) => !selectedOutfits.includes(link.outfits.id)
                ),
              }));
              setSelectedOutfits([]);
              toast.success("Deleted successfully!");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition-all"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-full transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>


      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
    </main>
  );
}
