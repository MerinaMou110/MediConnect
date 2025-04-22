import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { MultiSelect } from "react-multi-select-component";
import Toast from "../components/Toast"; // Import the Toast Component
import Message from "../components/Message";

import {
  getDoctorProfile,
  updateDoctorProfile,
  listDesignations,
  listSpecializations,
} from "../actions/doctorActions";

const DoctorProfileScreen = () => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const doctorProfile = useSelector((state) => state.doctorProfile);
  const { loading, error, doctor } = doctorProfile;

  const doctorProfileUpdate = useSelector((state) => state.doctorProfileUpdate);
  const { success } = doctorProfileUpdate;

  const designationList = useSelector((state) => state.designationList);
  const { designations } = designationList;

  const specializationList = useSelector((state) => state.specializationList);
  const { specializations } = specializationList;

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [designation, setDesignation] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [image, setImage] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [languagesSpoken, setLanguagesSpoken] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (success) {
      setShowToast(true);
    }
  }, [success]);

  // Fetch the doctor profile on component mount
  useEffect(() => {
    dispatch(getDoctorProfile());
    dispatch(listDesignations());
    dispatch(listSpecializations());
  }, [dispatch]);

  // Update state when doctor data is fetched
  // Update state when doctor data is fetched
  useEffect(() => {
    if (doctor) {
      setUserName(doctor.user_name || "");
      setUserEmail(doctor.user_email || "");
      setBio(doctor.bio || "");
      setFee(doctor.fee || "");
      setContactNumber(doctor.contact_number || "");
      setClinicAddress(doctor.clinic_address || "");
      setMeetLink(doctor.meet_link || "");
      setExperienceYears(doctor.experience_years || "");
      setQualifications(doctor.qualifications || "");
      setLanguagesSpoken(doctor.languages_spoken || "");
      setIsAvailable(doctor.is_available || false);
      setCountry(doctor.country || "");
      setTimezone(doctor.timezone || "");

      // Format designation and specialization for MultiSelect
      const formattedDesignation = doctor.designation
        ?.map((id) => {
          const matched = designations.find(
            (item) => item.id === parseInt(id, 10)
          );
          return matched ? { label: matched.name, value: matched.id } : null;
        })
        .filter(Boolean);

      const formattedSpecialization = doctor.specialization
        ?.map((id) => {
          const matched = specializations.find(
            (item) => item.id === parseInt(id, 10)
          );
          return matched ? { label: matched.name, value: matched.id } : null;
        })
        .filter(Boolean);

      setDesignation(formattedDesignation || []);
      setSpecialization(formattedSpecialization || []);
    }
  }, [doctor, designations, specializations]);

  // Format data for MultiSelect
  const formattedDesignations = designations?.map((item, index) => ({
    label: item.name,
    value: item.id ?? `no-id-${index}`, // Fallback to avoid undefined
  }));

  const formattedSpecializations = specializations?.map((item, index) => ({
    label: item.name,
    value: item.id ?? `no-id-${index}`, // Fallback to avoid undefined
  }));

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_name", userName);
    formData.append("user_email", userEmail);
    if (image) formData.append("image", image);
    formData.append("bio", bio);
    formData.append("fee", parseFloat(fee));
    formData.append("contact_number", contactNumber);
    formData.append("clinic_address", clinicAddress);
    formData.append("meet_link", meetLink);
    formData.append("experience_years", Number(experienceYears) || 0);

    formData.append("qualifications", qualifications);
    formData.append("languages_spoken", languagesSpoken);
    formData.append("is_available", isAvailable ? "true" : "false");
    formData.append("country", country);
    formData.append("timezone", timezone);

    // ✅ Convert to integers and append as PKs
    const designationIds = designation.map((item) => parseInt(item.value, 10));
    designationIds.forEach((id) => {
      if (!isNaN(id)) {
        formData.append("designation", id);
      }
    });

    const specializationIds = specialization.map((item) =>
      parseInt(item.value, 10)
    );
    specializationIds.forEach((id) => {
      if (!isNaN(id)) {
        formData.append("specialization", id);
      }
    });

    dispatch(updateDoctorProfile(formData));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-[#4A8BBE] mb-5 text-center">
        Doctor Profile
      </h1>
      {loading && <Message type="info">Loading...</Message>}
      {error && <Message type="error">{error}</Message>}
      {success && showToast && (
        <Toast
          message="Profile Updated Successfully"
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="flex flex-col items-center mb-8">
        <img
          src={doctor?.image || "/default-doctor.png"}
          alt="Doctor"
          className="w-32 h-32 rounded-full border-4 border-[#8FB8D8] shadow-md"
        />
        <div className="w-full ">
          <h2 className="text-2xl text-center font-semibold text-[#6FA3D8]">
            {userName}
          </h2>
          <p className="text-gray-600 text-center">
            {designation.map((item) => item.label).join(", ")}
          </p>
          <p className="text-gray-600 text-center">
            {specialization.map((item) => item.label).join(", ")}
          </p>
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-3 border rounded-lg"
        />
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
            disabled={!isEditingName}
          />
          <PencilSquareIcon
            className="h-5 w-5 text-[#4A8BBE] cursor-pointer"
            onClick={() => setIsEditingName(!isEditingName)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
            disabled={!isEditingEmail}
          />
          <PencilSquareIcon
            className="h-5 w-5 text-[#4A8BBE] cursor-pointer"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
          />
        </div>

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <input
          type="text"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <textarea
          placeholder="Clinic Address"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Designation:</h3>
          <MultiSelect
            options={formattedDesignations}
            value={designation}
            onChange={setDesignation}
            labelledBy="Select Designation"
            className="text-black"
          />

          <h3 className="text-xl font-semibold">Specialization:</h3>
          <MultiSelect
            options={formattedSpecializations}
            value={specialization}
            onChange={setSpecialization}
            labelledBy="Select Specialization"
            className="text-black"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Selected Designations:</h3>
            <ul>
              {designation.map((item, index) => (
                <li key={`designation-${item.value ?? index}`}>{item.label}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-4">
              Selected Specializations:
            </h3>
            <ul>
              {specialization.map((item, index) => (
                <li key={`specialization-${item.value ?? index}`}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <input
          type="text"
          placeholder="Meet Link"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <input
          type="number"
          placeholder="Experience Years"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <input
          type="text"
          placeholder="Qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />
        <input
          type="text"
          placeholder="Languages Spoken"
          value={languagesSpoken}
          onChange={(e) => setLanguagesSpoken(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE]"
        />

        <div className="mb-4">
          <label className="block text-[#4A8BBE] font-medium">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BBE] bg-white"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="America/Denver">America/Denver</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="America/Toronto">America/Toronto</option>
            <option value="America/Vancouver">America/Vancouver</option>
            <option value="America/Sao_Paulo">America/Sao_Paulo</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="Europe/Madrid">Europe/Madrid</option>
            <option value="Europe/Rome">Europe/Rome</option>
            <option value="Europe/Moscow">Europe/Moscow</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Asia/Shanghai">Asia/Shanghai</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="Asia/Seoul">Asia/Seoul</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
            <option value="Australia/Melbourne">Australia/Melbourne</option>
            <option value="Australia/Brisbane">Australia/Brisbane</option>
            <option value="Pacific/Auckland">Pacific/Auckland</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#4A8BBE] text-white py-2 px-6 rounded-lg hover:bg-[#6FA3D8] transition-all duration-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorProfileScreen;
