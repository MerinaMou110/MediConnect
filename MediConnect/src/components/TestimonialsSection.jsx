import { motion } from "framer-motion";

const testimonials = [
  {
    name: "John Doe",
    feedback: "Amazing healthcare services with expert doctors!",
    image: "/images/patient1.jpg",
  },
  {
    name: "Jane Smith",
    feedback: "The best hospital experience I've ever had!",
    image: "/images/patient2.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <motion.section
      className="py-20 bg-[#8FB8D8] text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-bold text-white">What Our Patients Say</h2>
      <div className="mt-10 flex flex-col md:flex-row gap-8 justify-center">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-gray-800"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-16 h-16 mx-auto rounded-full"
            />
            <p className="mt-4 italic">"{testimonial.feedback}"</p>
            <h4 className="mt-2 font-semibold">{testimonial.name}</h4>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
