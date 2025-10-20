"use client";

import { useState, useEffect, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Modal } from "@mui/material";
import supabase from "../../config/supabaseClient";
import WardrobeCarousel from "../components/WardrobeCarousel"; 
import { ToastContainer, toast } from "react-toastify";
import ToolbarActions from "../components/ToolbarActions";
import OutfitPreviewModal from "../components/OutfitPreviewModal";
import OutfitSaveModal from "../components/OutfitSaveModal";
import "react-toastify/dist/ReactToastify.css";

export default function WardrobeView() {
  // ======= STATE DEFINITIONS =======

  // List of all images (local + Supabase)
  const [images, setImages] = useState([]);

  // Fields for the Add/Edit modals
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("top");
  const [style, setStyle] = useState(["Work"]);

  // Track item being edited
  const [editingItem, setEditingItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // For selecting/deleting items in bulk
  const [selectedImages, setSelectedImages] = useState([]);

  // For filtering items by style
  const [selectedFilter, setSelectedFilter] = useState("All");

  // For managing uploads
  const [pendingImage, setPendingImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  //preview modal state 
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState(null);
  // Outfit preview & save-collection modal states
  const [openOutfitModal, setOpenOutfitModal] = useState(false);
  const [showCollectionPrompt, setShowCollectionPrompt] = useState(false);


  // Prevent running localStorage sync on first render
  const didMount = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  // ======= LOAD FROM LOCAL STORAGE ON MOUNT =======
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wardrobe") || "[]");
      setImages(stored);
      console.log("Loaded from localStorage:", stored);
    } catch (e) {
      console.error("Error parsing wardrobe data:", e);
      toast.error("Failed to load saved wardrobe.");
    }
  }, []);


  // ======= SAVE TO LOCAL STORAGE WHEN IMAGES CHANGE =======
  useEffect(() => {
    if (didMount.current) {
      localStorage.setItem("wardrobe", JSON.stringify(images));
      console.log("Saved to localStorage:", images);
    } else {
      didMount.current = true;
    }
  }, [images]);

  useEffect(() => {
    console.log("Selected images:", selectedImages);
  }, [selectedImages]);
  


  // Defer render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  // ======= HANDLE IMAGE UPLOAD =======
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      toast.info(`Uploading ${file.name}...`);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("wardrobe-images")
        .upload(filePath, file);

      if (error) {
        console.error("Supabase upload error:", error.message);
        toast.error("Upload failed. Try again.");
        return;
      }

      // Retrieve public URL for display
      const { data: publicUrlData } = supabase.storage
        .from("wardrobe-images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Store temporarily to let user input title/category
      setPendingImage({
        id: crypto.randomUUID(),
        url: publicUrl,
        name: file.name,
        path: filePath,
      });
      setOpenModal(true);
    }

    // Reset file input
    e.target.value = "";
  };


  // =======  SAVE NEW ITEM DETAILS TO SUPABASE =======
  const handleSaveDetails = async () => {
    if (!pendingImage) return;

    // Insert new item record into Supabase
    const { data, error } = await supabase
      .from("wardrobe_items")
      .insert([
        {
          title,
          style,
          category,
          image_url: pendingImage.url,
          image_path: pendingImage.path,
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      toast.error("Failed to save to Supabase.");
      return;
    }

    // Update local list and reset modal state
    const newItem = {
      id: data.id,            
      title: data.title,
      category: data.category,
      style: data.style,
      url: data.image_url,
      path: data.image_path,
      created_at: data.created_at,
    };

    setImages((prev) => [...prev, newItem]);

    toast.success("Saved to Supabase wardrobe!");

    setPendingImage(null);
    setOpenModal(false);
    setTitle("");
    setStyle(["Work"]);
  };


  // ======= HANDLE IMAGE SELECTION =======
  const toggleSelectImage = (imgId) => {
    setSelectedImages((prev) =>
      prev.includes(imgId)
        ? prev.filter((id) => id !== imgId)
        : [...prev, imgId]
    );
  };


  // ======= EDIT EXISTING IMAGE DETAILS =======
  const handleEditImages = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setStyle(Array.isArray(item.style) ? item.style : [item.style]);
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const updated = images.map((img) =>
      img.id === editingItem.id ? { ...img, title, category, style } : img
    );

    setImages(updated);
    setEditingItem(null);
    setOpenEditModal(false);
    setTitle("");
    setStyle(["Work"]);
    toast.success("Item updated successfully!");
  };


  // ======= DELETE SELECTED IMAGES =======
  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm("Delete all selected images?")) return;

    const toDelete = images.filter((img) => selectedImages.includes(img.id));

    try {
      // Remove files from Supabase Storage
      const { error } = await supabase.storage
        .from("wardrobe-images")
        .remove(toDelete.map((img) => img.path));

      if (error) {
        console.error("Error deleting:", error.message);
        toast.error("Failed to delete from Supabase.");
      } else {
        toast.success(`Deleted ${toDelete.length} image(s)`);
      }

      // Remove from local state
      setImages((prev) =>
        prev.filter((img) => !selectedImages.includes(img.id))
      );
      setSelectedImages([]);
    } catch (err) {
      console.error("Unexpected delete error:", err);
      toast.error("Unexpected error while deleting.");
    }
  };


  // =======FILTER IMAGES BY STYLE AND GROUP BY CATEGORY =======
  const filteredImages =
    selectedFilter === "All"
      ? images
      : images.filter((img) =>
          Array.isArray(img.style)
            ? img.style.includes(selectedFilter)
            : img.style === selectedFilter
        );

  const grouped = filteredImages.reduce((acc, img) => {
    acc[img.category] = acc[img.category] || [];
    acc[img.category].push(img);
    return acc;
  }, {});

  //handle opening preview 
  const handlePreview = (item) => {
    setSelectedItemForPreview(item);
    setOpenPreviewModal(true);
  };

  // ======= SAVE OUTFIT COLLECTION TO SUPABASE =======
  const handleConfirmCollection = async (name) => {

    //valdidate user input. user must enter collection name
    if (!name || !name.trim()) {
      toast.error("Please enter a collection name.");
      return;
    }

    //try to create a new collection (ALBUM)
    try {
      // insert into outfit_collections table
      const { data: collectionData, error: collectionError } = await supabase
        .from("outfit_collections")
        .insert([{ name: name.trim(), created_at: new Date().toISOString() }])
        // return the inserted row so we can use its ID.
        .select("*")
        .single();

      //thru error to stop
      if (collectionError) throw collectionError;

      //get collection id from database outfit_collections 
      const collectionId = collectionData.id;

      //create a NEW OUTFIT record everytime user saved the shi 
      // - outfit name var 
      const outfitName = `Outfit ${new Date().toLocaleTimeString()}`;
      const { data: outfitData, error: outfitError } = await supabase
      .from("outfits")
      .insert([
        {
          name: outfitName,
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

      //thru error
      if (outfitError) throw outfitError;
      // Save the new outfit's ID to link with wardrobe items.
      const outfitId = outfitData.id;

      //---------- Link selected wardrobe items to this outfit

      // insert selected wardrobe items into outfit_items table
      //find all outfit user select using filter then map those out 
      const selectedItems = images.filter((img) => selectedImages.includes(img.id));
      
      const outfitItems = selectedItems.map((item) => ({
        outfit_id: outfitId,
        wardrobe_item_id: item.id,
        created_at: new Date().toISOString(),
      }));

      // Insert all these links into 'outfit_items' table at once.
      const { error: outfitItemsError } = await supabase
      .from("outfit_items")
      .insert(outfitItems);

    // If inserting failed, stop and show error.
    if (outfitItemsError) throw outfitItemsError;

    // ==============================
    // Link this outfit to the chosen collection
    //connect the outfit we just made(outfit_item) with the collection album.

    const { error: linkError } = await supabase
    .from("collection_outfits")
    .insert([
      {
        collection_id: collectionId,
        outfit_id: outfitId,
        created_at: new Date().toISOString(),
      },
    ]);
    //show error if fail 
    if (linkError) throw linkError;

    //-----------   
    // /show success toast and reset all modal / selections.
      toast.success(`Outfit saved to collection: "${name.trim()}"`);
      setShowCollectionPrompt(false);
      setOpenOutfitModal(false);
      setSelectedImages([]);

    } catch (error) {
      console.error("Error saving outfit:", error);
      toast.error("Failed to save supabase outfit collection.");
    }
  };

  // ===== RENDER COMPONENT =======
  return (
    <section className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-white shadow-sm">
      {/* Page Title */}
      <h3 className="text-2xl font-fraunces font-medium mb-3 text-center sm:text-left">
        My Wardrobe
      </h3>
      <div className="flex justify-start mb-5">
        <a
          href="https://www.remove.bg/upload"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-heading px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition"
        >
          Remove img background
        </a>
      </div>

      {/* ===== Upload Section ===== */}
      <div className="bg-heading-hd/60 rounded-2xl p-6 sm:flex-row items-center mb-10">
        <label className="flex flex-col items-center cursor-pointer text-center">
          <IoCloudUploadOutline size={45} className="text-white mb-2" />
          <span className="text-sm text-white/80">
            Click or drag to upload images
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {/* Modal for adding new item details after upload */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[400px] mx-auto mt-[25vh] space-y-4 shadow-lg">
            <h3 className="text-xl font-fraunces text-heading text-center">
              Add Item Details
            </h3>

            {/* Preview uploaded image */}
            {pendingImage && (
              <div className="flex justify-center">
                <img
                  src={pendingImage.url}
                  alt={pendingImage.name || "Preview"}
                  className="w-40 h-40 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Input fields for title, category, and style */}
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="text-gray-700 text-sm mt-2">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-md text-heading bg-white text-sm w-full"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="skirt">Skirt</option>
              <option value="dress">Dress</option>
            </select>

            {/* Style tag buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-gray-700 text-sm">Style:</label>
              <div className="flex flex-wrap gap-2">
                {["Work", "Daily", "Formal", "Casual", "Dates"].map(
                  (option) => {
                    const selected = style.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setStyle((prev) =>
                            selected
                              ? prev.filter((s) => s !== option)
                              : [...prev, option]
                          )
                        }
                        className={`px-3 py-1 rounded-full border transition-all text-sm ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Modal action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  toast.info("Upload canceled.");
                  setOpenModal(false);
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* ===== Toolbar + Filter Row ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left: actions */}
        <ToolbarActions
          imagesCount={images.length}
          selectedCount={selectedImages.length}
          onDeleteSelected={handleDeleteSelected}
          onToggleSelectAll={() => {
            if (selectedImages.length === images.length) {
              setSelectedImages([]);
            } else {
              setSelectedImages(images.map((img) => img.id));
            }
          }}
          onPreviewOutfit={() => {
            if (selectedImages.length < 2) {
              toast.info("Select at least two items to preview an outfit.");
              return;
            }
            setOpenOutfitModal(true);
          }}
        />

        {/* Right: filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="styleFilter" className="text-sm font-medium text-white">Filter</label>
          <select
            id="styleFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 rounded-md text-heading bg-white text-sm w-[180px]"
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Daily">Daily</option>
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
            <option value="Dates">Dates</option>
          </select>
        </div>
      </div>




      {/* ===== Shared Carousel Component ===== */}
      <WardrobeCarousel
        groupedImages={grouped}
        selectedImages={selectedImages}
        onSelectImage={toggleSelectImage}
        onEditImage={handleEditImages}
        showEditButton={true}
        onPreview = {handlePreview}
      />

     
      {/* Toast notification container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        theme="colored"
      />

      {/* ===== Edit Item Modal ===== */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[400px] mx-auto mt-[25vh] space-y-4 shadow-lg">
          <h3 className="text-xl font-fraunces text-heading text-center">
            Edit Item
          </h3>

          {/* Edit title */}
          <input
            type="text"
            placeholder="Edit title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Edit category */}
          <label className="text-gray-700 text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-md text-heading bg-white text-sm w-full"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="skirt">Skirt</option>
            <option value="dress">Dress</option>
          </select>

          {/* Edit style tags */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm">Style:</label>
            <div className="flex flex-wrap gap-2">
              {["Work", "Daily", "Formal", "Casual", "Dates"].map((option) => {
                const selected = style.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setStyle((prev) =>
                        selected
                          ? prev.filter((s) => s !== option)
                          : [...prev, option]
                      )
                    }
                    className={`px-3 py-1 rounded-full border transition-all text-sm ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setOpenEditModal(false)}
              className="text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
      {/* ===== Preview Mix & Match Modal ===== */}
      {/* Mix & Match Preview Modal */}
<OutfitPreviewModal
  open={openOutfitModal}
  onClose={() => setOpenOutfitModal(false)}
  selectedItems={images.filter((img) => selectedImages.includes(img.id))}
  onSaveClick={() => setShowCollectionPrompt(true)}
/>

{/* Create Collection Prompt */}
{/* <CreateCollectionModal
  open={showCollectionPrompt}
  onClose={() => setShowCollectionPrompt(false)}
  onConfirm={handleConfirmCollection}
/> */}
<OutfitSaveModal
  open={showCollectionPrompt}
  onClose={() => setShowCollectionPrompt(false)}
  selectedImages={selectedImages}
  images={images}
  onSuccess={() => {
    setShowCollectionPrompt(false);
    setOpenOutfitModal(false);
    setSelectedImages([]);
  }}
/>




    </section>
  );
}
