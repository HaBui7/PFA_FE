import React from "react";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
      {message}
      <br></br>
    </div>
  );
};

export default ErrorAlert;
