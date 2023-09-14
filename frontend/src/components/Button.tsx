import React from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  style?: string;
  onClick?: () => void;
  disabled?: boolean;
};

type ButtonLinkProps = {
  to: string;
} & ButtonProps;

const Button = ({
  text,
  icon,
  style,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`rounded-xl bg-pink-500  border-1 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-secondary ${style} text-sm  font-bold transition-all delay-[10] flex items-center justify-center`}
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );
};

export const ButtonLink = ({
  text,
  icon,
  style,
  onClick,
  to
}: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className={`rounded-xl py-2 px-4 bg-pink-500  border-1 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-secondary ${style} text-sm  font-bold transition-all delay-[10] flex items-center justify-center`}
      onClick={onClick}
    >
      {icon} {text}
    </Link>
  );
};

export default Button;
