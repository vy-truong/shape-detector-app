
import Header from "./components/Header";
import "./globals.css";


export const metadata = {
  title: "Shape Finder",
  description: "Find your body shape & style smarter",
}; 


/* START  */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body>
        <div>
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}




 