"use client";

import { useState, useEffect, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Modal } from "@mui/material";
import supabase from "../../config/supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   

export default function WardrobeView() {

  //img upload state, start with empty array (nothing)
  //represents a collection (list) of images, not one single image.
  const [images, setImages] = useState([]);
  const [title, setTitle ] = useState(""); 
  const [category, setCategory] = useState("top");
  const [style, setStyle] = useState(["Work"]); 

  //update img info 
  const [editingItem, setEditingItem] = useState(null); // store the item being edited
  const [openEditModal, setOpenEditModal] = useState(false); // control modal visibility

  //select img 
  const [selectedImages, setSelectedImages] = useState([]);

  //filter
  const [selectedFilter, setSelectedFilter] = useState("All"); 

  const [pendingImage, setPendingImage ] = useState(null); 
  const [openModal, setOpenModal] = useState(false); 

  const didMount = useRef(false);
  const carouselRef = useRef(null);

   // -------------------- STEP 1: LOAD FROM STORAGE --------------------
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wardrobe") || "[]");
      setImages(stored);
      console.log("Loaded from localStorage:", stored);
    } catch (e) {
      console.error("parse error", e);
      toast.error("Failed to load local wardrobe.");
    }
  }, []);

   // -------------------- STEP 2: SAVE TO STORAGE --------------------
   useEffect(() => {
    if (didMount.current) {
      localStorage.setItem("wardrobe", JSON.stringify(images));
      console.log("💾 Saved to localStorage:", images);
    } else {
      didMount.current = true;
    }
  }, [images]);


