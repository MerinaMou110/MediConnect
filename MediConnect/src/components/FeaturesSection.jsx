import { motion } from "framer-motion";

const features = [
  {
    title: "Easy Appointments",
    description: "Book appointments with top doctors in just a few clicks.",
    icon: "📅",
  },
  {
    title: "Medical Records",
    description: "Access and manage your medical history securely.",
    icon: "📂",
  },
  {
    title: "24/7 Support",
    description: "Our team is available anytime to assist you.",
    icon: "📞",
  },
];

export default function FeaturesSection() {
  return (
    <motion.div
      className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-5xl">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-[#4A8BBE] mt-4">
            {feature.title}
          </h3>
          <p className="text-gray-600 mt-2">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
