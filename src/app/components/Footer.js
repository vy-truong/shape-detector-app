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
        <footer className="footer-container py-10 px-6 md:px-12
        bg-gradient-to-br from-[#6FA6E8] via-[#5A8BD9] to-[#355CA8]
        ">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left justify-items-center">

                        {/* FLEX COLUMN 1: BODYSHAPEFINDER TITLE AND SLOGAN WATEVER */}
                        <div>
                            <h2 className={` ${playfair.className} text-2xl font-bold `}>SHAPE FINDER</h2>
                            <p className="">Discover your shape and dress with confidence.</p>
                        </div>

                        {/* FLEX COLUMN 2: EXPLORE, LINK TO: FIND YOUR SHAPE + ABOUT US PAGE*/}
                        <div>
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
            </div>

            {/* FEEDBACK FORM - smaller, left-aligned, on the left side */}
            <div className="flex justify-center mt-20">
            <div className="w-full max-w-lg text-left px-4">
                <h4 className="font-semibold text-text text-lg mb-4">Website Development Feedback</h4>
                {/* <p className="text-gray-600 text-sm mb-4">
                Your feedback goes straight to my email ✨.  
                Every note helps me improve and create more intuitive websites.  
                Love ! 
                </p> */}

                {state.succeeded ? (
                    <p className="text-green-600 font-medium">Thanks for your feedback</p>
                ) : (
                <form 
                onSubmit={handleSubmit}
                id="connect-form" 
                action="https://formspree.io/f/xjkablqz" 
                method="POST"
                className="space-y-4 max-w-md">

                <div className="flex items-center gap-3">
                <label className="text-text/90 w-24">Name</label>
                <input
                type="text"
                name="name"
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 bg-white/70 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                </div>
                <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                />
                <div className="flex items-center gap-3">
                <label className="text-text/90 w-24">Email</label>
                <input type="email" name="email" placeholder="Your email" required
                className="w-full px-4 py-2 bg-white/70  rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                </div>
                <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                />

                <div className="flex items-start gap-3">
                <label className="text-text/90 w-24 pt-2">Message</label>
                <textarea
                    placeholder="Please let me know what features/design you would like to see. Every note helps me improve and create more intuitive websites."
                    id="message"
                    name="message"
                    className="w-full px-4 py-2 bg-white/70  rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows="6"
                    required

                />
                </div>
                <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                />

                {/* Right-aligned submit button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={state.submitting}
                        className="bg-heading-hd font-medium px-6 py-2 rounded-[10px] shadow-md hover:bg-heading-hd/80 transition"
                    >
                        Send feedback
                    </button>
                </div>

                </form> ) }
            </div>

            </div>

            <div className="mt-10 border-t pt-4 text-center text-text/60 text-sm">
                <p>© 2024 Vy&apos;s Shape Finder App. All Right Reserved.</p>
            </div>
        </footer>
        
   
);
}
