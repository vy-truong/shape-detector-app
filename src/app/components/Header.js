"use client"; 
import { playfair, intern } from "../fonts";
import Link from "next/link"; 
import { useState } from "react";


export default function Header() {
    const  [openMenu, setOpenMenu ] = useState(false);

    return (
        <header className="w-full flex items-center justify-between px-8 py-4 shadow">
            {/* Left: Logo */}
            <div className={` ${playfair.className} text-2xl font-bold`}>SHAPE FINDER</div>

            {/* Center: Main Nav */}
            <nav className="flex gap-6">
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/shapefinder">Shape Finder</Link>
                <Link href="/contact">Contact Us</Link>
            </nav>

            {/* Right: Profile */}
            <div>
                <Link href="/profile" className="flex items-center gap-2">
                {/* <User size={20} /> */}
                <span>My Profile</span>
                </Link>
            </div>

        </header>


    );
}