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
  const [expandedText, setExpandedText] = useState(false);

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
    <section className="bg-white my-auto mx-auto">
      <div className="my-20 mx-20">
        {/* ===== Ratios ===== */}
        <section className="p-20 rounded-lg  bg-bg shadow-sm">
          {/* ===== Title ===== */}
          <h2 className="text-3xl p-2 font-medium font-fraunces font-bold">
            <span className="text-heading">{bodyShape}</span> 
          </h2>
          
          {/* ===== Explanation ===== */}
          <div className="p-2">
            <p className="text-[18px]">{shapeExplanations?.[bodyShape]?.text}</p>
          </div>

          <div className="grid grid-cols-2 mt-10 sm:grid-cols-4 gap-4 sm:gap-2 text-center">
            {/* Bust */}
            <div className="">
              <p className="text-heading text-xl  mb-[0.5rem]">Bust</p>
              <p className="text-2xl text-heading font-semibold ">
                {bust}
                {units}
              </p>
            </div>
  
            {/* Waist */}
            <div>
              <p className="text-heading text-xl  mb-[0.5rem]">Waist</p>
              <p className="text-2xl text-heading font-semibold ">
                {waist}
                {units}
              </p>
            </div>
  
            {/* Hip */}
            <div>
              <p className="text-heading text-xl  mb-[0.5rem]">Hip</p>
              <p className="text-2xl text-heading font-semibold ">
                {hip}
                {units}
              </p>
            </div>
  
            {/* Bust/Hip ratio quick math */}
            <div>
              <p className="text-heading text-xl mb-[0.5rem]">Bust/Hip Ratio</p>
              <p className="text-2xl text-heading font-semibold ">{(Number(bust) / Number(hip)).toFixed(2)}</p>
            </div>
          </div>
  
          <hr className="my-6"/>
          {/* extra ratios section */}
          <div className="grid grid-cols-2 sm:grid-cols-3  sm:gap-2 text-center">
            <div>
              <p className="text-heading text-md font-medium mb-[0.5rem]">Waist/Bust Ratio</p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]">{(Number(waist) / Number(bust)).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-heading text-md mb-[0.5rem] font-medium">Waist/Hip Ratio</p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]">{(Number(waist) / Number(hip)).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-heading text-md mb-[0.5rem] font-medium">Bust-Hip Difference</p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]"> 
                {(Number(bust) - Number(hip)).toFixed(1)} {units}
              </p>
            </div>
          </div>
        </section>

  
        {/* ===== Curated guide + carousel ===== */}
        <section className="bg-heading-hl mt-10 mb-10 px-4 sm:p-10 lg:p-20 ">
          <div>
            <h3 className="text-2xl font-fraunces font-medium text-white  mb-6">Curated Style Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {styleGuides[bodyShape]?.map((item, idx) => (
                <div key={idx} 
                className="py-15 px-10 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex item-center gap-2 mb-5">
                    <IoShirtOutline className="text-heading bg-blue-100 rounded-full border-1 p-2"size={50} />
                    <h4 className="text-xl text-heading">{item.category}</h4>
                  </div>
                  <p className="text-[16px]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
  
          {/* outfit carousel */}
       
            <section className="w-full bg-heading-hl p-12">
              <h3 className="font-fraunces text-lg text-white sm:text-2xl font-medium mb-6">Outfit Recommendation</h3>
              <div  className="relative w-full overflow-hidden">
                
                {/* DISPLAY + CATEGORY TOGGLES */}
                <div className="flex justify-between gap-3 bg-heading-hd p-2 sm:p-5 rounded-full w-full sm:w-[100%] mx-auto">

                {/* LEFT: view toggle */}
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full transition-all duration-200 ${
                      displayMode === "single"
                        ? "text-heading bg-white"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setDisplayMode("single")}
                  >
                    Single View
                  </button>

                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full transition-all duration-200 ${
                      displayMode === "styling"
                        ? "text-heading bg-white"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setDisplayMode("styling")}
                  >
                    Styling View
                  </button>
                </div>

                {/* RIGHT: category buttons */}
                <div className="flex flex-wrap justify-center items-center gap-2">
                    {/*  show category buttons only when in styling mode */}
                    {displayMode === "styling" &&
                      CATEGORY_LIST.map((cat) => {
                        const isActive = visibleRows.includes(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => toggleRow(cat)}
                            className={`px-4 py-1 rounded-md text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-white text-heading font-semibold"
                                : "bg-transparent border border-white/50 text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        );
                      })}

                    {/* show dropdown only when in single view */}
                    {displayMode === "single" && (
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-1 rounded-md text-sm bg-white text-heading border border-white/50 cursor-pointer"
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


                {/* ================= SINGLE VIEW ================= */}
                {displayMode === "single" && (
                  <>
                    {/* ===== Filter dropdown =====
                    <div className="mb-6 flex justify-start">
                      <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white rounded-md border-white text-sm"
                      >
                        <option value="all">All</option>
                        <option value="top">Top</option>
                        <option value="dress">Dress</option>
                        <option value="bottom">Bottom</option>
                        <option value="outdoor">Outdoor</option>
                      </select>
                    </div> */}
                      
                    {/* the scrollable track */}
                    <div className="overflow-hidden"> 
                      <div ref={carouselRef}
                        className="flex space-x-6 overflow-x-auto scroll-smooth scrollbar-hide"
                      >
                        {products
                          .filter(
                            (product) =>
                              filter === "all" ||
                              filter === "filter" ||
                              product.category?.toLowerCase() === filter.toLowerCase()
                          )
                          .map((product, index) => (
                            <div key={index}
                            className="min-w-[350px] max-w-[400px] bg-white rounded-lg shadow-md hover:shadow-lg transition"
                            >
                              {/* image */}
                              <div className="h-80 flex items-center justify-center bg-white">

                                <img src={product.image} alt={product.category} />
                              </div>
                              {/* text */}
                              <div>
                                <p>{product.category}</p>
                                <p>{product.description}</p>
                              </div>
                            </div>
                          ))}
                    </div>
                    </div>

                    {/* left arrows */}
                    <button className="absolute left-5 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
                    onClick={scrollLeft}>
                      <IoIosArrowBack size={30} />
                    </button>

                    {/* right arrow */}
                    <button  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
                    onClick={scrollRight}>
                      <IoIosArrowForward size={30} />
                    </button>
                  </>
                )}

                {/* ================= STYLING VIEW ================= */}
                  {displayMode === "styling" && (
                    <>
                      {/* one row per visible category */}
                      {visibleRows.map((cat) => {
                        const catProducts = products.filter(
                          (p) => p.category?.toLowerCase() === cat
                        );
                        if (catProducts.length === 0) return null;

                        return (
                          <div key={cat} className="relative w-full overflow-hidden mb-12">
                            <h4 className="text-xl font-fraunces text-white font-md mb-3 capitalize">
                              {cat}
                            </h4>

                            <div className="overflow-hidden">
                              <div
                                ref={carouselRef}
                                className="flex space-x-6 overflow-x-auto scroll-smooth scrollbar-hide"
                              >
                                {catProducts.map((product, index) => (
                                  // card 
                                  <div
                                    key={`${cat}-${index}`}
                                    className="relative group min-w-[280px] max-w-[320px] bg-white rounded-4xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                  >
                                   
                                    {/* PRODUCT IMG  */}
                                    <img  className="p-8 transition-transformduration-300 hover:scale-105 "
                                     src={product.image} alt={product.category}/>
                                    
                                    {/* PRODUCT TITLE + TEXT */}
                                    <div className=" p-3">
                                      <p className="font-semibold text-md text-heading/80"> {product.title}</p>
                                      {/* des */}
                                      <div className="relative text-sm text-text/70 leading-snug group/card">
                                        <p className="line-clamp-1 hover:line-clamp-none transition-all duration-10000">
                                          {product.description}
                                        </p>
                                      </div>

                            
                                       {/* toggle button */}
                                    
                                         
                                      {/* <p>{product.bodyshape}</p> */}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* reuse same arrows */}
                            <button
                              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
                              onClick={scrollLeft}
                            >
                              <IoIosArrowBack size={30} />
                            </button>
                            <button
                              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
                              onClick={scrollRight}
                            >
                              <IoIosArrowForward size={30} />
                            </button>
                          </div>
                        );
                      })}
                    </>
                )}

              </div>
          
            </section>
           
         
          {/* save button only shows when flag is true */}
          <div className="flex justify-end">
            {showSaveButton && (
              <button className="bg-heading-hd text-white text-lg rounded-lg px-8 py-4 mt-10 hover:bg-heading-hl"
              onClick={(e) => defaultSave(e)}>Save to Profile</button>
            )}
          </div>
      </div>
    </section>
  );
  
  
  }

  