// -------------------- STEP 3: HANDLE IMAGE UPLOAD --------------------
const handleUpload = async (e) => {
  const files = Array.from(e.target.files);

  for (const file of files) {
    const filePath = `${crypto.randomUUID()}-${file.name}`;
    toast.info(`⏳ Uploading ${file.name}...`); // ⚡ notify user upload started

    const { data, error } = await supabase.storage
      .from("wardrobe-images")    
      .upload(filePath, file);

    if (error) {
      console.error("Supabase upload error:", error.message);
      toast.error("Upload failed. Try again.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("wardrobe-images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    setPendingImage({
      id: crypto.randomUUID(),
      url: publicUrl,
      name: file.name,
      path: filePath, 
    });
    setOpenModal(true);
  }

  e.target.value = "";
};

  // -------------------- HANDLE SAVE DETAILS --------------------
  const handleSaveDetails = async () => {
    if (!pendingImage) return;

     const { data, error } = await supabase
     .from("wardrobe_items")
     .insert([
      {
        title,
        style,
        image_url: pendingImage.url,
        image_path: pendingImage.path,
      } 
    ]).select("*");
    console.log("🧠 Insert result:", data, error);

    if (error) {
      console.error("Supabase insert error:", error.message);
      toast.error("Failed to save to Supabase.");
    } else {
      toast.success("✅ Saved to Supabase wardrobe!");
    }
    

    const newItem = {
      ...pendingImage,
      title,
      style,
      category,
      created_at: new Date().toISOString(),
    };

    setImages((prev) => [...prev, newItem]);
    setPendingImage(null);
    setOpenModal(false);
    setTitle("");
    setStyle(["Work"]);

    toast.success("Item added to wardrobe!");
  };
  
   // -------------------- TOGGLE SELECTION --------------------
  const toggleSelectImage = (imgId) => {
    let updatedSelections = [...selectedImages];
    const alreadySelected = updatedSelections.includes(imgId);
    if (alreadySelected) {
      updatedSelections = updatedSelections.filter((id) => id !== imgId);
    } else {
      updatedSelections.push(imgId);
    }
    setSelectedImages(updatedSelections);
  };

  // -------------------- EDIT IMAGES --------------------
  const handleEditImages = (item) => {
    setEditingItem(item); 
    setTitle(item.title); 
    setCategory(item.category); 
    setStyle(Array.isArray(item.style) ? item.style : [item.style]); 
    setOpenEditModal(true);
  }

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const updated = images.map((img) =>
      img.id === editingItem.id
        ? { ...img, title, category, style }
        : img
    );

    setImages(updated);
    setEditingItem(null);
    setOpenEditModal(false);
    setTitle("");
    setStyle(["Work"]);
    toast.success("Item updated successfully!");
  };


   // -------------------- DELETE SELECTED IMAGES --------------------
   const handleDeleteSelected = async () => {
    if(selectedImages.length === 0)
      return; 
    if(!window.confirm("Delete all selected images ?"))
      return; 

    const toDelete = images.filter((img) => selectedImages.includes(img.id)); 
    try {
      const {error} = await supabase.storage
      .from("wardrobe-images")
      .remove(toDelete.map((img) => img.path)); 

      if (error) {
        console.error("Error deleting:", error.message);
        toast.error("Failed to delete from Supabase.");
      } else {
        console.log("Deleted selected images:", toDelete);
        toast.success(`Deleted ${toDelete.length} image(s)`);
      }

      setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id))); 
      setSelectedImages([]); 
    } catch (err) { 
      console.error("error: ", err);
      toast.error("Unexpected error while deleting.");
    }
   }

  // --------------------SCROLL FUNCTIONS --------------------
  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  // --------------------filter img  --------------------
  const filteredImages = 
  selectedFilter === "All"
  ? images 
  : images.filter((img) => {
    if (Array.isArray(img.style)) {
      return img.style.includes(selectedFilter); 
    } else { 
      return img.style === selectedFilter;
    }
  });
  
  // -------------------- GROUP IMAGES BY CATEGORY --------------------
  const grouped = filteredImages.reduce((acc, img) => {
    acc[img.category] = acc[img.category] || [];
    acc[img.category].push(img);
    return acc;
  }, {});

  return (
    <section className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-white shadow-sm">
      <h3 className="text-2xl font-fraunces font-medium mb-6 text-center sm:text-left">
        My Wardrobe
      </h3>

      {/* ⚡ Toast container to display all notifications */}
      {/* -------------------- UPLOAD BOX -------------------- */}
      <div className="bg-heading-hd/60 rounded-2xl p-6 sm:flex-row items-center mb-10">
        <label className="flex flex-col items-center cursor-pointer text-center">
          <IoCloudUploadOutline size={45} className="text-white mb-2" />
          <span className="text-sm text-white/80">Click or drag to upload images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
  
        {/* -------------------- MUI MODAL -------------------- */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[400px] mx-auto mt-[25vh] space-y-4 shadow-lg">
            <h3 className="text-xl font-fraunces text-heading text-center">Add Item Details</h3>
  
            {pendingImage && (
              <div className="flex justify-center">
                <img
                  src={pendingImage.url}
                  alt={pendingImage.name || "Preview"}
                  className="w-40 h-40 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}
  
            {/* -------------------- Title input -------------------- */}
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
  
            {/* Category dropdown */}
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
  
            {/* -------------------- STYLE TAG SELECTOR -------------------- */}
            <div className="flex flex-col gap-2 mt-2">
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
  
            {/* Modal buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  toast.info("⚪ Canceled upload.");
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
  
      {/* -------------------- FILTER DROPDOWN -------------------- */}
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label htmlFor="styleFilter" className="text-sm font-medium text-white">
            Filter
          </label>
          <select
            id="styleFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 rounded-md text-heading bg-white text-sm w-[80%] sm:w-[200px]"
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

        {/* --------------------DELETE / DELETE ALL IMG  -------------------- */}
        {images.length > 0 && (
          <div className="flex flex-wrap justify-center sm:justify-between items-center mb-6 gap-3">
            {selectedImages.length > 0 ? (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 transition-all"
              >
                Delete Selected ({selectedImages.length})
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={() => {
                if (selectedImages.length === images.length) {
                  setSelectedImages([]);
                } else {
                  setSelectedImages(images.map((img) => img.id));
                }
              }}
              className="text-sm text-white underline hover:text-gray-200 transition-all"
            >
              {selectedImages.length === images.length ? "Unselect All" : "Select All"}
            </button>
          </div>
        )}
  
      {/* -------------------- GALLERY -------------------- */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-white/70 italic">No items uploaded yet.</p>
      ) : (
        Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-12 relative">
            <h4 className="text-lg sm:text-xl text-white font-fraunces mb-4 capitalize">{cat}</h4>
  
            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
            >
              {grouped[cat].map((img) => {
                const selected = selectedImages.includes(img.id);
                return (
                  <div
                    key={img.id}
                    className={`relative min-w-[220px] sm:min-w-[260px] rounded-3xl shadow-md hover:shadow-xl transition-all ${
                      selected ? " bg-white" : "bg-white"
                    }`}
                  >
                    {/* selection square */}
                    <div
                      onClick={() => toggleSelectImage(img.id)}
                      className={`absolute top-5 right-5 w-5 h-5 border-2 rounded-sm cursor-pointer transition-all ${
                        selected
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      title="Select image"
                    ></div>
  
                    <img
                      src={img.url}
                      alt={img.title || "Wardrobe item"}
                      className="w-full h-48 sm:h-56 object-contain p-6"
                    />
                    <div className="px-4 pb-4">
                      <p className="font-semibold text-heading text-sm truncate">
                        {img.title || "Untitled"}
                      </p>
                      <p className="text-xs text-text/60 capitalize">
                        {img.category} -{" "}
                        {Array.isArray(img.style)
                          ? img.style.join(", ")
                          : img.style}
                      </p>
                       {/* Edit img button */}
                       <button
                        onClick={() => handleEditImages(img)}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
  
            {/* ARROWS outside map */}
            <button
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
              onClick={scrollLeft}
            >
              <IoIosArrowBack size={24} />
            </button>
            <button
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
              onClick={scrollRight}
            >
              <IoIosArrowForward size={24} />
            </button>
          </div>
        ))
      )}
          <ToastContainer
      position="top-center"  // 👈 this moves the toast to the top center
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" // optional: gives a nice blue theme
    />
      {/* -------------------- EDIT MODAL -------------------- */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[400px] mx-auto mt-[25vh] space-y-4 shadow-lg">
          <h3 className="text-xl font-fraunces text-heading text-center">
            Edit Item
          </h3>

          <input
            type="text"
            placeholder="Edit title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          />

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

    </section>
  );
  
}
