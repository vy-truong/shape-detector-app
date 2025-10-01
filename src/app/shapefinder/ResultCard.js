"use client";

import { useEffect, useRef, useState } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { shapeExplanations } from "../data/shapeExplanations.js";
import { styleGuides } from "../data/styleGuides.js";

export default function ResultCard({
  bodyShape, // the shape result ("Pear", "Hourglass", etc)
  bust,
  waist,
  highHip,
  hip,
  units = "in", // default to inches if not passed
  products = [], // outfit recs
  showSaveButton = false, // only show on ShapeFinder page, not Profile
  onSave, // optional save fn, otherwise fallback to defaultSave
}) {
  if (!bodyShape) return null; // no shape yet? just render nothing

  const [filter, setFilter] = useState("all"); // filter is for categories (top, dress, etc)
  const [results, setResults] = useState([]);
  const carouselRef = useRef(null); // grab carousel DOM to scroll programmatically

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("results") || "[]");
    setResults(stored);

  }, []);

  // move carousel right
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

  // fallback save if no onSave passed in
  const defaultSave = () => {
    const newResult = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID() // nice uuid if available
          : String(Date.now()), // fallback just use timestamp
      createdAt: new Date().toISOString(),
      bodyShape,
      bust: Number(bust),
      waist: Number(waist),
      highHip: Number(highHip),
      hip: Number(hip),
      units,
      products,
    }
    const updated = [...results, newResult]; 
    setResults(updated); 
    localStorage.setItem("results", JSON.stringify(updated));
    console.log("saved results:", updated);
    };


    const loadResults = () => {
      const stored = JSON.parse(localStorage.getItem("results") || "[]");
      setResults(stored); // put into state
      console.log("Loaded results:", stored);
      
    };
    
  return (
    <section className="bg-white rounded-lg py-15 p-6 sm:p-10 sm:py-20 space-y-8 mb-12 w-full shadow-sm overflow-x-hidden">
      <div className="mx-auto">
        {/* ===== Title ===== */}
        <h2 className="text-2xl font-fraunces font-bold">
          You have <span className="text-heading">{bodyShape}</span> body shape
        </h2>

        {/* ===== Ratios ===== */}
        <section className="p-6 rounded-lg bg-mutedwarm shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            {/* Bust */}
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">Bust</p>
              <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
                {bust}
                {units}
              </p>
            </div>

            {/* Waist */}
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">Waist</p>
              <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
                {waist}
                {units}
              </p>
            </div>

            {/* Hip */}
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">Hip</p>
              <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
                {hip}
                {units}
              </p>
            </div>

            {/* Bust/Hip ratio quick math */}
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">
                Bust/Hip Ratio
              </p>
              <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
                {(Number(bust) / Number(hip)).toFixed(2)}
              </p>
            </div>
          </div>

          <hr className="my-6" />

          {/* extra ratios section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">
                Waist/Bust Ratio
              </p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]">
                {(Number(waist) / Number(bust)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">
                Waist/Hip Ratio
              </p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]">
                {(Number(waist) / Number(hip)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-text text-sm tracking-wide mb-[0.5rem]">
                Bust-Hip Difference
              </p>
              <p className="text-xl font-semibold text-heading mt-[0.5rem]">
                {(Number(bust) - Number(hip)).toFixed(1)} {units}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Explanation ===== */}
        <div className="bg-mutedwarm p-6 rounded-lg shadow-sm">
          <p className="text-text leading-relaxed">
            {shapeExplanations?.[bodyShape]?.text}
          </p>
        </div>

        {/* ===== Styling tips ===== */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-fraunces text-heading text-lg mb-4 flex items-center gap-2">
            <span className="text-accent">✨</span>
            Key Styling Principles
          </h3>
          <ul className="space-y-2 text-text">
            <li>Highlight your waistline with tailored pieces</li>
            <li>Balance proportions with structured tops</li>
            <li>Experiment with A-line skirts and wide-leg pants</li>
          </ul>
        </div>

        {/* ===== Curated guide + carousel ===== */}
        <section className="mx-auto mt-20 mb-1 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
            <div>
            <h3 className="text-lg sm:text-2xl font-fraunces font-bold italic mb-6">
                Curated Style Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {styleGuides[bodyShape]?.map((item, idx) => (
                <div
                    key={idx}
                    className="p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-2">
                    <IoShirtOutline className="text-xl text-heading" />
                    <h4 className="font-semibold text-heading">{item.category}</h4>
                    </div>
                    <p className="text-sm text-text">{item.text}</p>
                </div>
                ))}
            </div>
            </div>
          {/* outfit carousel */}
          <section className="w-full bg-mutedwarm py-12 overflow-x-hidden">
            <h3 className="font-fraunces text-lg sm:text-2xl font-bold italic mb-6">
              Outfit Recommendation
            </h3>
            <div className="relative w-full overflow-hidden">
              {/* arrows */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
                onClick={scrollLeft}
              >
                <IoIosArrowBack size={30} />
              </button>

                {/* ===== Filter dropdown ===== */}
                <div className="mb-6 flex justify-end">
                    <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm"
                    >
                    <option value="all">All</option>
                    <option value="top">Top</option>
                    <option value="dress">Dress</option>
                    <option value="bottom">Bottom</option>
                    <option value="outdoor">Outdoor</option>
                    </select>
                </div>

              {/* the scrollable track */}
              <div
                id="carousel"
                ref={carouselRef}
                className="flex overflow-x-auto space-x-6 scroll-smooth scrollbar-hide px-2 max-w-full"
              >
                {products
                  .filter(
                    (product) =>
                      filter === "all" ||
                      filter === "filter" ||
                      product.category?.toLowerCase() === filter.toLowerCase()
                  )
                  .map((product, index) => (
                    <div
                      key={index}
                      className="min-w-[220px] max-w-[240px] bg-white rounded-lg shadow-md flex-shrink-0 overflow-hidden hover:shadow-lg transition"
                    >
                      {/* image */}
                      <div className="h-44 flex items-center justify-center bg-white">
                        <img
                          src={product.image}
                          alt={product.category}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      {/* text */}
                      <div className="p-3">
                        <p className="text-lg font-semibold text-text mb-1">
                          {product.category}
                        </p>
                        <p className="text-sm text-text1 leading-snug">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* right arrow */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
                onClick={scrollRight}
              >
                <IoIosArrowForward size={30} />
              </button>
            </div>
          </section>

          {/* save button only shows when flag is true */}
          {showSaveButton && (
            <button
              onClick={defaultSave}
              className="mb-10 p-6 py-2 bg-heading text-white rounded-md hover:bg-heading-hl"
            >
              Save to Profile
            </button>

          )}

<button
            onClick={loadResults}
              className="mb-10 p-6 py-2 bg-heading text-white rounded-md hover:bg-heading-hl"
            >
              load to Profile
            </button>
        </section>
      </div>
    </section>
  ); }

  


