"use client"; 
import Link from "next/link"; 


export default function Header() {
    return (
        <header className="w-full flex items-center justify-between px-8 py-4 shadow">
            {/* Left: Logo */}
            <div className="text-xl font-bold">SHAPE FINDER</div>

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