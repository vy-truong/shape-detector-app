"use client"

import { useEffect, useState, useRef } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import  {shapeExplanations }  from "../data/shapeExplanations.js";
import Header from "../components/Header.js";

function classifyShape(bust, waist, highHip, hip, units = "in") {
    const small = units === "in" ? 2.0 : 5.0;
    const notable = units === "in" ? 3.0 : 7.5;
    const avgBH = (bust + hip) / 2;
    const waistRel = waist / avgBH;
  
    if (Math.abs(bust - hip) <= small && waistRel <= 0.75) return "Hourglass";
    if (hip - bust >= notable) {
      const highHipGap = hip - highHip;
      if (highHipGap >= (units === "in" ? 2.0 : 5.0)) return "Spoon";
      return "Pear";
    }
    if (bust - hip >= notable) return "Inverted Triangle";
    if (waistRel >= 0.85 || waist >= bust || waist >= hip) return "Apple";
    return "Rectangle";
  }

export default function ShapeFinder() {
    // 1. create state for each body measurement and unit 
    //Default measurement to test, will remove later 
    const [bust, setBust] = useState(36);
    const [waist, setWaist] = useState(24);
    const [highHip, setHighHip] = useState(36);
    const [hip, setHip] = useState(38);
    const [units, setUnits] = useState("in");

    //2. create state for result: body shape, summary, rec products 
    const [error, setError] = useState("");
    const [bodyShape, setBodyShape] = useState(null);
    const [summary, setSummary] = useState("");
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Create IMAGE SLIDER useRef, stored in DOM element 
    const carouselRef = useRef(null); 

    // FILTER DROP DOWN USESTATE with default value "All" to show all products
    const [filter, setFilter] = useState("all"); 

    const scrollRight = () => {

        if(carouselRef.current) {
            carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
        }
    }
    const scrollLeft = () => {

        if(carouselRef.current) {
            carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
        }
        console.log("scroll left")
    }
   


    //3. load data from json uing useeffect async 
    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("/products.json"); 
                if(!res.ok) throw new Error("Failed to load products"); 
                const data = await res.json();
                setAllProducts(data); 

            } catch (err) {
                console.error(err);
                setError("Could not laod all products ")
            }
        }
        loadProducts(); 
    }, []);

    //4. handle form submit with warning and error handling 
    const handleSubmit = (e) => {
        e.preventDefault(); 
        setError("");
        setProducts ([]); 
        const values = [bust, waist, highHip, hip].map(parseFloat);
        if (values.some((v) => isNaN(v) || v <= 0)) {
        setError("Please enter all four measurements as numbers greater than 0.");
        return;
        }
    
        const shape = classifyShape(...values, units);
            setBodyShape(shape);
    
            setSummary(
                `Bust: ${bust} ${units} | Waist: ${waist} ${units} | High-Hip: ${highHip} ${units} | Hip: ${hip} ${units}`
              );
    
            const picks = allProducts.filter(
            (p) => Array.isArray(p.bodytype) && 
                    p.bodytype.map(bt => bt.toLowerCase()).includes(shape.toLowerCase())
            );
              
              
        setProducts(picks);

    }
    console.log("Shape data:", shapeExplanations);
    //empty  
    //show reswult 
    //pick products based on clothing category using array filter 

    return (
    <main className="bg-bg text-text max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 sm:space-y-16">

    {/* Header Section */}
    <section className="text-center">
      <h3 className="text-xl sm:text-3xl md:text-4xl font-fraunces font-light italic text-heading mb-6">
        Shape Finder Calculation
      </h3>
      <p className="text-muted max-w-2xl mx-auto text-lg">
        No more staring at your closet wondering what actually works for you. <br/>
        Find outfits that flatter your shape, bring out your confidence, 
        and make getting dressed feel effortless—and even exciting.
      </p>
    </section>

    {/* Measurement Form */}
    
    <section className="bg-heading-hl rounded-xl shadow-drop px-[5rem] py-[2rem] sm:px-[4rem] sm:py-[3rem]"> 
        <h2 className="text-2xl text-center text-white font-fraunces font-light mb-4">
            Your Measurement
        </h2>
        <p className="text-mutedlight text-center text-sm sm:text-base mb-6">
            Please measure around the fullest part of each area while standing straight.
        </p>
        <form  onSubmit={handleSubmit} className="space-y-4">
            {/* Unit Radio button*/}
            <div className="flex justify-center mt-[1.5rem] mb-[1.5rem]"> 
                <div className="flex bg-mutedlight rounded-full py-2 px-4">
                    <button
                    type="button"
                    onClick={() => setUnits("cm")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                        units === "cm"
                        ? "bg-heading text-white"
                        : "text-heading hover:bg-gray-200"
                    }`}
                    >
                    cm
                    </button>

                    <button
                    type="button"
                    onClick={() => setUnits("in")}
                    className={`px-6 py-1 rounded-full text-sm font-medium transition ${
                        units === "in"
                        ? "bg-heading text-white"
                        : "text-heading hover:bg-gray-200"
                    }`}
                    >
                    in
                    </button>
                </div>
            </div>


            {/* Body measuremet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2rem] max-w-xl mx-auto">
                <div className="flex flex-col gap-1">
                    <label className="font-medium">Bust</label>
                    <input
                    type="number"
                    placeholder="Bust"
                    value={bust}
                    onChange={(e) => setBust(e.target.value)}
                    className="shadow-combo bg-bg px-4 py-2 rounded-md w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Waist</label>
                    <input
                    type="number"
                    placeholder="Waist"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                    className="shadow-combo bg-bg px-4 py-2 rounded-md"
                    />
                </div> 

                <div className="flex flex-col gap-1">
                    <label className="font-medium">High-hip</label>
                    <input
                    type="number"
                    placeholder="High Hip"
                    value={highHip}
                    onChange={(e) => setHighHip(e.target.value)}
                    className="shadow-combo bg-bg px-4 py-2 rounded-md"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium">Hip</label>
                    <input
                    type="number"
                    placeholder="Hip"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className=" shadow-combo bg-bg px-4 py-2 rounded-md"
                    />
                </div>
            </div>
            <div/>
            <div className="flex justify-center mt-[3rem]">
                <button
                    type="submit"
                    className="w-80 text-center bg-heading text-white py-3 rounded-md font-semibold hover:bg-heading-hd transition"
                >
                    Get result
                </button>
            </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
    </section>
    {/* ===================== Result Overview ===================== */}
{bodyShape && (
  <section className="bg-white rounded-lg p-6 sm:p-10 space-y-8 mb-12 w-full shadow-sm">
    {/* Body Shape Title */}
    <h2 className="text-lg sm:text-2xl font-fraunces font-bold italic">
      You have <span className="text-heading">{bodyShape}</span> body shape
    </h2>

    {/* Ratios */}
    <section className="p-6 rounded-lg bg-mutedwarm shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
        {/* Bust */}
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Bust</p>
          <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
            {bust}{units}
          </p>
        </div>

        {/* Waist */}
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Waist</p>
          <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
            {waist}{units}
          </p>
        </div>

        {/* Hip */}
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Hip</p>
          <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
            {hip}{units}
          </p>
        </div>

        {/* Bust/Hip Ratio */}
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Bust/Hip Ratio</p>
          <p className="text-2xl font-semibold text-heading mt-[0.5rem]">
            {(bust / hip).toFixed(2)}
          </p>
        </div>
      </div>

      <hr className="my-6" />

      {/* Extra Ratios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Waist/Bust Ratio</p>
          <p className="text-xl font-semibold text-heading mt-[0.5rem]">
            {(waist / bust).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Waist/Hip Ratio</p>
          <p className="text-xl font-semibold text-heading mt-[0.5rem]">
            {(waist / hip).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-text text-sm tracking-wide mb-[0.5rem]">Bust-Hip Difference</p>
          <p className="text-xl font-semibold text-heading mt-[0.5rem]">
            {(bust - hip).toFixed(1)} {units}
          </p>
        </div>
      </div>
    </section>

    {/* Shape Explanation */}
    <div className="bg-mutedwarm p-6 rounded-lg shadow-sm">
      <p className="text-text leading-relaxed">
        {shapeExplanations[bodyShape].text}
      </p>
    </div>

    {/* Key Styling Principles */}
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
  </section>
)}

{/* ===================== Style Guide + Outfit Section ===================== */}
{bodyShape && (
  <section className="max-w-6xl mx-auto space-y-12">
    {/* Curated Style Guide */}
    <div>
      <h3 className="text-lg sm:text-2xl font-fraunces font-bold italic mb-6">
        Curated Style Guide
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top */}
        <div className="p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <IoShirtOutline className="text-xl text-heading" />
            <h4 className="font-semibold text-heading">Top</h4>
          </div>
          <p className="text-sm text-text">
            Flowing tops like tunics, V-necks, and empire-waist blouses create a flattering vertical line.
          </p>
        </div>

        {/* Dress */}
        <div className="p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <IoShirtOutline className="text-xl text-heading" />
            <h4 className="font-semibold text-heading">Dress</h4>
          </div>
          <p className="text-sm text-text">
            A-line, shift, or empire-waist dresses gracefully skim your midsection.
          </p>
        </div>

        {/* Outdoor */}
        <div className="p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <IoShirtOutline className="text-xl text-heading" />
            <h4 className="font-semibold text-heading">Outdoor</h4>
          </div>
          <p className="text-sm text-text">
            Light layers and flowy jackets add balance and draw attention upward.
          </p>
        </div>

        {/* Bottom */}
        <div className="p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <IoShirtOutline className="text-xl text-heading" />
            <h4 className="font-semibold text-heading">Bottom</h4>
          </div>
          <p className="text-sm text-text">
            Wide-leg pants or bootcut jeans balance proportions and flatter curves.
          </p>
        </div>
      </div>
    </div>

    {/* Outfit Recommendation */}
    <div>
      <h3 className="font-fraunces text-lg sm:text-2xl font-bold italic mb-6">
        Outfit Recommendation
      </h3>
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
          onClick={scrollLeft}
        >
          <IoIosArrowBack size={20} />
        </button>

        {/* Carousel */}
        <div
          id="carousel"
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
        >
          {products
            .filter(
              (product) =>
                filter === "all" ||
                filter === "filter" ||
                product.category.toLowerCase() === filter.toLowerCase()
            )
            .map((product, index) => (
              <div
                key={index}
                className="min-w-[220px] bg-white rounded-lg shadow-md flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.category}
                  className="rounded-t-lg h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-medium text-sm">{product.category}</p>
                  <p className="text-xs text-gray-600">{product.description}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
          onClick={scrollRight}
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
  </section>
)}

        

    </main>
    );
}