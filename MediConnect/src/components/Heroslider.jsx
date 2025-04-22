import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const slides = [
  {
    id: 1,
    title: "Expert Doctors",
    description: "Consult with top specialists from various medical fields.",
    image: "/images/doctors.jpg",
  },
  {
    id: 2,
    title: "24/7 Emergency Care",
    description: "We provide round-the-clock emergency support.",
    image: "/images/emergency.jpg",
  },
  {
    id: 3,
    title: "Advanced Treatments",
    description: "State-of-the-art medical technologies for better healthcare.",
    image: "/images/treatment.jpg",
  },
];

// Preload images
const preloadImages = (images) => {
  images.forEach((slide) => {
    const img = new Image();
    img.src = slide.image;
    img.decode().catch(() => {});
  });
};

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    preloadImages(slides);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image Section */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ willChange: "opacity, transform" }} // Smooth animation
          >
            <img
              src={slides[index].image}
              alt={slides[index].title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"} // Only first slide eager
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {slides[index].title}
          </h2>
          <p className="mt-3 text-lg text-white/90 drop-shadow-md">
            {slides[index].description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 justify-center">
            <button className="px-6 py-3 bg-[#4A8BBE] text-white font-semibold rounded-full shadow-lg hover:bg-[#6FA3D8] transition">
              Learn More
            </button>
            <button className="px-6 py-3 bg-white text-[#4A8BBE] font-semibold rounded-full shadow-lg hover:bg-gray-100 transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Social Media Icons */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-10">
        <a
          href="#"
          className="w-10 h-10 bg-blue-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-blue-800 transition"
        >
          <FaFacebookF size={18} />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-blue-400 text-white flex items-center justify-center rounded-full shadow-md hover:bg-blue-500 transition"
        >
          <FaTwitter size={18} />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full shadow-md hover:bg-blue-700 transition"
        >
          <FaLinkedinIn size={18} />
        </a>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              index === i ? "bg-blue-600 w-6" : "bg-white/60"
            }`}
            onClick={() => setIndex(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}

// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

// export default function HeroSection() {
//   return (
//     <section
//       className="relative w-full h-[600px] lg:h-[700px] bg-cover bg-center"
//       style={{ backgroundImage: `url('/images/doctors.jpg')` }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Content */}
//       <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
//         <div className="max-w-3xl text-white">
//           <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
//             Expert Healthcare Services
//           </h1>
//           <p className="mt-4 text-lg text-white/90 drop-shadow-md">
//             Consult with top specialists from various medical fields.
//           </p>
//           <div className="mt-6 flex gap-4 justify-center">
//             <button className="px-6 py-3 bg-[#4A8BBE] text-white font-semibold rounded-full shadow-lg hover:bg-[#6FA3D8] transition">
//               Learn More
//             </button>
//             <button className="px-6 py-3 bg-white text-[#4A8BBE] font-semibold rounded-full shadow-lg hover:bg-gray-100 transition">
//               Contact Us
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Social Media Icons */}
//       <div className="absolute left-6 bottom-10 flex flex-col gap-3 z-10">
//         <a
//           href="#"
//           className="w-10 h-10 bg-[#4A8BBE] text-white flex items-center justify-center rounded-full shadow-md hover:bg-[#6FA3D8] transition"
//         >
//           <FaFacebookF size={18} />
//         </a>
//         <a
//           href="#"
//           className="w-10 h-10 bg-[#4A8BBE] text-white flex items-center justify-center rounded-full shadow-md hover:bg-[#6FA3D8] transition"
//         >
//           <FaTwitter size={18} />
//         </a>
//         <a
//           href="#"
//           className="w-10 h-10 bg-[#4A8BBE] text-white flex items-center justify-center rounded-full shadow-md hover:bg-[#6FA3D8] transition"
//         >
//           <FaLinkedinIn size={18} />
//         </a>
//       </div>
//     </section>
//   );
// }
