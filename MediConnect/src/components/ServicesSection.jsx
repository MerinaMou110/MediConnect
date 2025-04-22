import { motion } from "framer-motion";

const services = [
  {
    title: "Cardiology",
    description: "Advanced heart care with expert cardiologists.",
    icon: "❤️",
  },
  {
    title: "Neurology",
    description: "Top-notch neurological treatments and research.",
    icon: "🧠",
  },
  {
    title: "Orthopedics",
    description: "Best orthopedic surgeons for bone and joint care.",
    icon: "🦴",
  },
];

export default function ServicesSection() {
  return (
    <motion.section
      className="py-20 bg-white text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#4A8BBE]">Our Services</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#B7D3E3] p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl">{service.icon}</div>
              <h3 className="text-2xl font-semibold mt-4">{service.title}</h3>
              <p className="text-gray-800 mt-2">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
