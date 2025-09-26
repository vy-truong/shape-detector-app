
import Header from "./components/Header";
import "./globals.css";


export const metadata = {
  title: "Wardrobe Picks",
  description: "Find your body shape & style smarter",
}; 


/* START  */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg text-text font-inter">
        <Header /> 
        {children}
      </body>

    </html>

  );
}


 