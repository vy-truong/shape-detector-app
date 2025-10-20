"use client";


import { useEffect, useRef, useState } from "react";
import  supabase  from "../config/supabaseClient"
import { IoShirtOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { shapeExplanations } from "../data/shapeExplanations.js";
import { styleGuides } from "../data/styleGuides.js";
import { Collapse } from "@mui/material";

export default function ResultCard({
  bodyShape, // the shape result ("Pear", "Hourglass", etc)
  bust,
  waist,
  highHip,
  hip,
  units = "in", // default to inches if not passed
  products = [], 
  showSaveButton = false, // only show on ShapeFinder page, not Profile
  onSave, // optional save fn, otherwise fallback to defaultSave
}) {
  if (!bodyShape) return null; // no shape yet? just render nothing

  const [filter, setFilter] = useState("all"); // filter is for categories (top, dress, etc)
  const [results, setResults] = useState([]);
  const carouselRef = useRef(null); // grab carousel DOM to scroll programmatically

  //DISPLAY MODE: SINGLE MODE AND  STYLING MODE
  const [displayMode, setDisplayMode] = useState('single'); 

  //EXPAND TEXT USESTATE 
  // const [expandedText, setExpandedText] = useState(false);


  //STYLING MODE USE STATE 
  const CATEGORY_LIST = ["top", "bottom", "skirt", "dress"];
  const [visibleRows, setVisibleRows] = useState([]); 
  // one ref per row (so each row scrolls independently)
  const rowRefs = useRef({});

  const toggleRow = (categories) => {
    setVisibleRows((prev) =>
      prev.includes(categories) ? prev.filter((category) => category !== categories) : [...prev, categories]
    );
  };

  //move carousel right
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };
  // move carousel left
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  // Mobile swipe handlers
const touchStartX = useRef(0);

const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchMove = (e, ref) => {
  if (!ref.current) return;
  const diff = touchStartX.current - e.touches[0].clientX;
  if (Math.abs(diff) > 30) {
    // Swipe threshold
    ref.current.scrollBy({
      left: diff > 0 ? 200 : -200,
      behavior: "smooth",
    });
    touchStartX.current = e.touches[0].clientX;
  }
};

  const defaultSave = async (e) => {
    e.preventDefault();
  
    const newResult = {
      id: crypto.randomUUID(),
      bodyshape: bodyShape,
      bust: Number(bust),
      waist: Number(waist),
      highHip: Number(highHip),
      hip: Number(hip),
      units,
      products, 
    };
  
    try {
      const { data: savedResult, error: resultError } = await supabase
        .from("saved_results")
        .insert([newResult])
        .select();
  
      if (resultError) throw resultError;
  
      console.log("Saved to Supabase:", savedResult[0]);
      alert("Saved to your profile!");
    } catch (err) {
      console.error("⚠️ Supabase failed, saving locally:", err);
  
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem("results") || "[]");
      const fallback = {
        ...newResult,
        created_at: new Date().toLocaleString("en-CA", 
          {
          timeZone: "America/Edmonton",
          }
        )
      };
      localStorage.setItem("results", JSON.stringify([...stored, fallback]));
      alert("Saved locally (offline mode).");
    }
  };
  return (
    <section className=" w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-20 py-10">

        {/* ===== BODY SHAPE RESULT SECTION ===== */}
        <section className="bg-heading-hl rounded-3xl shadow-sm p-6 sm:p-15 mt-5 text-center">
          <div className="max-w-3xl mx-auto my-10">
            <h2 className="text-2xl sm:text-4xl font-fraunces font-light text-white mb-5">
              Your Result: <span className="text-white">{bodyShape}</span>
            </h2>
            <p className="text-text sm:text-lg mb-15">
              {shapeExplanations?.[bodyShape]?.text}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center mb-6">
              {[
                { label: "Bust", value: `${bust}${units}` },
                { label: "Waist", value: `${waist}${units}` },
                { label: "Hip", value: `${hip}${units}` },
                { label: "Bust/Hip Ratio", value: (Number(bust) / Number(hip)).toFixed(2) },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-bg rounded-xl shadow-sm p-2 transition hover:shadow-md"
                >
                  <p className="text-md text-heading/80 mb-1.5">{item.label}</p>
                  <p className="text-xl font-semibold text-heading">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { label: "Waist/Bust Ratio", value: (Number(waist) / Number(bust)).toFixed(2) },
                { label: "Waist/Hip Ratio", value: (Number(waist) / Number(hip)).toFixed(2) },
                { label: "Bust-Hip Difference", value: `${(Number(bust) - Number(hip)).toFixed(1)} ${units}` },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-bg rounded-xl shadow-sm p-4 transition hover:shadow-md"
                >
                  <p className="text-sm text-heading/80 mb-1.5">{item.label}</p>
                  <p className="text-lg font-semibold text-heading">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

     
  
        {/* ===== STYLE GUIDE ===== */}
        <section className="bg-heading-hl mt-10 mb-10 p-6 sm:p-10 rounded-2xl">
          <h3 className="text-2xl font-fraunces text-white font-semibold mb-6 text-center sm:text-left">
            Curated Style Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            {styleGuides[bodyShape]?.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <IoShirtOutline className="text-heading bg-blue-100 rounded-full p-2" size={40} />
                  <h4 className="text-lg sm:text-xl font-semibold text-heading">{item.category}</h4>
                </div>
                <p className="text-sm sm:text-base text-text/80">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* ===== OUTFIT RECOMMENDATION ===== */}
        <section className="bg-heading-hl rounded-2xl p-6 sm:p-10">
          <h3 className="font-fraunces text-lg sm:text-2xl text-white font-medium mb-6 text-center sm:text-left">
            Outfit Recommendation
          </h3>
  
          {/* VIEW + CATEGORY TOGGLES */}
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 bg-heading-hd p-3 sm:p-5 rounded-full">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full transition-all duration-200 ${
                  displayMode === "single"
                    ? "text-heading bg-white"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setDisplayMode("single")}
              >
                Single View
              </button>
              <button
                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full transition-all duration-200 ${
                  displayMode === "styling"
                    ? "text-heading bg-white"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setDisplayMode("styling")}
              >
                Styling View
              </button>
            </div>
  
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {displayMode === "styling" &&
                CATEGORY_LIST.map((cat) => {
                  const isActive = visibleRows.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleRow(cat)}
                      className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-white text-heading font-semibold"
                          : "border border-white/50 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  );
                })}
  
              {displayMode === "single" && (
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-1 text-sm bg-white text-heading rounded-md border border-white/50"
                >
                  <option value="all">All</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="skirt">Skirt</option>
                  <option value="dress">Dress</option>
                </select>
              )}
            </div>
          </div>
  
          {/* ===== SINGLE VIEW ===== */}
          {displayMode === "single" && (
            <div className="relative mt-8">
              <div
                ref={carouselRef}
                className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, carouselRef)}
              >
                {products
                  .filter(
                    (p) =>
                      filter === "all" ||
                      p.category?.toLowerCase() === filter.toLowerCase()
                  )
                  .map((p, i) => (
                    <div
                      key={i}
                      className="min-w-[220px] sm:min-w-[260px] bg-white rounded-3xl shadow-md hover:shadow-xl transition-all"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-48 sm:h-56 object-contain p-6"
                      />
                      <div className="px-4 pb-4">
                        <p className="font-semibold text-heading">{p.title}</p>
                        <p className="text-sm text-text/70 line-clamp-1 hover:line-clamp-none">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
  
              {/* Arrows hidden on mobile */}
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
          )}
  
          {/* ===== STYLING VIEW ===== */}
          {displayMode === "styling" && (
            <div className="mt-8 space-y-10">
              {visibleRows.map((cat) => {
                const catProducts = products.filter(
                  (p) => p.category?.toLowerCase() === cat
                );
                if (catProducts.length === 0) return null;
  
                return (
                  <div key={cat} className="relative">
                    <h4 className="text-lg sm:text-xl text-white font-fraunces mb-4 capitalize text-center sm:text-left">
                      {cat}
                    </h4>
                    <div
                      ref={carouselRef}
                      className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
                      onTouchStart={handleTouchStart}
                      onTouchMove={(e) => handleTouchMove(e, carouselRef)}
                    >
                      {catProducts.map((p, i) => (
                        <div
                          key={`${cat}-${i}`}
                          className="min-w-[220px] sm:min-w-[260px] bg-white rounded-3xl shadow-md hover:shadow-xl transition-all"
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-48 sm:h-56 object-contain p-6"
                          />
                          <div className="px-4 pb-4">
                            <p className="font-semibold text-heading">{p.title}</p>
                            <p className="text-sm text-text/70 line-clamp-1 hover:line-clamp-none">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
  
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
                );
              })}
            </div>
          )}
        </section>
  
        {/* SAVE BUTTON */}
        {showSaveButton && (
          <div className="flex justify-center sm:justify-end mt-10">
            <button
              className="bg-heading-hd text-white text-base sm:text-lg rounded-lg px-6 sm:px-8 py-3 sm:py-4 hover:bg-heading-hl"
              onClick={(e) => defaultSave(e)}
            >
              Save to Profile
            </button>
          </div>
        )}
      </div>
    </section>
  );
  
  
  
  }

  


