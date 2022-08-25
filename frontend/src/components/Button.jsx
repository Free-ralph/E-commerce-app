import React from "react";
import { Link } from "react-router-dom";

export const Button = ({ color, text, textColor, extra, onClick}) => {
  return (
    <div
     onClick={onClick}
      className={`${color} rounded-xl text-center ${textColor} font-semibold py-2 flex items-center justify-center ${extra} cursor-pointer transition-all delay-75`}
    >
      {text}
    </div>
  );
};

export const ButtonLink = ({ color, text, textColor, extra, to}) => {
  return (
    <Link
     to={to}
      className={`${color} rounded-xl text-center ${textColor} font-semibold py-2 flex items-center justify-center ${extra} cursor-pointer transition-all delay-75`}
    >
      {text}
    </Link>
  );
};

