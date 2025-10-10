"use client"

import { useEffect, useState, useRef } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import  {shapeExplanations }  from "../data/shapeExplanations.js";
import Header from "../components/Header.js";
import ResultCard from "./ResultCard.js";
import  supabase  from "../config/supabaseClient"
// import { insertProducts } from "../utils/insertProducts";

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

    //3. load data from json uing useeffect async 
    useEffect(() => {
      async function loadProducts() {
        // console.log("Seeding products...");
        // // this will push all your data into Supabase once
        // await insertProducts();

        //Then load from Supabase
        try {
          // 1️ Try loading from Supabase
          const { data, error } = await supabase.from("products").select("*")
    
          if (error || !data || data.length === 0) {
            console.warn("Supabase failed or empty. Falling back to local JSON...")
            throw error || new Error("Empty Supabase data")
          }
    
          console.log("Loaded products from Supabase:", data.length)
          setAllProducts(data)
    
        } catch (err) {
          // Fall back to local JSON
          try {
            const res = await fetch("/products.json")
            if (!res.ok) throw new Error("Local JSON fetch failed")
    
            const localData = await res.json()
            console.log("Loaded products from local file:", localData.length)
            setAllProducts(localData)
    
          } catch (jsonErr) {
            // 3️ Both failed
            console.error("Could not load any products:", jsonErr)
            setError("Could not load any products.")
          }
        }
      }
    
      loadProducts()
    }, [])

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

            //Go through every product. Grab its bodyshape info.
            const picks = allProducts.filter((p) => {
              // Force convert bodyshape to plain JS array
              //If it’s already an array, copy it.
              const raw = p.bodyshape;
              const shapes = Array.isArray(raw) 
                            ? [...raw]  //If it’s already an array, copy it 
                            : typeof raw === "string" //If it’s a string, clean and split it.
                            ? raw.replace(/[{}"]/g, "").split(",")
                            : []; //otherwise skip it by creating empty array 

              //Then check if it includes detected body shape.
              return shapes.map((s) => s.trim().toLowerCase()).includes(shape.toLowerCase()); 
            });
            console.log("Shape:", shape);
            console.log("Matched products:", picks);
            // alert(`Found ${picks.length} matching products for ${shape}`);
            setProducts(picks);

    }
    console.log("Shape data:", shapeExplanations);

    return (
    <main className="bg-bg text-text overflow-x-hidden w-full">
    {/* Header Section */}
    <section className="bg-heading-hl w-full overflow-x-hidden"> 
      <div className="text-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
        <h3 className="text-xl sm:text-3xl md:text-4xl font-fraunces font-light italic text-mutedlight mb-6">
          Shape Finder Calculation
        </h3>
        <p className="text-mutedlight text-center sm:text-md leading-relaxed">
          No more staring at your closet wondering what actually works for you. <br/>
          Find outfits that flatter your shape, bring out your confidence, 
          and make getting dressed feel effortless and even exciting.
        </p>
      </div>
      {/* Measurement Form */}
      <section className="bg-heading-hl w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10 overflow-hidden">  
            <h2 className="text-2xl text-center text-heading font-fraunces font-light mb-4">
                Your Measurement
            </h2>
            <p className="text-heading text-center text-sm sm:text-base mb-6">
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
                            : "text-heading hover:bg-white"
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
                        className="w-80 text-center bg-heading text-white py-3 rounded-md font-semibold hover:bg-heading-hl transition"
                    >
                        Get result
                    </button>
                </div>
              </form>
            </div>
    
          {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>
    </section>
    {bodyShape && (
        <ResultCard
          bodyShape={bodyShape}
          bust={bust}
          waist={waist}
          highHip={highHip}
          hip={hip}
          units={units}
          products={products}
          // products={filteredProducts}
          showSaveButton={true}
          // onSave={saveToProfile}
        />
      )}


  </main>
  );
}
