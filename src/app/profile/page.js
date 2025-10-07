"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header.js";
import { shapeExplanations } from "../data/shapeExplanations.js";
import NoResultBox from "./NoResultBox.js";
import ProfileHeader from "./ProfileHeader.js";
import Footer from "../components/Footer.js";
import ResultCard from "../shapefinder/ResultCard.js";


export default function MyProfilePage() {
    const [latestResult, setLatestResult] = useState(null);

    
    useEffect(()=> {
        const stored = 
        JSON.parse(localStorage.getItem("results") || "[]"); 
        //check results or empty
        //if there is something in the array, the array must > 0 or = 0
        if(stored.length > 0) {
            //take the first result
            setLatestResult(stored[0]);  
        }
    }, [])

    return (
        <main>
            <ProfileHeader />

            { latestResult ? <ResultCard {...latestResult}/> 
            : 
            <NoResultBox />}
            
            
            <Footer />
        </main>
        

        


    );
  

}