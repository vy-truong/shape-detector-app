
import Header from "./components/Header";
import "./globals.css";
import { playfair, inter } from "./fonts";

export const metadata = {
  title: "Wardrobe Picks",
  description: "Find your body shape & style smarter",
}; 


/* START  */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> 
        {children}
      </body>

    </html>

  );
}


 