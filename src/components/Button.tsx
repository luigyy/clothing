import React from "react";

interface ButtonProps {
  back_color: "orange" | "blue" | "green";
}

const Button: React.FC<ButtonProps> = ({ back_color }) => {
  return (
    <div className="inline-block items-center justify-center ">
      <a
        href="#_"
        className="group relative inline-block px-6 py-2 font-medium"
      >
        <span
          className={`absolute inset-0 h-full w-full translate-x-1 translate-y-1 transform rounded ${
            back_color === "orange" ? "bg-orange" : "bg-green"
          }  transition duration-200 ease-out group-hover:-translate-x-0 group-hover:-translate-y-0`}
        ></span>
        <span
          className={`absolute inset-0 h-full w-full rounded border-2 ${
            back_color === "orange"
              ? "border-orange group-hover:bg-orange"
              : "border-green group-hover:bg-green"
          } bg-creme `}
        ></span>
        <span
          className={`font-antonio relative text-xl tracking-wider ${
            back_color === "orange" ? "text-orange" : "text-green"
          }  group-hover:text-blue`}
        >
          Button
        </span>
      </a>
    </div>
  );
};

export default Button;
