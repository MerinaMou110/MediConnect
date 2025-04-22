import PropTypes from "prop-types";
const Message = ({ type, children }) => {
  const typeStyles = {
    error: "bg-red-100 border-l-4 border-red-500 text-red-700",
    success: "bg-green-100 border-l-4 border-green-500 text-green-700",
    info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
  };

  return (
    <div className={`p-3 my-2 rounded ${typeStyles[type] || typeStyles.info}`}>
      {children}
    </div>
  );
};

export default Message;
