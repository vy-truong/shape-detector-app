"use client";

import { useState, useEffect, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Modal } from "@mui/material";
import supabase from "../config/supabaseClient";
export default function WardrobeView() {

  //img upload state, start with empty array (nothing)
  //represents a collection (list) of images, not one single image.
  const [images, setImages] = useState([]);
  const [title, setTitle ] = useState(""); 
  const [category, setCategory] = useState("top");
  const [style, setStyle] = useState(["Work"]); 

  //filter
  const [selectedFilter, setSelectedFilter] = useState("All"); 



  const [pendingImage, setPendingImage ] = useState(null); 
  const [openModal, setOpenModal] = useState(false); 

  const didMount = useRef(false);
  const carouselRef = useRef(null);

   // -------------------- STEP 1: LOAD FROM STORAGE --------------------
  //load img from storage (display them) after first render or every render 
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wardrobe") || "[]");
      setImages(stored);
      console.log("Loaded from localStorage:", stored);
    } catch (e) {
      console.error("parse error", e);
    }
  }, []);

   // -------------------- STEP 2: SAVE TO STORAGE --------------------
   useEffect(() => {
    // run only after the first real mount (ignore React strict-mode duplicate)
    if (didMount.current) {
      localStorage.setItem("wardrobe", JSON.stringify(images));
      console.log("💾 Saved to localStorage:", images);
    } else {
      didMount.current = true;
    }
  }, [images]);


   // -------------------- STEP 3: HANDLE IMAGE UPLOAD --------------------
//convert upload img into supabase file and store its URL
const handleUpload = async (e) => {
  const files = Array.from(e.target.files);

  for (const file of files) {
    // Create unique file path inside the Supabase bucket
    const filePath = `${crypto.randomUUID()}-${file.name}`;

    // Upload the file to Supabase
    const { data, error } = await supabase.storage
      .from("wardrobe-images")    
      .upload(filePath, file);

    if (error) {
      console.error("Supabase upload error:", error.message);
      return;
    }

    //  Get a public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("wardrobe-images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    //  Create new item object using the public URL instead of base64
    setPendingImage({
      id: crypto.randomUUID(),
      url: publicUrl,
      name: file.name,
    });
    setOpenModal(true); // open popup form
  }
  // reset upload input
  e.target.value = "";
};
  // -------------------- HANDLE SAVE DETAILS --------------------
  const handleSaveDetails = () => {
    if (!pendingImage) return;

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
    setStyle("Work");
  };

  // --------------------SCROLL FUNCTIONS --------------------
  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  // -------------------- STEP 5: GROUP IMAGES BY CATEGORY --------------------
  // make each category (top, bottom, dress...) its own section
  //pls help me explain the syntax images.reduce((acc,img)) where did u get all these things from ? 
  //ive never seen those things 
  const grouped = images.reduce((acc, img) => {
    acc[img.category] = acc[img.category] || [];
    acc[img.category].push(img);
    return acc;
  }, {});

  return (
    <section className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-white shadow-sm">
      <h3 className="text-2xl font-fraunces font-medium mb-6 text-center sm:text-left">
        My Wardrobe
      </h3>

      
      {/* -------------------- UPLOAD BOX -------------------- */}
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
        
          {/* -------------------- MUI MODAL -------------------- */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[400px] mx-auto mt-[25vh] space-y-4 shadow-lg">
          <h3 className="text-xl font-fraunces text-heading text-center">
            Add Item Details
          </h3>
          {pendingImage && (
            <div className="flex justify-center">
              <img
                src={pendingImage.url}
                alt={pendingImage.name || "Preview"}
                className="w-40 h-40 object-contain rounded-lg border border-gray-200"
                
              />
            </div>
          )}
          {/* -------------------- FILTER BAR -------------------- */}
          {/* let users filter wardrobe items by style */}


             {/* -------------------- Title input  -------------------- */}
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          />
                  
          <label className="text-white/90 text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-md text-heading bg-white text-sm"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="skirt">Skirt</option>
            <option value="dress">Dress</option>
          </select>

            {/* -------------------- STYLE DROPDOWN  -------------------- */}
          {/* Style tag selector */}
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


          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setOpenModal(false)}
              color="inherit"
              className="text-gray-600"
            >
              Cancel
            </button>
            <button
              variant="contained"
              color="primary"
              onClick={handleSaveDetails}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      </div>
      {/* -------------------- GALLERY SECTION -------------------- */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-white/70 italic">
          No items uploaded yet.
        </p>
      ) : (
        Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-12 relative">
            <h4 className="text-lg sm:text-xl text-white font-fraunces mb-4 capitalize">
              {cat}
            </h4>
            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
            >
              {grouped[cat].map((img) => (
                <div
                  key={img.id}
                  className="min-w-[220px] sm:min-w-[260px] bg-white rounded-3xl shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={img.url}
                    alt={img.title || "Wardrope item"}
                    className="w-full h-48 sm:h-56 object-contain p-6"
                  />
                  <div className="px-4 pb-4">
                    <p className="font-semibold text-heading text-sm truncate">
                      {img.title || "Untitled"}
                    </p>
                    <p className="text-xs text-text/60 capitalize">
                      {img.category} 
                      -
                       {Array.isArray(img.style) ? img.style.join(", ") : img.style}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
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
    </section>
  );
}
