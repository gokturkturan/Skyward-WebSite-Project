import React from "react";

const Message = ({ variant, children }) => {
  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm 
      ${
        variant === "danger"
          ? "text-red-500 border-red-500"
          : variant === "success"
          ? "text-green-800 border-green-300"
          : "text-blue-800 border-blue-300"
      }
        border-4 rounded-lg font-medium`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 inline w-4 h-4 mr-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div>{children}</div>
    </div>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
