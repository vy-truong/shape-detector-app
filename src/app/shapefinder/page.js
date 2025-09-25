"use client"

import { useEffect, useState, useRef } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import  {shapeExplanations }  from "../data/shapeExplanations.js";

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
                const res = resizeBy = await fetch(`${window.location.origin}/data/products.json`); 
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
        (p) => Array.isArray(p.shapeTags) && p.shapeTags.includes(shape)
        );
        setProducts(picks);

    }
    console.log("Shape data:", shapeExplanations);
    //empty  
    //show reswult 
    //pick products based on clothing category using array filter 

    return (
        <main className="max-w-4xl mx-auto py-10 px-6 space-y-10">
            {/* Header */}
            <section className="text-center">
                <h1 className="text-3xl font-bold text-[#2a3b5f] mb-4">
                Get Outfit Recommendations Tailored to You
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                Our outfit suggestions are based on fit, balance, and proportion. These are just
                guidelines to help you skip trial and error — fashion is freedom!
                </p>
            </section>


            {/* Measurement Form */}
            
            <section className="bg-[#fdfdfd] rounded-xl shadow-md p-6"> 
                <h2 className="font-bold text-lg mb-4 text-[#2a3b5f]">
                    📏 Your Measurement
                </h2>
                <form  onSubmit={handleSubmit} className="space-y-4">
                    {/* Unit Radio button*/}
                    <div className="flex gap-4">
                        <label>
                            <input
                            type="radio"
                                value="cm"
                                checked={units === "cm"}
                                onChange={(e) => setUnit(e.target.value)}
                            />{" "}
                            cm
                        </label>
                        <label>
                            <input
                            type="radio"
                                value="in"
                                checked={units === "in"}
                                onChange={(e) => setUnit(e.target.value)}
                            />{" "}
                            in
                        </label>
                    </div>

                    {/* Body measuremet */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label>Bust</label>
                            <input
                            type="number"
                            placeholder="Bust"
                            value={bust}
                            onChange={(e) => setBust(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label>Waist</label>
                            <input
                            type="number"
                            placeholder="Waist"
                             value={waist}
                             onChange={(e) => setWaist(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            />
                        </div> 

                        <div className="flex flex-col">
                            <label>High-hip</label>
                            <input
                            type="number"
                            placeholder="High Hip"
                            value={highHip}
                            onChange={(e) => setHighHip(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Hip</label>
                            <input
                            type="number"
                            placeholder="Hip"
                            value={hip}
                            onChange={(e) => setHip(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                            />
                        </div>
                    </div>

    
                    <div/>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-md font-semibold"
                    
                    >
                        Get result
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}

            </section>
      
             {/* Result */}
             {bodyShape && (
             <section className="bg-white border rounded-lg p-6 space-y-6">
                    <h2 className="text-2xl font-bold">You have Hourglass body shape</h2>
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {/* Bust */}
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Bust</p>
                        <p className="text-2xl font-bold">{bust}{units}</p>
                        </div>

                        {/* Waist */}
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Waist</p>
                        <p className="text-2xl font-bold">{waist}{units}</p>
                        </div>

                        {/* Hip */}
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Hip</p>
                        <p className="text-2xl font-bold">{hip}{units}</p>
                        </div>

                        {/* Bust/Hip Ratio */}
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Bust/Hip Ratio</p>
                        <p className="text-2xl font-bold">{(bust / hip).toFixed(2)}</p>
                        </div>
                    </div>

                    <hr className="my-6" />

                    {/* Extra ratios */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Waist/Bust Ratio</p>
                        <p className="text-xl font-semibold">{(waist / bust).toFixed(2)}</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Waist/Hip Ratio</p>
                        <p className="text-xl font-semibold">{(waist / hip).toFixed(2)}</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-sm tracking-wide">Bust-Hip Difference</p>
                        <p className="text-xl font-semibold">{(bust - hip).toFixed(1)} {units}</p>
                        </div>
                    </div>
                    </section>
                    {/* Shape Explanation */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                        {shapeExplanations[bodyShape].text}
                    </p>
                    </div>



                    {/* Styling Principles */}
                    <div className="bg-[#fff7d6] p-4 rounded-md">
                        <h3  className="font-semibold mb-2">✨ Key Styling Principles</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Highlight your waistline with tailored pieces</li>
                            <li>Balance proportions with structured tops</li>
                            <li>Experiment with A-line skirts and wide-leg pants</li>
                        </ul>
                    </div>

                     {/* Curated Style Guide */}
                     <div>
                        <h3 className="font-bold text-lg mb-3">Curated Style Guide</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-md">

                                <div className="flex item-center gap-2 ">
                                <IoShirtOutline className="text-xl"/>
                                <h4 className="font-semibold">Top</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Flowing tops like tunics, V-necks, and empire-waist blouses
                                    create a flattering vertical line.
                                </p>

                            </div>
                            <div className="p-4 border rounded-md">
                            <div className="flex item-center gap-2 ">
                                <IoShirtOutline className="text-xl"/>
                                <h4 className="font-semibold">Dress</h4>
                                </div>
                                <p className="text-sm">
                                    A-line, shift, or empire-waist dresses gracefully skim your
                                    midsection.
                                </p>
                            </div>
                            <div className="p-4 border rounded-md">
                            <div className="flex item-center gap-2 ">
                                <IoShirtOutline className="text-xl"/>
                                <h4 className="font-semibold">Outdoor</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                Light layers and flowy jackets add balance and draw attention
                                upward.
                                </p>
                            </div>
                            <div className="p-4 border rounded-md">
                            <div className="flex item-center gap-2 ">
                                <IoShirtOutline className="text-xl"/>
                                <h4 className="font-semibold">Bottom</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                Wide-leg pants or bootcut jeans balance proportions and flatter
                                curves.
                                </p>
                            </div>
                        </div>
                     </div>

                     {/* Outfit Recommendation */}
                     {/* The layout will be 3 cards with continuous arrows for user to click
                        - The card will have images of clothing piece 
                        - The card will show clothing category: top or shirt etc 
                        - outdoor indoor casual work etc 
                        - short explantion what it will help that body type. for example: help create an illusion of something 
                     */}
                    <div className="mb-3">
                        {/* Arrow */}

                        <h3 className="font-bold text-lg mb-3">Outfit Recommendation</h3>
                        <h4 className="font-semibold mb-2">Top</h4>

                        <div className="relative">
                            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10" onClick={scrollLeft}><IoIosArrowBack size={20} /></button>
                            <div
                                id="carousel"
                                ref={carouselRef}
                                className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
                            >
                                {products.map((product, index) => (
                                    <div
                                    key={index}
                                    className="min-w-[220px] bg-white border rounded-lg shadow-md flex-shrink-0"
                                    >
                                    <img
                                        src={product.image}
                                        alt={product.category}
                                        className="rounded-t-lg h-40 w-full object-cover"
                                    />
                                    <div className="p-3">
                                        <p className="font-medium text-sm">
                                        {product.category}
                                        </p>
                                        <p className="text-xs text-gray-600">{product.notes}</p>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
             )}

        </main>
    );
}