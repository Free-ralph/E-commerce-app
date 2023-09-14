import PuffLoader from "react-spinners/PuffLoader";

type SpinnerProps = {
  size?: number;
  color?: string;
};
const Spinner = ({ size, color }: SpinnerProps) => {
  return (
    <PuffLoader size={size ? size : 40} color={color ? color : "#ec4899"} />
  );
};

export default Spinner;
