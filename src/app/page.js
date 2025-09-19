import Footer from "./components/Footer";
import GetStart from "./components/GetStart";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";


export default function Home() {
  return (
    <main>
      <div>
        <Hero />
        <HowItWorks/>
        <GetStart />
        <Footer />

      </div>
    </main>
  );
}
