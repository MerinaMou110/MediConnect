import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  listSpecializations,
  listDesignations,
  listDoctors,
} from "../actions/doctorActions";

import HeroSlider from "../components/Heroslider";
import FeaturesSection from "../components/FeaturesSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import SpecializationList from "../components/SpecializationList";
import DesignationList from "../components/DesignationList";
import DoctorList from "../components/DoctorList";

export default function HomeScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listSpecializations());
    dispatch(listDesignations());
    dispatch(listDoctors());
  }, [dispatch]);

  return (
    <>
      <HeroSlider />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />

      {/* Specializations Section with Background */}
      <section className="bg-[#B7D3E3] py-6">
        <div className="container mx-auto p-4">
          <SpecializationList />
        </div>
      </section>

      {/* Designations Section with Background */}
      <section className="bg-[#A4C8E1] py-6">
        <div className="container mx-auto p-4">
          <DesignationList />
        </div>
      </section>

      {/* Doctors Section */}
      <section className="container mx-auto mt-10 p-4">
        <DoctorList showAll={false} />

        {/* View All Doctors Button */}
        <div className="text-center mt-6">
          <a
            href="/doctors"
            className="bg-[#6FA3D8] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#4A8BBE]"
          >
            View All Doctors
          </a>
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
