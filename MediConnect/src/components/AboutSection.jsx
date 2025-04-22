import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <motion.section
      className="py-20 bg-[#A4C8E1] text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#4A8BBE]">About Us</h2>
        <p className="mt-4 text-lg text-gray-800">
          We are committed to providing the best healthcare services with
          advanced technology and expert medical professionals.
        </p>
      </div>
    </motion.section>
  );
}
