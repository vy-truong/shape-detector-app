"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header.js";
import { shapeExplanations } from "../data/shapeExplanations.js";
import NoResultBox from "./NoResultBox.js";
import ProfileHeader from "./ProfileHeader.js";
import Footer from "../components/Footer.js";

export default function MyProfilePage() {
    const hasResult = false; 
    return (
        <main>
            <ProfileHeader />

            { !hasResult ? <NoResultBox/> : <ResultCard />}
            <Footer />
        </main>
        

        


    );
  

}