import React from "react";

interface ButtonProps {
  back_color: "orange" | "blue" | "green";
  content: string;
  tw_text_size: string;
  id: string;
  handlerFn: (id: string) => void;
}

function AsignColor(
  color: "blue" | "orange" | "green",
  place: "top" | "middle" | "bottom",
) {
  if (place === "middle") {
    if (color === "blue") {
      return "border-blue group-hover:bg-blue ";
    } else if (color === "green") {
      return "border-green group-hover:bg-green";
    } else {
      return "border-orange group-hover:bg-orange";
    }
  }

  if (place === "top") {
    if (color === "blue") {
      return "bg-blue";
    } else if (color === "green") {
      return "bg-green";
    } else {
      return "bg-orange";
    }
  }

  if (place === "bottom") {
    if (color === "blue") {
      return "group-hover:text-creme";
    } else if (color === "green") {
      return "text-green";
    } else {
      return "text-orange";
    }
  }
}

const Button: React.FC<ButtonProps> = ({
  back_color,
  content,
  tw_text_size,
  id,
  handlerFn,
}) => {
  return (
    <button
      className="inline-block items-center justify-center "
      onClick={() => handlerFn(id)}
    >
      <a
        href="#_"
        className="group relative inline-block px-6 py-2 font-medium"
      >
        <span
          className={`absolute inset-0 h-full w-full translate-x-1 translate-y-1 transform rounded ${AsignColor(
            back_color,
            "top",
          )}  transition duration-200 ease-out group-hover:-translate-x-0 group-hover:-translate-y-0`}
        ></span>
        <span
          className={`absolute inset-0 h-full w-full rounded border-2 ${AsignColor(
            back_color,
            "middle",
          )} bg-creme `}
        ></span>
        <span
          className={`font-antonio relative ${
            tw_text_size ?? " text-xl"
          } uppercase tracking-wider ${AsignColor(back_color, "bottom")}  `}
        >
          {content}
        </span>
      </a>
    </button>
  );
};

export default Button;
