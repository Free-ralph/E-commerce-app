import React from "react";

const Input = ({ type, placeholder, value, onChange, errors , styles}) => {
  return (
    <>
      <input
        type={type}
        className={`${styles} rounded-xl border-1 p-4 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
          errors ? "border-red-500" : "border-primary"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {errors &&
        errors.map((error, i) => (
          <p
            key={i}
            className="text-red-400 text-sm font-semibold mt-1 text-center"
          >
            {error}
          </p>
        ))}
    </>
  );
};

export default Input;
