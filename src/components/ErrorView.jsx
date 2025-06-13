import React from "react";

const ErrorView = ({ onRetry }) => {
  return (
    <div>
      <p>Error loading data.</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
};

export default ErrorView;
