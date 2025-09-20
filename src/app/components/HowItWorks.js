
// import { playfair, inter } from "../fonts";
// import { Play, Playfair } from "next/font/google";

// export default function HowItWorks() {
//     const steps = [
//       {
//         step: "STEP 01",
//         title: "Measure",
//         desc: "Input your bust, waist, and hip measurements with our intuitive form.",
//         icon: "📏",
//       },
//       {
//         step: "STEP 02",
//         title: "Analyze",
//         desc: "Our algorithm analyzes your proportions using fashion industry standards.",
//         icon: "🎯",
//       },
//       {
//         step: "STEP 03",
//         title: "Discover",
//         desc: "Receive your body shape with personalized styling recommendations.",
//         icon: "✨",
//       },
//     ];
  
//     return (
//       <section className="px-[10rem] py-12 bg-white rounded-lg shadow">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className={`${playfair.className}}text-2xl md:text-3xl font-bold`}>How it works</h2>
//           <p className="text-gray-500 mt-2">
//             Our elegant three-step process delivers personalized insights in minutes.
//           </p>
//         </div>
  
//         {/* Steps */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           {steps.map((item,indexNum) => (
//             <div key={indexNum} className="text-center">
//               {/* Icon */}
//               <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 text-2xl">
//                 {item.icon}
//               </div>
//               {/* Step number */}
//               <p className="text-yellow-600 font-semibold">{item.step}</p>
//               {/* Title */}
//               <h3 className="text-lg font-bold">{item.title}</h3>
//               {/* Description */}
//               <p className="text-gray-500 mt-2">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }
import Image from "next/image";
import { playfair, inter } from "../fonts";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`${playfair.className} text-[40px] md:text-[40px] font-bold text-center mb-16`}>
          How it works
        </h2>

        <div className="grid gap-16">
          {/* STEP 01 - Minimal line + text only */}
          <div className="text-center">
            <p className="text-sm text-gray-500 tracking-wide mb-2">STEP 03</p>
            <h3 className={`${playfair.className} text-2xl font-bold mb-3`}>Discover</h3>
            <p className={`${inter.className} text-gray-600 max-w-lg mx-auto`}>
              Get your body shape results with curated outfit recommendations. Style, simplified.
            </p>
          </div>

          {/* STEP 03 - Minimal line + text only */}
          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-sm text-gray-500 tracking-wide mb-2">STEP 03</p>
            <h3 className={`${playfair.className} text-2xl font-bold mb-3`}>Discover</h3>
            <p className={`${inter.className} text-gray-600 max-w-lg mx-auto`}>
              Get your body shape results with curated outfit recommendations. Style, simplified.
            </p>
          </div>

          {/* STEP 03 - Minimal line + text only */}
          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-sm text-gray-500 tracking-wide mb-2">STEP 03</p>
            <h3 className={`${playfair.className} text-2xl font-bold mb-3`}>Discover</h3>
            <p className={`${inter.className} text-gray-600 max-w-lg mx-auto`}>
              Get your body shape results with curated outfit recommendations. Style, simplified.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
