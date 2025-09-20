import Image from "next/image";
import Link from "next/link";
import { playfair } from "../fonts";

export default function GetStart() {
    return (
    <div className="relative w-full">
        <div className="relative w-full h-[500px] md:h-[400px] lg:h-[500px]">
            {/* Background Image */}
            <Image
            src = "/img/get-started-img.jpg"
            alt = "Group of diverse models joining hands"
            fill
            className="object-cover object-center w-full h-full"
            priority
            />
            {/* TEXT OVERLAY ;3  */}
            <div className={` ${playfair.className} absolute inset-0 flex items-center justify-center`}>
                <div className="text-center text-white max-w-5xl px-4">
                <Link href="/shapefinder">
                    <button style={{fontStyle: "italic"}} className="inline-block text-[40px] font-semibold text-white underline hover:text-yellow-200 transition">
                        Find My Shape
                    </button>
                </Link>
                </div>
            </div>
        </div>
        </div>

    );
}