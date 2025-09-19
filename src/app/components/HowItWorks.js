
import { playfair, inter } from "../fonts";
import { Play, Playfair } from "next/font/google";

export default function HowItWorks() {
    const steps = [
      {
        step: "STEP 01",
        title: "Measure",
        desc: "Input your bust, waist, and hip measurements with our intuitive form.",
        icon: "📏",
      },
      {
        step: "STEP 02",
        title: "Analyze",
        desc: "Our algorithm analyzes your proportions using fashion industry standards.",
        icon: "🎯",
      },
      {
        step: "STEP 03",
        title: "Discover",
        desc: "Receive your body shape with personalized styling recommendations.",
        icon: "✨",
      },
    ];
  
    return (
      <section className="px-[10rem] py-12 bg-white rounded-lg shadow">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className={`${playfair.className}}text-2xl md:text-3xl font-bold`}>How it works</h2>
          <p className="text-gray-500 mt-2">
            Our elegant three-step process delivers personalized insights in minutes.
          </p>
        </div>
  
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((item,indexNum) => (
            <div key={indexNum} className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 text-2xl">
                {item.icon}
              </div>
              {/* Step number */}
              <p className="text-yellow-600 font-semibold">{item.step}</p>
              {/* Title */}
              <h3 className="text-lg font-bold">{item.title}</h3>
              {/* Description */}
              <p className="text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  