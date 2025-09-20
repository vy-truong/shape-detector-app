
import { playfair } from "../fonts";
export default function Footer() {
    return (
        <footer className="footer-container bg-white text-gray-600 py-10 px-6">
            <div className="px-[10rem] grid grid-cols-1 md:grid-cols-3 gap-8 md:text-left ">

                <div className="">

                    {/* FLEX COLUMN 1: BODYSHAPEFINDER TITLE AND SLOGAN WATEVER */}
                    <div>
                        <h2 className={` ${playfair.className} text-2xl font-bold `}>SHAPE FINDER</h2>
                        <p className="">Discover your shape and dress with confidence.</p>
                    </div>

                    {/* FLEX COLUMN 2: EXPLORE, LINK TO: FIND YOUR SHAPE + ABOUT US PAGE*/}
                    <div>

                    </div>

                    {/* FLEX COLUMN 3: JOIN US - LINK TO SIGN UP AND SIGN IN PAGE <3*/}
                    <div>

                    </div>

                </div>
                <div className="connect-flex-container">
                    <div className="connect-form-container">
                        <p>These will be sent straight to my email anonymous so if u r an introvert. dont be shy. I know there is a lot of places to improve. Please let me know your feedback and don't hold back so I can create more helpful websites !! Esp for the girly. Love yall </p>
                        <form id="connect-form" >

                            

                        </form>

                    </div>

                </div>
                <div className="right-reserved">
                    <p>© 2024 Vy's Shape Finder App. All Right Reserved.</p>
                </div>

            </div>
        </footer>
);
}