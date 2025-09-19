import React from "react";
import Image from "next/image"; 
import Link from "next/link"; 
import { playfair, inter  } from "../fonts"; 
import Button from '@mui/material/Button';
import { COLORS } from "../styles/colors";

export default function Hero() {
    return (
        <section className=" relative w-full ">
            <div className="relative">
            {/* Background Image */}
            <Image
            src = "/img/hero-img.jpg"
            alt = "Hero images - a group of diversed female models wearing swim suit, standing and posing elegantly"
            width={1600}
            height={900}
            // fill
            //  className="w-full h-auto object-contain md: object-cover"
            className="w-full h-auto"
            priority
            />
            {/* TEXT OVERLAY ;3  */}
            <div className={` ${playfair.className} absolute inset-0 flex items-center justify-center`}>
                <div className="text-center text-white max-w-5xl px-4">
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                        Find What Flatters
                    </h1>
                    <h2 className="text-4xl lg:text-5xl font-bold leading-snug pb-5">
                        Without the Guesswork
                    </h2>

                    <p className={` ${inter.className} text-sm sm:text-base md:text-lg lg:text-xl mb-6`}>
                        Smart outfit recommendations based on your shap. Save time, save money, 
                        and feel good in what you wear.
                    </p>
                <Link href="/shapefinder">
                <button style={{ 
                    }}
                className="btn-accent text-2xl font-semibold px-8 py-4 rounded-lg shadow-md ">
                    Find My Shape
                </button>
                </Link>
                </div>
            </div>
            </div>
        </section>
    );
}
