import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listDoctors } from "../actions/doctorActions";
import { Link } from "react-router-dom";

const DoctorList = ({ specializationSlug, designationSlug }) => {
  const dispatch = useDispatch();
  const doctorList = useSelector((state) => state.doctorList);
  const { loading, error, doctors } = doctorList;

  useEffect(() => {
    // Fetch doctors whenever filters change
    dispatch(listDoctors(specializationSlug, designationSlug));
  }, [dispatch, specializationSlug, designationSlug]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#4A8BBE] mb-8">
        Meet Our Doctors
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {doctors?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.results.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#4A8BBE] border border-transparent"
            >
              <Link to={`/doctor/${doctor.id}`}>
                <div className="w-full h-48 bg-white flex justify-center items-center overflow-hidden rounded-t-2xl">
                  <img
                    src={doctor.image || "/images/default-doctor.jpg"}
                    alt="Doctor"
                    className="h-full object-contain object-center"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-[#4A8BBE] transition duration-200 text-center">
                    {doctor.user_name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mt-1 text-center">
                    {doctor.designation?.map((d) => d.name).join(", ") ||
                      "No designation"}
                  </p>
                  <p className="text-sm text-[#4A8BBE] mt-2 font-medium text-center">
                    Specialization:{" "}
                    <span className="text-gray-800">
                      {doctor.specialization?.map((s) => s.name).join(", ") ||
                        "Not specified"}
                    </span>
                  </p>
                  <button className="mt-4 w-full bg-[#4A8BBE] text-white py-2 rounded-lg font-semibold hover:bg-[#6FA3D8] transition duration-300 cursor-pointer">
                    Book Appointment
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No doctors found.</p>
      )}
    </div>
  );
};

export default DoctorList;
