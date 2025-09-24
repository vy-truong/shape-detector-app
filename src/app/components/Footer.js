"use client"
import Link from "next/link";
import { playfair } from "../fonts";
import { useForm, ValidationError } from '@formspree/react';
export default function Footer() {
    
    //create state for click link 
    const [state, handleSubmit] = useForm("xjkablqz");

    //create state for notification like toast noti 
    
    //condition for click link: if click send to email anonymously 

    //use useeffect for after click it will get the auto email 
    return (
        <body>
        <footer className="footer-container bg-white py-20 px-auto md:px-20">
            <div className="px-[5rem] grid grid-cols-1 md:grid-cols-3 gap-20 mb-[7rem] md:text-left ">

                    {/* FLEX COLUMN 1: BODYSHAPEFINDER TITLE AND SLOGAN WATEVER */}
                    <div>
                        {/* Divider */}
                        <hr className="border-gray-300 mb-10" />
                        
                        <h2 className={` ${playfair.className} text-2xl font-bold `}>SHAPE FINDER</h2>
                        <p className="">Discover your shape and dress with confidence.</p>
                    </div>

                    {/* FLEX COLUMN 2: EXPLORE, LINK TO: FIND YOUR SHAPE + ABOUT US PAGE*/}
                    <div>
                        {/* Divider */}
                        <hr className="border-gray-300 mb-10" />
                        <h3 className="text-lg font-semibold mb-2">Explore</h3>
                        <ul className="space-y-1">
                            <li>
                            <Link href="/aboutus" className="hover:underline">
                                About us
                            </Link>
                            </li>
                            <li>
                            <Link href="/shapefinder" className="hover:underline">
                                Find my shape
                            </Link>
                            </li>
                        </ul>
                    </div>

                    {/* FLEX COLUMN 3: JOIN US - LINK TO SIGN UP AND SIGN IN PAGE <3*/}
                    <div>
                    <div>
                            {/* Divider */}
                            <hr className="border-gray-300 mb-10" />

                            <h3 className="text-lg font-semibold mb-2">Save your wardrobe guide</h3>
                            <ul className="space-y-1">
                                <li>
                                <Link href="/signin" className="hover:underline">
                                    Sign in
                                </Link>
                                </li>
                                <li>
                                <Link href="/createaccount" className="hover:underline">
                                    Create new account
                                </Link>
                                </li>
                            </ul>
                            </div>
                    </div>

            </div>

            {/* FEEDBACK FORM */}
            <div className="connect-flex-container">
            <div className="mt-10 max-w-2xl mx-auto text-center px-4">
                <p className="text-gray-600 text-sm mb-4">
                Your feedback goes straight to my email ✨.  
                Don’t be shy — every note helps me improve and create more intuitive websites.  
                Love ! 🩵
                </p>

                {state.succeeded ? (
                    <p className="text-green-600 font-medium">Thanks for your feedback 💌</p>
                ) : (
                <form 
                onSubmit={handleSubmit}
                id="connect-form" 
                action="https://formspree.io/f/xjkablqz" 
                method="POST"
                className="space-y-4">

                <input
                type="text"
                name="name"
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                />
                <label>Email:</label>
                <input type="email" name="email"  
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                />

                <label>Message:</label>
                <textarea
                    placeholder="Write your feedback here..."
                    id="message"
                    name="message"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows="4"
                />
                <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                />

                <button type="submit" disabled={state.submitting}
                 className="bg-[#fff3b8] font-medium px-8 py-3 rounded-[10px] shadow-md transition"
                >
                    Send feeback
                </button>

                </form> ) }
            </div>

            </div>

            <div className="mt-10 border-t pt-4 text-center text-gray-500 text-sm">
                <p>© 2024 Vy's Shape Finder App. All Right Reserved.</p>
            </div>
        </footer>
        
        </body>
);
}