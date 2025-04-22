import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../actions/patientActions";
import { PATIENT_UPDATE_PROFILE_RESET } from "../constants/patientConstants";
import Toast from "../components/Toast"; // Import the Toast Component
import Message from "../components/Message";

const PatientProfileScreen = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_timezone: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    medical_history: "",
    allergies: "",
    blood_group: "",
    image: null,
  });
  const [toast, setToast] = useState({ message: "", type: "" });

  const patientProfile = useSelector((state) => state.patientProfile);
  const { loading, error, patient } = patientProfile;

  const patientUpdateProfile = useSelector(
    (state) => state.patientUpdateProfile
  );
  const { success: updateSuccess, error: updateError } = patientUpdateProfile;

  useEffect(() => {
    if (!patient || !patient.id || updateSuccess) {
      dispatch({ type: PATIENT_UPDATE_PROFILE_RESET });
      dispatch(getPatientProfile());
    } else {
      setFormData({
        ...patient,
        image: null, // Reset image field to null
      });
    }
  }, [dispatch, patient, updateSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      setToast({
        message: "Profile updated successfully!",
        type: "success",
      });
    }
    if (updateError) {
      setToast({
        message: updateError,
        type: "error",
      });
    }
    if (error) {
      setToast({
        message: error,
        type: "error",
      });
    }
  }, [updateSuccess, updateError, error]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("user_name", formData.user_name);
    data.append("user_email", formData.user_email);
    data.append("user_timezone", formData.user_timezone);
    data.append("date_of_birth", formData.date_of_birth);
    data.append("gender", formData.gender);
    data.append("phone_number", formData.phone_number);
    data.append("address", formData.address);
    data.append("emergency_contact_name", formData.emergency_contact_name);
    data.append("emergency_contact_number", formData.emergency_contact_number);
    data.append("medical_history", formData.medical_history);
    data.append("allergies", formData.allergies);
    data.append("blood_group", formData.blood_group);

    // Ensure the image is appended as a file
    if (formData.image) {
      data.append("image", formData.image);
    }

    dispatch(updatePatientProfile(data));
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img
          src={patient?.image || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#6FA3D8] shadow-md"
        />
        <h2 className="text-3xl font-bold mt-4">{formData.user_name}</h2>
        <p className="text-gray-600">{formData.user_email}</p>
      </div>

      <h1 className="text-3xl text-[#4A8BBE] font-semibold mb-6 text-center">
        Patient Profile
      </h1>

      {loading && <Message type="info">Loading...</Message>}
      {error && <Message type="error">{error}</Message>}
      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        ></textarea>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="user_timezone"
          value={formData.user_timezone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Timezone</option>
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
        <select
          name="blood_group"
          value={formData.blood_group}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input
          type="text"
          name="emergency_contact_name"
          value={formData.emergency_contact_name}
          onChange={handleInputChange}
          placeholder="Emergency Contact Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="emergency_contact_number"
          value={formData.emergency_contact_number}
          onChange={handleInputChange}
          placeholder="Emergency Contact Number"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="medical_history"
          value={formData.medical_history}
          onChange={handleInputChange}
          placeholder="Medical History"
          className="w-full p-2 border rounded"
        ></textarea>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          placeholder="Allergies"
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-[#4A8BBE] hover:bg-[#6FA3D8] text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfileScreen;
