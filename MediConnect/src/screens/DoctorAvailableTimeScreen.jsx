import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listAvailableTimes,
  createAvailableTime,
  updateAvailableTime,
  deleteAvailableTime,
} from "../actions/availableTimeActions";
import {
  AVAILABLE_TIME_CREATE_RESET,
  AVAILABLE_TIME_UPDATE_RESET,
} from "../constants/availableTimeConstants";

const AvailableTimeScreen = () => {
  const dispatch = useDispatch();

  // Local State for Form Inputs
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editId, setEditId] = useState(null);

  // Get Available Time List
  const availableTimeList = useSelector((state) => state.availableTimeList);
  const { loading, error, availableTimes } = availableTimeList;

  // Create Available Time
  const availableTimeCreate = useSelector((state) => state.availableTimeCreate);
  const { success: successCreate, error: errorCreate } = availableTimeCreate;

  // Update Available Time
  const availableTimeUpdate = useSelector((state) => state.availableTimeUpdate);
  const { success: successUpdate, error: errorUpdate } = availableTimeUpdate;

  // Delete Available Time
  const availableTimeDelete = useSelector((state) => state.availableTimeDelete);
  const { success: successDelete, error: errorDelete } = availableTimeDelete;

  useEffect(() => {
    if (successCreate || successUpdate || successDelete) {
      dispatch({ type: AVAILABLE_TIME_CREATE_RESET });
      dispatch({ type: AVAILABLE_TIME_UPDATE_RESET });
      setDate("");
      setStartTime("");
      setEndTime("");
      setEditId(null);
      dispatch(listAvailableTimes());
    } else {
      dispatch(listAvailableTimes());
    }
  }, [dispatch, successCreate, successUpdate, successDelete]);

  // Function to convert 24-hour format to 12-hour format with AM/PM
  const convertTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Convert the start and end times to 12-hour format
    const formattedStartTime = convertTo12Hour(startTime);
    const formattedEndTime = convertTo12Hour(endTime);

    const data = {
      date,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };

    if (editId) {
      dispatch(updateAvailableTime(editId, data));
    } else {
      dispatch(createAvailableTime(data));
    }
  };

  const editHandler = (time) => {
    setEditId(time.id);
    setDate(time.date); // Set date when editing
    setStartTime(time.start_time);
    setEndTime(time.end_time);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      dispatch(deleteAvailableTime(id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Available Time Slots</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <ul className="mb-4">
            {availableTimes.map((time) => (
              <li
                key={time.id}
                className="bg-gray-100 p-2 rounded mb-2 flex justify-between items-center"
              >
                <span>
                  {time.date} | {time.start_time} - {time.end_time}
                </span>
                <div>
                  <button
                    onClick={() => editHandler(time)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(time.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={submitHandler} className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {editId ? "Edit" : "Add"} Time Slot
        </h2>

        {errorCreate && <p className="text-red-500">{errorCreate}</p>}
        {errorUpdate && <p className="text-red-500">{errorUpdate}</p>}
        {errorDelete && <p className="text-red-500">{errorDelete}</p>}

        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AvailableTimeScreen;
