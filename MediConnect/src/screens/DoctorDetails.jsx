import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails } from "../actions/doctorActions";
import { useParams } from "react-router-dom";
import { FaPhone, FaStar, FaRegStar } from "react-icons/fa";

const DoctorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const doctorDetails = useSelector((state) => state.doctorDetails);
  const { loading, error, doctor } = doctorDetails;

  useEffect(() => {
    dispatch(getDoctorDetails(id));
  }, [dispatch, id]);

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="bg-white shadow-lg rounded-3xl p-8 lg:flex lg:gap-8 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2">
          <div className="lg:w-1/3 flex justify-center items-center">
            <img
              src={doctor?.image || "/images/default-doctor.jpg"}
              alt={doctor?.user_name}
              className="w-full h-80 object-contain rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:w-2/3 mt-6 lg:mt-0">
            <h2 className="text-3xl font-bold text-[#4A8BBE]">
              {doctor?.user_name || "Unknown Doctor"}
            </h2>
            <p className="text-xl text-gray-600 font-medium mt-2">
              {doctor?.designation?.map((d) => d.name).join(", ") ||
                "No Designation"}
            </p>
            <p className="text-lg text-[#6FA3D8] mt-4">
              Specialization:{" "}
              <span className="text-gray-800">
                {doctor?.specialization?.map((s) => s.name).join(", ") ||
                  "Not specified"}
              </span>
            </p>
            <p className="text-lg text-gray-800 mt-2">
              Fee: <span className="text-[#4A8BBE]">${doctor?.fee}</span>
            </p>
            <p className="text-lg text-gray-800 mt-2">
              Clinic Address:{" "}
              <span className="text-[#4A8BBE]">
                {doctor?.clinic_address || "Not provided"}
              </span>
            </p>
            <p className="text-lg text-gray-800 mt-2 flex items-center">
              <FaPhone className="mr-2" />
              {doctor?.contact_number || "Not available"}
            </p>
            <div className="mt-4 flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) =>
                i < Math.round(doctor?.average_rating) ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )
              )}
              <span className="text-gray-600 ml-2">
                ({doctor?.total_reviews} Reviews)
              </span>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="bg-[#4A8BBE] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#6FA3D8] transition duration-300">
                Book Appointment
              </button>
              <button className="bg-[#B7D3E3] text-[#4A8BBE] py-2 px-6 rounded-lg font-semibold hover:bg-[#A4C8E1] transition duration-300">
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
