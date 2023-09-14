import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputProps = {
  type: HTMLInputTypeAttribute | undefined;
  placeholder: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: string[];
  styles: string;
  required?: boolean;
};
const Input = ({
  type,
  placeholder,
  value,
  onChange,
  errors,
  styles,
  required = false,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        className={`${styles} rounded-xl border-1 px-2 h-[3rem] bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
          errors.length > 0 ? "border-red-500" : "border-primary"
        }`}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
      />
      {errors.length > 0 &&
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
