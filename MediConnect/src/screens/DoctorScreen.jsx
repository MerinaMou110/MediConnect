import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listSpecializations,
  listDesignations,
} from "../actions/doctorActions";
import DoctorList from "../components/DoctorList";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fa"; // Import all Font Awesome icons
import { FaTimesCircle } from "react-icons/fa"; // Import reset icon

const DoctorScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const getIconComponent = (iconName) => {
    if (!iconName) return null;
    // Convert "faHeartbeat" to "FaHeartbeat"
    const formattedIconName = "Fa" + iconName.substring(2);
    const IconComponent = Icons[formattedIconName];
    return IconComponent ? (
      <IconComponent className="text-[#4A8BBE] text-2xl mb-2" />
    ) : null;
  };

  // State to store selected filters
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  // State for managing how many items to show
  const [showMoreSpecializations, setShowMoreSpecializations] = useState(false);
  const [showMoreDesignations, setShowMoreDesignations] = useState(false);

  // Limit items initially
  const initialLimit = 5;

  // Get specialization and designation lists from Redux store
  const specializationList = useSelector((state) => state.specializationList);
  const { specializations = [] } = specializationList;

  const designationList = useSelector((state) => state.designationList);
  const { designations = [] } = designationList;

  // Fetch specializations and designations on component mount
  useEffect(() => {
    dispatch(listSpecializations());
    dispatch(listDesignations());
  }, [dispatch]);

  // Sync state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedSpecialization(params.get("specialization") || "");
    setSelectedDesignation(params.get("designation") || "");
  }, [location.search]);

  // Handle Filter Clicks
  const handleSpecializationClick = (slug) => {
    const params = new URLSearchParams(location.search);
    if (slug) {
      params.set("specialization", slug);
    } else {
      params.delete("specialization");
    }
    navigate(`/doctors?${params.toString()}`);
  };

  const handleDesignationClick = (slug) => {
    const params = new URLSearchParams(location.search);
    if (slug) {
      params.set("designation", slug);
    } else {
      params.delete("designation");
    }
    navigate(`/doctors?${params.toString()}`);
  };

  // Reset Filters
  const resetSpecialization = () => {
    setSelectedSpecialization("");
    const params = new URLSearchParams(location.search);
    params.delete("specialization");
    navigate(`/doctors?${params.toString()}`);
  };

  const resetDesignation = () => {
    setSelectedDesignation("");
    const params = new URLSearchParams(location.search);
    params.delete("designation");
    navigate(`/doctors?${params.toString()}`);
  };

  // Toggle functions for Show More / Show Less
  const toggleSpecializations = () =>
    setShowMoreSpecializations((prev) => !prev);
  const toggleDesignations = () => setShowMoreDesignations((prev) => !prev);

  // Determine number of items to show
  const visibleSpecializations = showMoreSpecializations
    ? specializations
    : specializations.slice(0, initialLimit);

  const visibleDesignations = showMoreDesignations
    ? designations
    : designations.slice(0, initialLimit);

  return (
    <div className="container mx-auto p-4 flex gap-6">
      {/* Sidebar Filters */}
      <aside className="w-1/5 bg-white rounded-xl shadow-lg p-4 h-fit">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#4A8BBE] mb-4">
            Specializations
          </h2>
          {selectedSpecialization && (
            <FaTimesCircle
              onClick={resetSpecialization}
              className="text-[#4A8BBE] text-xl cursor-pointer hover:text-red-500 transition-colors"
              title="Reset Specialization"
            />
          )}
        </div>
        <ul className="space-y-2">
          {visibleSpecializations.map((spec) => (
            <li
              key={spec.slug}
              onClick={() => handleSpecializationClick(spec.slug)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[#B7D3E3] transition-colors ${
                selectedSpecialization === spec.slug
                  ? "font-bold text-[#4A8BBE] bg-[#A4C8E1]"
                  : "text-gray-600"
              }`}
            >
              <span>{getIconComponent(spec.icon)}</span>
              <span>{spec.name}</span>
            </li>
          ))}
        </ul>
        {specializations.length > initialLimit && (
          <button
            onClick={toggleSpecializations}
            className="mt-2 text-sm text-[#4A8BBE] hover:underline"
          >
            {showMoreSpecializations ? "Show Less" : "Show More"}
          </button>
        )}

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-bold text-[#4A8BBE] mb-4">
            Designations
          </h2>
          {selectedDesignation && (
            <FaTimesCircle
              onClick={resetDesignation}
              className="text-[#4A8BBE] text-xl cursor-pointer hover:text-red-500 transition-colors"
              title="Reset Designation"
            />
          )}
        </div>
        <ul className="space-y-2">
          {visibleDesignations.map((des) => (
            <li
              key={des.slug}
              onClick={() => handleDesignationClick(des.slug)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[#B7D3E3] transition-colors ${
                selectedDesignation === des.slug
                  ? "font-bold text-[#4A8BBE] bg-[#A4C8E1]"
                  : "text-gray-600"
              }`}
            >
              <span>{getIconComponent(des.icon)}</span>
              <span>{des.name}</span>
            </li>
          ))}
        </ul>
        {designations.length > initialLimit && (
          <button
            onClick={toggleDesignations}
            className="mt-2 text-sm text-[#4A8BBE] cursor-pointer hover:underline hover:text-[#6FA3D8] transition-colors"
          >
            {showMoreDesignations ? "Show Less" : "Show More"}
          </button>
        )}
      </aside>

      {/* Doctor List */}
      <main className="w-3/3">
        <DoctorList
          specializationSlug={selectedSpecialization}
          designationSlug={selectedDesignation}
          showAll={true}
        />
      </main>
    </div>
  );
};

export default DoctorScreen;
