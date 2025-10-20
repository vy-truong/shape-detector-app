"use client";

import { useEffect, useState } from "react";
import supabase  from "../config/supabaseClient"
import Link from "next/link";
import { shapeExplanations } from "../data/shapeExplanations.js";
import NoResultBox from "./NoResultBox.js";
import Footer from "../components/Footer.js";
import ResultCard from "../shapefinder/ResultCard.js";
import WardrobePage from "./wardrobe/page";


export default function MyProfilePage() {
    const [latestResult, setLatestResult] = useState(null);
    const [view, setView] = useState("profile"); //set view for pfp and wardrobe 
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(()=> {
        async function loadResults() {
            try {
                //load result 
                const { data: results, error } = await supabase 
                    .from("saved_results") 
                    .select("*")
                    .order("created_at", {ascending: false})

                if (error) throw error

                if (results && results.length > 0) {
                    const latest = results[0];
                    console.log("Loaded from Supabase:", latest);
                  
                    setLatestResult(latest); 
                }
                else {
                    //fallbac if supabase empty (local storage)
                    const local = JSON.parse(localStorage.getItem("results") || "[]")
                    if (local.length > 0){ 
                        console.log("🪄 Loaded from localStorage:", local[0]);
                    setLatestResult(local[0])
                    }
                }
            } catch (err) {
                console.error("supabase failed to load: ", err.message)
                const local = JSON.parse(localStorage.getItem("results") || "[]")
                if (local.length > 0) setLatestResult(local[0]) 
            }
            console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
            console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    


        }

        loadResults() 
    }, [])

    if (!mounted) return null;

    return (
        <main className="">
        
    
          <section className="bg-white min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-20 py-10">
              {/* ===== Toggle Button ===== */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() =>
                    setView((prev) =>
                      prev === "profile" ? "wardrobe" : "profile"
                    )
                  }
                  className="bg-heading-hd text-white px-6 py-3 rounded-full hover:bg-heading-hl transition-all text-sm sm:text-base"
                >
                  {view === "profile" ? "Go to My Wardrobe" : "Back to Profile"}
                </button>
              </div>
    
              {/* ===== Toggle Views ===== */}
              {view === "profile" ? (
                <>
                  {latestResult ? (
                    <ResultCard
                      bodyShape={latestResult.bodyshape}
                      bust={latestResult.bust}
                      waist={latestResult.waist}
                      highHip={latestResult.highhip}
                      hip={latestResult.hip}
                      units={latestResult.units}
                      products={latestResult.products || []}
                      showSaveButton={false}
                    />
                  ) : (
                    <NoResultBox />
                  )}
                </>
              ) : (
                <WardrobePage />
              )}
            </div>
          </section>
    
          <Footer />
        </main>
      );
  

}
