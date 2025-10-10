"use client";

import { useEffect, useState } from "react";
import supabase  from "../config/supabaseClient"
import Link from "next/link";
import { shapeExplanations } from "../data/shapeExplanations.js";
import NoResultBox from "./NoResultBox.js";
import ProfileHeader from "./ProfileHeader.js";
import Footer from "../components/Footer.js";
import ResultCard from "../shapefinder/ResultCard.js";


export default function MyProfilePage() {
    const [latestResult, setLatestResult] = useState(null);
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
                    console.log("✅ Loaded from Supabase:", latest);
                  
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

    return (
        <main>
            <ProfileHeader />

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
                />) 
                : 
                (<NoResultBox />)
            }
            
            
            <Footer />
        </main>
        

        


    );
  

}