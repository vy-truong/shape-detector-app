"use client"

function classifyShape(bust, waist, highHip, hip, units = "in") {
    const small = units === "in" ? 2.0 : 5.0;
    const notable = units === "in" ? 3.0 : 7.5;
    const avgBH = (bust + hip) / 2;
    const waistRel = waist / avgBH;
  
    if (Math.abs(bust - hip) <= small && waistRel <= 0.75) return "Hourglass";
    if (hip - bust >= notable) {
      const highHipGap = hip - highHip;
      if (highHipGap >= (units === "in" ? 2.0 : 5.0)) return "Spoon";
      return "Pear";
    }
    if (bust - hip >= notable) return "Inverted Triangle";
    if (waistRel >= 0.85 || waist >= bust || waist >= hip) return "Apple";
    return "Rectangle";
  }

export default function ShapeFinder() {
    // 1. create state for each body measurement and unit 

    //2. create state for result: body shape, summary, rec products 

    //3. load data from json uing useeffect async 

    //4. handle form submit with warning and error handling 
    //empty  
    //show reswult 
    //pick products based on clothing category using array filter 





    return (
        <main>
            {/* Header */}
            <section className="text-center">
                <h1 className="text-3xl font-bold text-[#2a3b5f] mb-4">
                Get Outfit Recommendations Tailored to You
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                Our outfit suggestions are based on fit, balance, and proportion. These are just
                guidelines to help you skip trial and error — fashion is freedom!
                </p>
                <p>righeiun</p>
            </section>

        </main>
    );
}